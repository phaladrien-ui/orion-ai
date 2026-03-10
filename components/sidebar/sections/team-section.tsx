"use client";

import { CpuIcon, ShieldCheckIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TeamSectionProps {
  permissions: {
    canSeeCto: boolean;
  };
}

export function TeamSection({ permissions }: TeamSectionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "1") {
        e.preventDefault();
        router.push("/ceo");
      }
      if (e.ctrlKey && e.key === "2" && permissions.canSeeCto) {
        e.preventDefault();
        router.push("/cto");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, permissions.canSeeCto]);

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
        >
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors w-full flex items-center justify-between group">
              <span>Team</span>
              {isHovered && (
                <ChevronRightIcon 
                  className={`h-3 w-3 text-muted-foreground/50 transition-all duration-200 ${
                    isOpen ? 'rotate-90' : ''
                  }`} 
                />
              )}
            </SidebarGroupLabel>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="h-9 w-full transition-colors cursor-pointer"
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
                </SidebarMenuButton>
              </SidebarMenuItem>

              {permissions.canSeeCto && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="h-9 w-full transition-colors cursor-pointer"
                    onClick={() => router.push("/cto")}
                  >
                    <div className="flex items-center gap-3">
                      <CpuIcon className="text-muted-foreground/70" size={16} />
                      <span className="text-sm font-normal tracking-widest text-foreground/90">
                        CTO AI
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}