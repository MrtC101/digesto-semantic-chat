import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import ChatItems from "@/components/Chat/Sidebar/chat_items";
import { useState } from "react";
import type { Chat } from "../types";
import PageHeader from "@/components/PageHeader";

function SideBar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 flex-shrink-0">
        <PageHeader />
        <h2 className="font-semibold text-lg">Chats</h2>
        <p className="text-sm text-muted-foreground">
          Historial de conversaciones
        </p>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <ChatItems/>
      </SidebarContent>
    </Sidebar>
  );
}

export default SideBar;
