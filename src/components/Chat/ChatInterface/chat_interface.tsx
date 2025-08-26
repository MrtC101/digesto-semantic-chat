import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import useChatContext from "@/hooks/use_chat_context_hook";
import ChatTextBar from "@/components/Chat/ChatInterface/chat_textbar";
import {
  ChatMessage,
  LoadingDisplay,
} from "@/components/Chat/ChatInterface/chat_messages";
import FilterButton from "../Filter/filter";
import callAPI from "@/lib/api";

import type { Chat, ChatMessage as ChatMessageType } from "../types";

interface ChatHeaderProps {
  sessionId: string;
  filterCounts: number;
}

function ChatHeader({ sessionId, filterCounts }: ChatHeaderProps) {
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
        <Badge variant="outline">Sesión: {sessionId.slice(-8)}</Badge>
      </div>
    </div>
  );
}

interface ChatInterfaceProps {
  activeChatState: ReturnType<typeof useState<Chat | undefined>>;
}

const ChatInterface = ({ activeChatState }: ChatInterfaceProps) => {
  const [activeChat] = activeChatState;
  const {
    userMsg,
    assistantMsg,
    filters,
    messages,
    isLoading,
    setIsLoading,
    setAssistantMsg,
    setMessages,
    setUserMsg,
  } = useChatContext();

  const sessionId = activeChat?.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  ).length;

  useEffect(() => {
    // Adds Users Message to chat
    const AddUserMessage = () => {
      if (!userMsg.trim()) return;
      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        type: "user",
        message: userMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    };
    AddUserMessage();
    if (userMsg.trim()) {
      setUserMsg("");
    }
  }, [userMsg, setMessages, setUserMsg]);

  useEffect(() => {
    //Adds Assistance Message to chat
    const AddAssistanceMessage = () => {
      if (!assistantMsg) return;
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        message: assistantMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    };
    AddAssistanceMessage();
    if (assistantMsg) {
      setAssistantMsg("");
      setIsLoading(false);
    }
  }, [assistantMsg, setMessages, setAssistantMsg, setIsLoading]);

  //Call api
  useEffect(() => {
    if (!userMsg.trim()) return;
    setIsLoading(true);
    if (callAPI) {
      callAPI(sessionId, userMsg, filters, setAssistantMsg);
    }
  }, [userMsg, sessionId, filters, setIsLoading, setAssistantMsg]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length > 0 && scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <Card className="flex-1 flex flex-col w-full min-h-0 overflow-hidden">
      <CardHeader className="pb-3">
        <ChatHeader sessionId={sessionId} filterCounts={activeFiltersCount} />
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 flex flex-col flex-1 min-h-0">
        <ScrollArea
          className="flex-1 overflow-y-auto w-full pr-4"
          style={{ height: "70vh" }}
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? scrollAreaRef : null}
              >
                <ChatMessage message={message} />
              </div>
            ))}
            {isLoading && <LoadingDisplay />}
          </div>
        </ScrollArea>
        <ChatTextBar sessionId={sessionId} />
      </CardContent>
    </Card>
  );
};

export default ChatInterface;