import { ChatContext, ChatContextType } from "@/components/ChatContext";
import { useContext } from "react";

const useChatContext = () => {
  const context = useContext<ChatContextType>(ChatContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export default useChatContext;
