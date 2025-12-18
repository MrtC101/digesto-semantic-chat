import { useContext } from "react";
import { ChatContext, ChatContextType } from "@/contexts/chat_context";

function useChatContext(): ChatContextType {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  
  return context;
}

export default useChatContext;