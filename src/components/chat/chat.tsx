import { useEffect, useRef } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import useChatContext from "@/hooks/use-chat-context-hook";
import ChatInput from "@/components/chat/chat_input";
import { ChatMessage, LoadingDisplay } from "@/components/chat/chat_message";
import { motion } from "framer-motion";
import ChatHeader from "./chat_header";


const ChatInterface = () => {
  const { messages, allChats, isLoading } = useChatContext();  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      });
    }
  }, [messages, isLoading]);

  if (allChats.length === 0) {
    return (
      <Card className="flex-1 flex flex-col w-full h-full max-h-[90vh] overflow-hidden">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            Selecciona o crea un chat para comenzar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col bg-chat">
      <CardHeader className="transition-opacity duration-500 pt-3 pb-3">
          <ChatHeader />
      </CardHeader>
      <Separator />
      <div className="flex flex-col items-center max-h-[94vh]">      
        <CardContent className="flex flex-col min-h-0 pt-2 max-w-[1000px]">
          <ScrollArea
            className="overflow-y-auto w-full"
            style={{ height: "70vh" }}
          >
            <div className="space-y-4 w-full">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
              {isLoading && (
                <div className="animate-pulse">
                  <LoadingDisplay />
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>
          <ChatInput />
        </CardContent>
      </div>
    </Card>
  );
};

export default ChatInterface;
