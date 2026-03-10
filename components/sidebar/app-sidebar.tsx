"use client";

import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useState } from "react";
import {
  Sidebar,
  SidebarHeader as UISidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebarPermissions } from "@/hooks/sidebar/use-sidebar-permissions";
import { DeleteAllDialog } from "./delete-all-dialog";
import { SidebarFooter } from "./footer/sidebar-footer";
import { CollectiveSection } from "./sections/collective-section";
import { OperationsSection } from "./sections/operations-section";
import { ResourcesSection } from "./sections/resources-section";
import { TeamSection } from "./sections/team-section";
import { SidebarHeader } from "./sidebar-header";

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
            onDeleteAll={() => setShowDeleteAllDialog(true)}
            user={user}
          />
        </UISidebarHeader>

        {/* Structure en colonne avec sections fixes et défilante */}
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Sections fixes en haut */}
          <div className="flex-shrink-0">
            <TeamSection permissions={permissions} />
            <CollectiveSection permissions={permissions} />
          </div>

          {/* Section des messages - défilante */}
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
        isDeleting={isDeleting}
        onDelete={handleDeleteAll}
        onOpenChange={setShowDeleteAllDialog}
        open={showDeleteAllDialog}
      />
    </>
  );
}
