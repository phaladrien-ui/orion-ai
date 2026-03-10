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

        {/* Conteneur flex column avec hauteur fixe */}
        <div className="flex h-full flex-col">
          {/* Sections supérieures avec scroll si nécessaire */}
          <div className="flex-1 overflow-y-auto">
            <TeamSection permissions={permissions} />
            <CollectiveSection permissions={permissions} />
            <OperationsSection user={user} />
          </div>

          {/* Resources TOUJOURS en bas, non scrollable */}
          <div className="mt-auto border-t pt-2">
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
