import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Chat } from "@/components/Chat/types";
import useChatContext from "@/hooks/use_chat_context_hook";
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
    tag: chat.tag.name,
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
              <div className="flex justify-center items-center w-6 h-6 rounded-full bg-black-50 border border-gray-400 text-xs font-semibold">
                {index + 1}
              </div>

              <div className="text-xs truncate" title={item.topic}>
                {item.topic}
              </div>

              <Badge variant="secondary" className="text-xs">
                {item.tag}
              </Badge>

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
