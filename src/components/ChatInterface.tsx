import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SearchFilters } from "@/pages/Index";
import { Send, MessageSquare, Bot, User } from "lucide-react";
import { marked } from "marked";
import { useSearchContext } from "@/hooks/use-search-context";
import { SearchResult } from "./ResultsDisplay";
import DOMPurify from "dompurify";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  message: string;
  timestamp: Date;
  results?: SearchResult[];
}

interface ChatInterfaceProps {
  sessionId: string;
}

export const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const searchContext = useSearchContext();

  const handleSendMessage = () => {
    if (!searchContext.searchField.trim()) return;
    searchContext.setQuery(searchContext.searchField);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  ).length;

  return (
    <Card
      className="flex-1 min-h-0 overflow-auto"
      style={{ background: "#343541" }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary p-2 rounded-full">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span>
              ¡Chateá con{" "}
              <span className="font-bold text-primary">Normita</span>!
            </span>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Sesión: {sessionId.slice(-8)}</Badge>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} filtros activos
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <ScrollArea
          className="overflow-y-auto w-full pr-4"
          style={{ height: "calc(70vh)" }}
        >
          <div className="space-y-4">
            {searchContext.messages.map((message) => (
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
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {/** MESSAGE IS DISPLAYED HERE */}
                    <div
                      className="markdown text-base leading-relaxed [&_a]:text-sky-300 [&_a]:underline hover:[&_a]:text-sky-500"
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
            ))}

            {searchContext.isLoading && (
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
            )}
          </div>
        </ScrollArea>
        {/*marked(results[0]?.generated_response*/}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Escribe tu consulta aquí..."
            value={searchContext.searchField}
            onChange={(e) => searchContext.setSearchField(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={searchContext.isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={
              !searchContext.searchField.trim() || searchContext.isLoading
            }
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Presiona Enter para enviar • Los filtros activos se aplicarán
          automáticamente
        </p>
      </CardContent>
    </Card>
  );
};
