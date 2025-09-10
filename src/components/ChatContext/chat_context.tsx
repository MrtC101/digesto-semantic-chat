import { createContext, useMemo, useState } from "react";
import { Chat } from "@/components/Chat/types";

export interface ChatContextType {
  chats: Chat[];
  setChats: ReturnType<typeof useState<Chat[]>>[1];
  activeChat: Chat | undefined; // Permitir undefined
  setActiveChatId: ReturnType<typeof useState<string | null>>[1];
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat: Chat | undefined = useMemo(
    () => chats.find((c) => c.sessionId === activeChatId),
    [chats, activeChatId]
  );

  return (
    <ChatContext.Provider
      value={{ chats, setChats, activeChat, setActiveChatId }}
    >
      {children}
    </ChatContext.Provider>
  );
}