import useChatContext from "@/hooks/use_chat_context_hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import callAPI from "@/lib/api";
import { welcome_msg } from "../predfined";

function ChatInput() {
  const {
    allChats,
    sessionId,
    filters,
    tag,
    isLoading,
    isInit,
    setIsLoading,
    setIsInit,
    addMessage,
  } = useChatContext();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInit) {
      /*Initialize new chat*/
      addMessage("assistant", welcome_msg);
      if (tag.letter !== "N") {
        addMessage("user", tag.letter);
        setIsLoading(true);
        const set_mode = async () => {
          const msg = await callAPI(sessionId, tag.letter, filters);
          addMessage("assistant", msg);
          setIsLoading(false);
        };
        set_mode();
      }
      setIsInit(true);
    }
  }, [addMessage, filters, isInit, sessionId, setIsInit, setIsLoading, tag.letter]);

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
        Presiona Enter para enviar • Normita puede cometer errores, por favor verifica las respuestas.
      </p>
    </>
  );
}

export default ChatInput;
