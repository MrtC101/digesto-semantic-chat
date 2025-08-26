import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import ChatItems from "@/components/Chat/Sidebar/chat_items";
import { useState } from "react";
import type { Chat } from "../types";

interface AppSidebarProps {
  newChatState: ReturnType<typeof useState<Chat | undefined>>;
  activeChatState: ReturnType<typeof useState<Chat | undefined>>;
}

function SideBar({ newChatState, activeChatState }: AppSidebarProps) {
  
  return (
    <div className="w-60 border-r flex flex-col">
      <SidebarProvider className="flex-1 min-h-0">
        <Sidebar className="flex-1 flex flex-col relative">
          <SidebarHeader className="border-b p-4 flex-shrink-0">
            <h2 className="font-semibold text-lg">Chats</h2>
            <p className="text-sm text-muted-foreground">
              Historial de conversaciones
            </p>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto">
            <ChatItems
              newChatState={newChatState}
              activeChatState={activeChatState}
            />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default SideBar;