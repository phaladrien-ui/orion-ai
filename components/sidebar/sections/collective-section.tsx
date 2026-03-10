"use client";

import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

interface CollectiveSectionProps {
  permissions: {
    canUseNewSession: boolean;
  };
}

export function CollectiveSection({ permissions }: CollectiveSectionProps) {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N pour New Session
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        if (permissions.canUseNewSession) {
          router.push("/");
          router.refresh();
        }
      }

      // Ctrl+K déjà utilisé dans l'en-tête
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, permissions.canUseNewSession]);

  const handleClick = () => {
    if (permissions.canUseNewSession) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Collective Suite
        <span className="ml-auto text-xs font-normal text-muted-foreground/50">
          Ctrl+N
        </span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            {permissions.canUseNewSession ? (
              <SidebarMenuButton
                asChild
                className="justify-between"
                onClick={handleClick}
              >
                <Link className="flex items-center gap-2" href="/">
                  <UsersIcon size={16} />
                  <span className="text-sm font-medium">New Session</span>
                  <span className="text-xs text-muted-foreground/50 ml-auto">
                    Ctrl+N
                  </span>
                </Link>
              </SidebarMenuButton>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    className="opacity-50 cursor-not-allowed text-muted-foreground justify-between"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center gap-2">
                      <UsersIcon size={16} />
                      <span className="text-sm font-medium">New Session</span>
                    </div>
                    <span className="text-xs text-muted-foreground/50">
                      Ctrl+N
                    </span>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Sign in to create a new session
                </TooltipContent>
              </Tooltip>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
