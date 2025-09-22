import useChatContext from "@/hooks/use_chat_context_hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import callAPI from "@/lib/api";
import { Chat, ChatMessage } from "./types";

function ChatInput() {
  const {
    allChats,
    sessionId, 
    filters,
    isLoading,
    setIsLoading,
    addMessage
  } = useChatContext();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {

    setIsLoading(true)
    if (allChats.length === 0 || !inputText.trim() || isLoading) return;
    addMessage("user", inputText);    
    const fetchMsg = async () => {
      const msg = await callAPI(sessionId, inputText, filters);
      addMessage("assistant", msg);
      setIsLoading(false);
      setInputText("");
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
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  if (allChats.length === 0) return null;
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
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
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
