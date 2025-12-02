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
    <SidebarMenu>
      {chatItems.map((item, index) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => handleChatSelect(item.chat)}
            disabled={isLoading}
            className={`flex flex-col items-start gap-1 p-1 ${
              item.sessionId === sessionId
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
          >
            <div className="grid grid-cols-[32px_1fr_auto_auto] items-center gap-2 w-full h-full">
              <span className="ml-2 mr-2 h-4 w-4 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                {item.tag}
              </span>
              <div className="text-xs truncate" title={item.topic}>
                {item.topic || "Chat sin iniciar"}
              </div>
              {item.sessionId === sessionId && isLoading && (
                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
              )}

              {item.sessionId !== sessionId && (
                <div
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.sessionId)}
                >
                  <Trash2 className="h-4 w-4" />
                </div>
              )}
            </div>
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
