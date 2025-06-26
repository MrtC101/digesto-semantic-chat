import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";

import useChatContext from "@/hooks/use-chat-context";

import ChatTextBar from "./ChatTextBar";
import { ChatMessage, LoadingDisplay } from "./ChatMessages";
import FilterButton from "./Filter";
import callAPI from "@/lib/api";

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
  sessionId: string;
}

const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
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

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  ).length;

  useEffect(() => {
    // Adds Users Message to chat
    const AddUserMessage = () => {
      if (!userMsg.trim()) return;
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        message: userMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    };
    AddUserMessage();
    setUserMsg("");
  }, [userMsg]);
  
  useEffect(() => {
    //Adds Assistance Message to chat
    const AddAssistanceMessage = () => {
      if (!assistantMsg) return;
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        message: assistantMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    };
    AddAssistanceMessage();
    setAssistantMsg("");
    setIsLoading(false);
  }, [assistantMsg]);

  //Call api
  useEffect(() => {
    if (!userMsg.trim()) return;
    setIsLoading(true);
    callAPI(sessionId, userMsg, filters, setAssistantMsg);
  }, [userMsg]);

  const scrollAreaRef = useRef(null);
  useEffect(() => {
    if (messages.length > 0) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]); 

  return (
    <Card className="flex-1 flex-col md:flex-row w-full min-h-0 overflow-auto">
      <CardHeader className="pb-3">
        <ChatHeader sessionId={sessionId} filterCounts={activeFiltersCount} />
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <ScrollArea
          className="overflow-y-auto w-full pr-4"
          style={{ height: "70vh" }}
        >
          <div className="space-y-4">
            {messages.map((message, index, row) => (
              <div
                key={index}
                ref={index + 1 === row.length ? scrollAreaRef : null}
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
