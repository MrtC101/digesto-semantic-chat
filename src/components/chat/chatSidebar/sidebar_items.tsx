import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Chat } from "@/components/chat/types";
import useChatContext from "@/hooks/use-chat-context-hook";
import { Trash2 } from "lucide-react";

interface ChatItem {
  id: string;
  tag: string;
  sessionId: string;
  topic: string;
  chat: Chat;
}
function SideBarItem() {
  const {sessionId, isLoading, allChats, switchToChat, deleteChat } = useChatContext();

  const chatItems: ChatItem[] = allChats.map((chat) => ({
    id: chat.sessionId,
    tag: chat.tag.letter,
    sessionId: chat.sessionId,
    topic: chat.topic,
    chat,
  }));

  const handleChatSelect = (chat: Chat) => {
    // Prevenir cambios durante carga
    if (!isLoading) {
      switchToChat(chat.sessionId);
    }
  };

  const handleDelete = (sessionId) => {
    deleteChat(sessionId);
  };

  return (
    <SidebarMenu className="p-2">
      {chatItems.map((item, index) => (
        <SidebarMenuItem key={item.id} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <SidebarMenuButton
            onClick={() => handleChatSelect(item.chat)}
            disabled={isLoading}
            tooltip={item.topic || "Chat sin iniciar"}
            isActive={item.sessionId === sessionId}
            className="p-2"
          >
            <span className="h-4 w-4 shrink-0 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
              {item.tag}
            </span>
            <span className="text-xs truncate flex-1" title={item.topic}>
              {item.topic || "Chat sin iniciar"}
            </span>
            {item.sessionId === sessionId && isLoading && (
              <div className="animate-spin h-3 w-3 shrink-0 border border-current border-t-transparent rounded-full" />
            )}
            {item.sessionId !== sessionId && (
              <div
                className="shrink-0 text-red-500 hover:text-red-700"
                onClick={(e) => { e.stopPropagation(); handleDelete(item.sessionId); }}
              >
                <Trash2 className="h-4 w-4" />
              </div>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      {chatItems.length === 0 && (
        <SidebarMenuItem>
          <div className="p-4 text-sm text-muted-foreground text-center">
            No hay chats activos
          </div>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}

export default SideBarItem;
