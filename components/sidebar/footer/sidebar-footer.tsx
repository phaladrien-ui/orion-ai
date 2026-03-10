"use client";

import type { User } from "next-auth";
import { useState } from "react";
import { KeyboardIcon, XIcon } from "lucide-react";
import { SidebarFooter as UISidebarFooter } from "@/components/ui/sidebar";
import { SidebarUserNav } from "@/components/sidebar/sidebar-user-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function SidebarFooter({ user }: { user: User | undefined }) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <UISidebarFooter>
      <div className="flex items-center justify-between p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowShortcuts(!showShortcuts)}
            >
              <KeyboardIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Keyboard shortcuts
          </TooltipContent>
        </Tooltip>

        {user && <SidebarUserNav user={user} />}
      </div>

      {/* Tableau stylé des raccourcis */}
      {showShortcuts && (
        <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Keyboard Shortcuts
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setShowShortcuts(false)}
            >
              <XIcon size={12} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-sidebar-accent rounded border border-sidebar-border">
                ⌘1
              </kbd>
              <span className="text-muted-foreground">CEO AI</span>
            </div>
            
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-sidebar-accent rounded border border-sidebar-border">
                ⌘2
              </kbd>
              <span className="text-muted-foreground">CTO AI</span>
            </div>
            
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-sidebar-accent rounded border border-sidebar-border">
                ⌘N
              </kbd>
              <span className="text-muted-foreground">New Session</span>
            </div>
          </div>
          
          <div className="mt-2 text-[10px] text-muted-foreground/50 text-center border-t border-sidebar-border pt-2">
            ⌘ = Ctrl on Windows
          </div>
        </div>
      )}
    </UISidebarFooter>
  );
}