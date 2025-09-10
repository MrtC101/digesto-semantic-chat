import useChatContext from "@/hooks/use_chat_context_hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import callAPI from "@/lib/api";
import { Chat, ChatMessage } from "./types";

function ChatInput() {
  const { activeChat, setChats, chats } = useChatContext();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat || activeChat.isLoading) return;

    // Crear nuevo mensaje
    const newMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      message: inputText,
      timestamp: new Date(),
    };
    
    // Actualizar el chat correctamente
    setChats((prev) =>
      chats.map((chat) =>
        chat.sessionId === activeChat.sessionId
          ? {
              ...chat,
              isLoading: true,
              messages: [...chat.messages, newMessage],
            }
          : chat
      )
    );
    console.log(chats)
    callAPI(activeChat);
    setInputText("");
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
