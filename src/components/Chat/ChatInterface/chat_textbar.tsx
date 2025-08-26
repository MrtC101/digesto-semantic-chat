import useChatContext from "@/hooks/use_chat_context_hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send } from "lucide-react";

interface ChatTextBarProps {
  sessionId: string;
}

function ChatTextBar({ sessionId }: ChatTextBarProps) {
  const [inputText, setInputText] = useState("");
  const { isLoading, setUserMsg } = useChatContext();

  const handleSendMessage = () => {
    if (!inputText.trim() || isLoading) return;
    setUserMsg(inputText);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Escribe tu consulta aquí..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
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

export default ChatTextBar;