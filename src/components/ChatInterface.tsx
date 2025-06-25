import { useEffect, useState, useRef } from "react";
import { MessageSquare, Bot, User, Scale, Search, Filter } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";

import useChatContext from "@/hooks/use-chat-context";

import { NormitaPicture } from "@/components/NormitaIcon";
import { SearchResult } from "./ChatContext";
import ChatTextBar from "./ChatTextBar";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  message: string;
  timestamp: Date;
  results?: SearchResult[];
}

function LoadingDisplay() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-3 max-w-[80%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
        <div className="rounded-lg p-3 bg-muted">
          <div className="flex items-center gap-2">
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
              <div
                className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">
              Esperando la respuesta...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: ChatMessage }) {
  return (
    <div
      key={message.id}
      className={`flex gap-3 ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          message.type === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {message.type === "user" ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600 text-white">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <NormitaPicture />
        )}

        <div className="rounded-lg p-3 bg-gray-600 text-white">
          <div
            className="
                      markdown
                      text-base
                      leading-relaxed
                      [&_a]:text-sky-300
                      [&_a]:underline
                      hover:[&_a]:text-sky-500
                      [&_p]:break-words
                      [&_p]:whitespace-pre-wrap
                      "
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked(message.message)),
            }}
          />
          <p className="text-xs opacity-70 mt-2">
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

const processResults = async () => {
  if (!response) return;
  searchContext.setIsLoading(true);

  if (!searchContext.response?.generated_response) return;
  const text = await marked(searchContext.response?.generated_response);
  const assistantMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    type: "assistant",
    message: text,
    timestamp: new Date(),
  };
  searchContext.setMessages((prev) => [...prev, assistantMessage]);

  searchContext.setIsLoading(false);
};

const AddDefaultMessage = () => {
  if (!searchContext.query.trim()) return;
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    type: "user",
    message: searchContext.query,
    timestamp: new Date(),
  };
  searchContext.setMessages((prev) => [...prev, userMessage]);
};

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
        <span>
          ¡Chateá con <span className="font-bold text-primary">Normita</span>!
        </span>
      </CardTitle>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline">Sesión: {sessionId.slice(-8)}</Badge>
        {filterCounts > 0 && (
          <Badge variant="secondary">{filterCounts} filtros activos</Badge>
        )}
      </div>
    </div>
  );
}

interface ChatInterfaceProps {
  sessionId: string;
}

const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
  const { filters, messages, isLoading } = useChatContext();

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  ).length;

  const scrollRef = useRef<HTMLDivElement>(null);

  // // Sends message to the chat:
  // useEffect(() => {
  //   AddDefaultMessage();
  // }, [query]);

  // // Handles the response message:
  // useEffect(() => {
  //   processResults();
  // }, [response, setIsLoading]);

  useEffect(() => {
    // Al actualizar mensajes, scrollear abajo
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex-1 flex-col md:flex-row w-full min-h-0 overflow-auto bg-card">
      <CardHeader className="pb-3">
        <ChatHeader sessionId={sessionId} filterCounts={activeFiltersCount} />
      </CardHeader>
      <CardContent className="pt-5">
        <ScrollArea
          ref={scrollRef}
          className="overflow-y-auto w-full pr-4"
          style={{ height: "calc(70vh)" }}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage message={message} />
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
