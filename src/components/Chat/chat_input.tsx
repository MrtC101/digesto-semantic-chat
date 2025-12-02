import useChatContext from "@/hooks/use-chat-context-hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import chatService from "@/lib/chat_service";
import { welcome_msg } from "../predfined";

function ChatInput() {
  const {
    allChats,
    sessionId,
    filters,
    tag,
    isLoading,
    isInit,
    setTopic,
    setIsLoading,
    setIsInit,
    addMessage,
  } = useChatContext();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [textareaRows, setTextareaRows] = useState(0);
  const maxRows = 4;

  useEffect(() => {
    if (!isInit) {
      /*Initialize new chat*/
      addMessage("assistant", welcome_msg);
      if (tag.letter !== "N") {
        addMessage("user", tag.letter);
        setIsLoading(true);
        const set_mode = async () => {
          const [msg, topic] = await chatService(sessionId, tag.letter, filters);
          addMessage("assistant", msg);
          setTopic(topic);
          setIsLoading(false);
        };
        set_mode();
      }
      setIsInit(true);
    }
  }, [addMessage, filters, isInit, sessionId, setIsInit, setTopic, setIsLoading, tag.letter]);

  const handleSendMessage = () => {
    setIsLoading(true)
    if (allChats.length === 0 || !inputText.trim() || isLoading) return;
    addMessage("user", inputText);    
    const fetchMsg = async () => {
      const [msg, topic] = await chatService(sessionId, inputText, filters);
      addMessage("assistant", msg);
      setTopic(topic);
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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lineCount = e.target.value.split("\n").length;
    const rows = Math.min(maxRows, lineCount);
    setInputText(e.target.value);
    setTextareaRows(rows);
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  if (allChats.length === 0) return null;
  return (
    <>
      <div className="flex gap-2 mt-4 items-center">
        <Textarea
          ref={inputRef}
          placeholder="Escribe tu consulta aquí..."
          value={inputText}
          onChange={handleInput}
          onKeyDown={handleKeyPress}
          className="flex-1 resize-none h-[60px] max-h-[160px] overflow-y-auto"
          disabled={isLoading}
          rows={textareaRows}
        />
        <Button
          className="h-full flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Presiona Enter para enviar • Normita puede cometer errores, por favor
        verifica las respuestas.
      </p>
    </>
  );
}

export default ChatInput;
