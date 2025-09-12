import { createContext, useMemo, useState } from "react";
import { Chat } from "@/components/Chat/types";

export interface ChatContextType {
  chats: Chat[];
  updateChats:(newChat: Chat) => void
  activeChat: Chat | undefined; // Permitir undefined
  setActiveChatId: ReturnType<typeof useState<string | null>>[1];
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChat: Chat = getActiveChat();
  const updateChats = (newChat: Chat) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.sessionId === newChat.sessionId ? newChat : chat
      )
    );
  };
  function getActiveChat(): Chat | undefined {
    return chats.find((c) => c.sessionId === activeChatId);
  }
  return (
    <ChatContext.Provider
      value={{ chats, updateChats, activeChat, setActiveChatId }}
    >
      {children}
    </ChatContext.Provider>
  );
}