"use client";

import { FolderRootIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import {
  getChatHistoryPaginationKey,
  SidebarHistory,
} from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

// --- LOGO ORION ---
const OrionLogo = ({ size = 24 }: { size?: number }) => (
  <svg
    height={size}
    shapeRendering="geometricPrecision"
    viewBox="0 0 200 200"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter height="200%" id="glow-sidebar" width="200%" x="-50%" y="-50%">
        <feGaussianBlur result="coloredBlur" stdDeviation="5" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle
      className="stroke-black dark:stroke-white dark:[filter:url(#glow-sidebar)]"
      cx="100"
      cy="100"
      fill="none"
      r="85"
      stroke="currentColor"
      strokeWidth="10"
    />
  </svg>
);

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { mutate } = useSWRConfig();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  // Raccourci clavier fonctionnel (Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Supporte Ctrl+K (Windows/Linux) et Cmd+K (Mac) pour être universel
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenMobile(false);
        router.push("/");
        router.refresh();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router, setOpenMobile]);

  const handleDeleteAll = () => {
    const deletePromise = fetch("/api/history", { method: "DELETE" });
    toast.promise(deletePromise, {
      loading: "Deleting all chats...",
      success: () => {
        mutate(unstable_serialize(getChatHistoryPaginationKey));
        setShowDeleteAllDialog(false);
        router.replace("/");
        router.refresh();
        return "All chats deleted successfully";
      },
      error: "Failed to delete all chats",
    });
  };

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <SidebarHeader className="pt-4">
          <SidebarMenu>
            <div className="flex items-center justify-between px-2 pb-4">
              <Link
                className="flex items-center gap-3"
                href="/"
                onClick={() => setOpenMobile(false)}
              >
                <OrionLogo size={22} />
                <span className="font-semibold text-lg tracking-tight">
                  Orion
                </span>
              </Link>

              <div className="flex items-center gap-1">
                {user && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setOpenMobile(false);
                            router.push("/");
                            router.refresh();
                          }}
                          variant="ghost"
                        >
                          <PlusIcon size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>New Chat (Ctrl+K)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="h-8 w-8 p-0"
                          onClick={() => setShowDeleteAllDialog(true)}
                          variant="ghost"
                        >
                          <TrashIcon
                            className="text-muted-foreground"
                            size={16}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete all chats</TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* SECTION 1: QUICK ACTIONS */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-accent"
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link
                      className="flex items-center justify-between w-full"
                      href="/"
                    >
                      <div className="flex items-center gap-2">
                        <PlusIcon size={18} />
                        <span className="font-medium">New chat</span>
                      </div>
                      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/90 shadow-sm transition-colors">
                        Ctrl+K
                      </kbd>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* SECTION 2: PROJECTS */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Projects
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="opacity-80 hover:opacity-100"
                  >
                    <Link href="/projects">
                      <FolderRootIcon size={18} />
                      <span>Workspace</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* SECTION 3: CHATS */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Chats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarHistory user={user} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
      </Sidebar>

      <AlertDialog
        onOpenChange={setShowDeleteAllDialog}
        open={showDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your chats and remove them from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
