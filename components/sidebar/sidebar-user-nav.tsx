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
import { guestRegex } from "@/lib/constants";

// Clé pour le sessionStorage
const LOGIN_PROMPT_SHOWN_KEY = "loginPromptShown";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Déterminer le type d'utilisateur
  const isGuest = guestRegex.test(session?.user?.email ?? "");

  // Afficher la modale UNE SEULE FOIS si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    // Vérifier si la modale a déjà été affichée dans cette session
    const hasPromptBeenShown =
      sessionStorage.getItem(LOGIN_PROMPT_SHOWN_KEY) === "true";

    // Afficher la modale uniquement pour les utilisateurs non authentifiés
    // et seulement si elle n'a pas déjà été affichée
    if (status === "unauthenticated" && !hasPromptBeenShown) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        // Marquer que la modale a été affichée
        sessionStorage.setItem(LOGIN_PROMPT_SHOWN_KEY, "true");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [status]); // Dépend seulement de status, pas de la modale

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    router.push("/login");
  };

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false);
    // Optionnel: On pourrait réinitialiser le flag si on veut que la modale
    // se réaffiche après un certain temps ou une action spécifique
    // sessionStorage.removeItem(LOGIN_PROMPT_SHOWN_KEY);
  };

  const handleAuthAction = () => {
    if (status === "loading") {
      toast({
        type: "error",
        description: "Checking authentication status, please try again!",
      });
      return;
    }

    if (status === "authenticated") {
      if (isGuest) {
        // Les utilisateurs invités peuvent se connecter
        router.push("/login");
      } else {
        // Les utilisateurs authentifiés peuvent se déconnecter
        handleLogout();
      }
    } else {
      // Les utilisateurs non authentifiés vont à la page de connexion
      router.push("/login");
    }
  };

  // Déterminer l'email à afficher
  const displayEmail = () => {
    if (status === "loading") {
      return "Loading...";
    }
    if (status === "unauthenticated") {
      return "Not signed in";
    }
    if (isGuest) {
      return "Guest";
    }
    return session?.user?.email || user?.email || "User";
  };

  // Déterminer la source de l'avatar
  const avatarSrc = session?.user?.email
    ? `https://avatar.vercel.sh/${session.user.email}`
    : `https://avatar.vercel.sh/${user?.email || "default"}`;

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
                    alt={displayEmail()}
                    className="rounded-full"
                    height={24}
                    src={avatarSrc}
                    width={24}
                  />
                  <span className="truncate" data-testid="user-email">
                    {displayEmail()}
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
                onSelect={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                }}
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
                  {status === "authenticated"
                    ? isGuest
                      ? "Login to your account"
                      : "Sign out"
                    : "Sign in"}
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
              Are you sure you want to sign out?
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
              You're browsing as a guest. Sign in to access your account.
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
