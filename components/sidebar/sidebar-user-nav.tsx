"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LoaderIcon } from "@/components/icons";
import { toast } from "@/components/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthSync } from "@/hooks/use-auth-sync";
import { guestRegex } from "@/lib/constants";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Activer la synchronisation entre onglets
  useAuthSync();

  const isGuest = guestRegex.test(data?.user?.email ?? "");
  const isAuthenticated = !isGuest && !!user;

  // Fonction pour notifier les autres onglets
  const notifyAuthChange = () => {
    const channel = new BroadcastChannel("auth_sync");
    channel.postMessage({ type: "AUTH_CHANGED" });
    channel.close();
  };

  // Vérifier au chargement si on doit afficher la modale de connexion
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!isAuthenticated) {
      const hasSeenPrompt = sessionStorage.getItem("hasSeenLoginPrompt");

      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setShowLoginPrompt(true);
          sessionStorage.setItem("hasSeenLoginPrompt", "true");
        }, 500);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [status, isAuthenticated]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);

    sessionStorage.removeItem("hasSeenLoginPrompt");

    signOut({ redirect: false }).then(() => {
      // Notifier les autres onglets
      notifyAuthChange();
      // Rechargement complet après déconnexion
      window.location.href = "/";
    });
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    notifyAuthChange(); // Notifier avant de partir
    router.push("/login");
  };

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false);
  };

  const handleAuthAction = () => {
    if (status === "loading") {
      toast({
        type: "error",
        description: "Checking authentication status, please try again!",
      });
      return;
    }

    if (isGuest) {
      notifyAuthChange(); // Notifier avant de partir
      router.push("/login");
    } else {
      handleLogout();
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {status === "loading" ? (
                <SidebarMenuButton className="h-10 justify-between bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex flex-row gap-2">
                    <div className="size-6 animate-pulse rounded-full bg-zinc-500/30" />
                    <span className="animate-pulse rounded-md bg-zinc-500/30 text-transparent">
                      Loading auth status
                    </span>
                  </div>
                  <div className="animate-spin text-zinc-500">
                    <LoaderIcon />
                  </div>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  data-testid="user-nav-button"
                >
                  <Image
                    alt={user.email ?? "User Avatar"}
                    className="rounded-full"
                    height={24}
                    src={`https://avatar.vercel.sh/${user.email}`}
                    width={24}
                  />
                  <span className="truncate" data-testid="user-email">
                    {isGuest ? "Guest" : user?.email}
                  </span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-popper-anchor-width)"
              data-testid="user-nav-menu"
              side="top"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                data-testid="user-nav-item-theme"
                onSelect={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild data-testid="user-nav-item-auth">
                <button
                  className="w-full cursor-pointer"
                  onClick={handleAuthAction}
                  type="button"
                >
                  {isGuest ? "Login to your account" : "Sign out"}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Modale de confirmation de déconnexion */}
      <AlertDialog onOpenChange={setShowLogoutConfirm} open={showLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You can always sign back in to
              access your conversations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale d'invitation à se connecter */}
      <Dialog onOpenChange={setShowLoginPrompt} open={showLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome back!</DialogTitle>
            <DialogDescription>
              You're currently browsing as a guest. Sign in to access your
              account and saved conversations.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button className="w-full" onClick={handleLoginRedirect}>
              Sign in
            </Button>
            <Button
              className="w-full"
              onClick={handleContinueAsGuest}
              variant="outline"
            >
              Continue as guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
