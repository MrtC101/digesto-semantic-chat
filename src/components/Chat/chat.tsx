import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import useChatContext from "@/hooks/use_chat_context_hook";
import ChatInput from "@/components/Chat/chat_input";
import { ChatMessage, LoadingDisplay } from "@/components/Chat/chat_message";
import FilterButton from "./Filter/filter";
import {motion , AnimatePresence} from "framer-motion";

function ChatHeader() {
  const { sessionId, filters } = useChatContext();
  const activeFilters = Object.values(filters).filter((v) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "");
  const filterCounts = activeFilters.length;

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary p-2 rounded-full">
          <MessageSquare className="h-5 w-5" />
        </div>
        <span className="hidden sm:inline">
          ¡Chateá con <span className="font-bold text-primary">Normita</span>!
        </span>
      </CardTitle>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {filterCounts > 0 && (
          <Badge variant="secondary">{filterCounts} filtros activos</Badge>
        )}
        <FilterButton />
        <Badge variant="outline">
          Sesión: {sessionId.slice(-8)}
        </Badge>
      </div>
    </div>
  );
}

const ChatInterface = () => {
  const { allChats, isLoading, messages, setIsLoading } = useChatContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ((messages.length > 0 || isLoading) && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages.length, isLoading]);

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
    <Card className="flex-1 flex flex-col w-full h-full max-h-[90vh]">
      <CardHeader className="pb-3 transition-opacity duration-500">
        <ChatHeader />
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 flex flex-col flex-1 min-h-0">
        <ScrollArea
          className="flex-1 overflow-y-auto w-full pr-4"
          style={{ height: "70vh" }}
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
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
    </Card>
  );
};

export default ChatInterface;
