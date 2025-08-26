import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { Chat } from "../types";

interface ChatItem {
  id: string;
  tag: string;
  sessionId: string;
  chat: Chat;
}

interface ChatItemsProps {
  newChatState: ReturnType<typeof useState<Chat | undefined>>;
  activeChatState: ReturnType<typeof useState<Chat | undefined>>;
}

function ChatItems({ 
  newChatState: [newChat], 
  activeChatState: [activeChat, setActiveChat] 
}: ChatItemsProps) {
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);

  useEffect(() => {
    if (newChat) {
      const newItem: ChatItem = {
        id: Date.now().toString(),
        tag: newChat.tag.name,
        sessionId: newChat.sessionId,
        chat: newChat,
      };
      setChatItems((prev) => [...prev, newItem]);
      setActiveChat(newChat);
    }
  }, [newChat, setActiveChat]);

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
  };

  return (
    <SidebarMenu>
      {chatItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton 
            onClick={() => handleChatSelect(item.chat)}
            className={`flex flex-col items-start gap-1 p-3 ${
              activeChat?.sessionId === item.sessionId 
                ? 'bg-accent text-accent-foreground' 
                : ''
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <Badge variant="outline" className="text-xs">
                {item.sessionId.slice(-8)}
              </Badge>
            </div>
            <Badge variant="secondary" className="text-xs">
              {item.tag}
            </Badge>
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