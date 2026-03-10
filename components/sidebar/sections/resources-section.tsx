"use client";

import { FolderRootIcon, RocketIcon, UserPlusIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ResourcesSectionProps {
  permissions: {
    canUseWorkspace: boolean;
    canUseDeployments: boolean;
    canUseRecruitment: boolean;
    isConnected: boolean;
  };
}

export function ResourcesSection({ permissions }: ResourcesSectionProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); // Ouvert par défaut (tous visibles)
  const [isHovered, setIsHovered] = useState(false);

  const handleRecruitmentClick = (e: React.MouseEvent) => {
    if (!permissions.isConnected) {
      e.preventDefault();
      router.push("/login?redirect=/recruitment");
    }
  };

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
              <span>Resources</span>
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
              {/* Workspace */}
              <SidebarMenuItem>
                {permissions.canUseWorkspace ? (
                  <SidebarMenuButton asChild>
                    <Link className="flex items-center gap-2" href="/projects">
                      <FolderRootIcon size={16} />
                      <span className="text-sm font-medium">Workspace</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton 
                        className="opacity-50 cursor-not-allowed text-muted-foreground"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FolderRootIcon size={16} />
                        <span className="text-sm font-medium">Workspace</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Sign in to access your workspace
                    </TooltipContent>
                  </Tooltip>
                )}
              </SidebarMenuItem>

              {/* Deployments */}
              <SidebarMenuItem>
                {permissions.canUseDeployments ? (
                  <SidebarMenuButton asChild>
                    <Link className="flex items-center gap-2" href="/deployments">
                      <RocketIcon size={16} />
                      <span className="text-sm font-medium">Deployments</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton 
                        className="opacity-50 cursor-not-allowed text-muted-foreground"
                        onClick={(e) => e.preventDefault()}
                      >
                        <RocketIcon size={16} />
                        <span className="text-sm font-medium">Deployments</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Sign in to deploy your project
                    </TooltipContent>
                  </Tooltip>
                )}
              </SidebarMenuItem>

              {/* Recruitment */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    className="flex items-center gap-2" 
                    href="/recruitment"
                    onClick={handleRecruitmentClick}
                  >
                    <UserPlusIcon size={16} />
                    <span className="text-sm font-medium">Recruitment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}