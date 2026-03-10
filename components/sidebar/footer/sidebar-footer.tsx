"use client";

import type { User } from "next-auth";
import { useState } from "react";
import { KeyboardIcon } from "lucide-react";
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
    <UISidebarFooter className="p-0"> {/* ← Supprime le padding par défaut */}
      <div className="w-full">
        {/* Barre principale avec les mêmes padding que le header */}
        <div className="flex items-center justify-between px-2 py-2">
          <div
            className="relative"
            onMouseEnter={() => setShowShortcuts(true)}
            onMouseLeave={() => setShowShortcuts(false)}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <KeyboardIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Keyboard shortcuts
              </TooltipContent>
            </Tooltip>

            {/* Tableau des raccourcis */}
            {showShortcuts && (
              <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-popover rounded-lg shadow-lg border border-border animate-in fade-in slide-in-from-bottom-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Keyboard Shortcuts
                </h4>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded border">
                      Ctrl+1
                    </kbd>
                    <span className="text-muted-foreground">CEO AI</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded border">
                      Ctrl+2
                    </kbd>
                    <span className="text-muted-foreground">CTO AI</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted rounded border">
                      Ctrl+N
                    </kbd>
                    <span className="text-muted-foreground">New Session</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {user && <SidebarUserNav user={user} />}
        </div>
      </div>
    </UISidebarFooter>
  );
}