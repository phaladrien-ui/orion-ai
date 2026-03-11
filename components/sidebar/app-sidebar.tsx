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
      <Sidebar className="flex flex-col h-screen group-data-[side=left]:border-r-0">
        <UISidebarHeader className="flex-shrink-0 pt-4">
          <SidebarHeader
            onDeleteAll={() => setShowDeleteAllDialog(true)}
            user={user}
          />
        </UISidebarHeader>

        {/* Sections fixes du haut - Team est replié mais montre CEO AI */}
        <div className="flex-shrink-0 px-2">
          <TeamSection permissions={permissions} />
          <CollectiveSection permissions={permissions} />
        </div>

        {/* Zone défilante pour l'historique uniquement */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2">
          <OperationsSection user={user} />
        </div>

        {/* Section fixe du bas - Resources ouvert par défaut */}
        <div className="flex-shrink-0 px-2">
          <ResourcesSection permissions={permissions} />
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
