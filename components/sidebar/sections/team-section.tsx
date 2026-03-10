"use client";

import { CpuIcon, ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface TeamSectionProps {
  permissions: {
    canSeeCto: boolean;
  };
}

export function TeamSection({ permissions }: TeamSectionProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+1 pour CEO AI
      if (e.ctrlKey && e.key === "1") {
        e.preventDefault();
        router.push("/ceo"); // Adapte le chemin
      }

      // Ctrl+2 pour CTO AI (seulement si visible)
      if (e.ctrlKey && e.key === "2" && permissions.canSeeCto) {
        e.preventDefault();
        router.push("/cto"); // Adapte le chemin
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, permissions.canSeeCto]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Team
        <span className="ml-auto text-xs font-normal text-muted-foreground/50">
          Ctrl+1/2
        </span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* CEO AI */}
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9 w-full transition-colors cursor-pointer justify-between"
              onClick={() => router.push("/ceo")}
            >
              <div className="flex items-center gap-3">
                <ShieldCheckIcon
                  className="text-muted-foreground/70"
                  size={16}
                />
                <span className="text-sm font-normal tracking-widest text-foreground/90">
                  CEO AI
                </span>
              </div>
              <span className="text-xs text-muted-foreground/50">Ctrl+1</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* CTO AI (conditionnel) */}
          {permissions.canSeeCto && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="h-9 w-full transition-colors cursor-pointer justify-between"
                onClick={() => router.push("/cto")}
              >
                <div className="flex items-center gap-3">
                  <CpuIcon className="text-muted-foreground/70" size={16} />
                  <span className="text-sm font-normal tracking-widest text-foreground/90">
                    CTO AI
                  </span>
                </div>
                <span className="text-xs text-muted-foreground/50">Ctrl+2</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
