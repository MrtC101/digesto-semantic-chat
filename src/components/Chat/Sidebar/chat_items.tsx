import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Chat } from "../types";
import useChatContext from "@/hooks/use_chat_context_hook";

interface ChatItem {
  id: string;
  tag: string;
  sessionId: string;
  chat: Chat;
}

function ChatItems() {

  const { chats, activeChat, setActiveChatId} = useChatContext()

  const chatItems: ChatItem[] = chats.map((chat) => ({
    id: chat.sessionId,
    tag: chat.tag.name,
    sessionId: chat.sessionId,
    chat,
  }));

  const handleChatSelect = (chat: Chat) => {
    setActiveChatId(chat.sessionId);
  };

  return (
    <SidebarMenu>
      {chatItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => handleChatSelect(item.chat)}
            className={`flex flex-col items-start gap-1 p-1 ${
              activeChat?.sessionId === item.sessionId
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
          >
            <div className="flex justify-center items-center gap-2 w-full h-full">
              <Badge variant="secondary" className="text-xs">
                {item.tag}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.sessionId.slice(-8)}
              </Badge>
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

export default ChatItems;
