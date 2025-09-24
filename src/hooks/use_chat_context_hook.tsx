import { useContext } from "react";
import { ChatContext, ChatContextType } from "@/components/ChatContext/chat_context";

export default function useChatContext(): ChatContextType {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  
  return context;
}