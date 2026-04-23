import useChatContext from "@/hooks/use-chat-context-hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import chatService from "@/lib/chat_service";
import { welcome_msg } from "../predfined";
import FilterButton from "@/components/chat/filter/filter";

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
      if (inputRef.current) inputRef.current.style.height = "auto";
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
    const el = e.target;
    el.style.height = "0px";
    const newHeight = Math.min(el.scrollHeight, 184);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > 184 ? "auto" : "hidden";
    setInputText(e.target.value);
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  if (allChats.length === 0) return null;
  return (
    <>
      <p className="text-xs text-muted-foreground mt-2 mb-2 text-center">
        Presiona Enter para enviar • Normita puede cometer errores, por favor
        verifica las respuestas.
      </p>
      <Textarea
        ref={inputRef}
        placeholder="Escribe tu consulta aquí..."
        value={inputText}
        onChange={handleInput}
        onKeyDown={handleKeyPress}
        className="w-full resize-none overflow-y-hidden"
        style={{ height: "auto", maxHeight: "184px" }}
        disabled={isLoading}
        rows={1}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <FilterButton />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

export default ChatInput;
