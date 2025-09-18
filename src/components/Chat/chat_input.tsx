import useChatContext from "@/hooks/use_chat_context_hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import callAPI from "@/lib/api";
import { Chat, ChatMessage } from "./types";

function ChatInput() {
  const {activeChat, updateChats} = useChatContext();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat || activeChat.isLoading) return;    
    updateChats(activeChat.addNewMessage("user", inputText));
    setInputText("");
    if (!activeChat || activeChat.messages.length === 0) return;
    const fetchMsg = async () => {
      const msg = await callAPI(activeChat);
      updateChats(activeChat.addNewMessage("assistant", msg));
    };
    fetchMsg();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!activeChat?.isLoading) {
      inputRef.current?.focus();
    }
  }, [activeChat?.isLoading]);

  if (!activeChat) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Input
          ref={inputRef}
          placeholder="Escribe tu consulta aquí..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
          disabled={activeChat.isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || activeChat.isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Presiona Enter para enviar • Los filtros activos se aplicarán
        automáticamente
      </p>
    </>
  );
}

export default ChatInput;
