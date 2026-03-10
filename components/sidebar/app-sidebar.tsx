"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { User } from "next-auth";
import { Sidebar, SidebarContent, SidebarHeader as UISidebarHeader } from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { TeamSection } from "./sections/team-section";
import { CollectiveSection } from "./sections/collective-section";
import { OperationsSection } from "./sections/operations-section";
import { ResourcesSection } from "./sections/resources-section";
import { SidebarFooter } from "./footer/sidebar-footer";
import { DeleteAllDialog } from "./delete-all-dialog";
import { useSidebarPermissions } from "@/hooks/sidebar/use-sidebar-permissions";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const permissions = useSidebarPermissions(user);

  const handleDeleteAll = async () => {
    if (isDeleting) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await fetch("/api/history", { method: "DELETE" });
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete all chats:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteAllDialog(false);
    }
  };

  return (
    <>
      <Sidebar className="group-data-[side=left]:border-r-0">
        <UISidebarHeader className="pt-4">
          <SidebarHeader 
            user={user} 
            onDeleteAll={() => setShowDeleteAllDialog(true)}
          />
        </UISidebarHeader>

        {/* Structure avec hauteur calculée pour permettre le défilement */}
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Sections du haut (Team + Collective) */}
          <div className="flex-shrink-0">
            <TeamSection permissions={permissions} />
            <CollectiveSection permissions={permissions} />
          </div>

          {/* Section des messages - défilante si trop longue */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <OperationsSection user={user} />
          </div>

          {/* Resources - fixe en bas */}
          <div className="flex-shrink-0">
            <ResourcesSection permissions={permissions} />
          </div>
        </div>

        <SidebarFooter user={user} />
      </Sidebar>

      <DeleteAllDialog 
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
        onDelete={handleDeleteAll}
        isDeleting={isDeleting}
      />
    </>
  );
}