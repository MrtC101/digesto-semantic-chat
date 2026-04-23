import useChatContext from "@/hooks/use-chat-context-hook";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Send, Filter, ChevronDown, FileText, Calendar, Hash } from "lucide-react";
import chatService from "@/lib/chat_service";
import { welcome_msg } from "../predfined";
import FilterButton from "@/components/chat/filter/filter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

const TIPO_OPTIONS = ["LEYES", "ORDENANZAS", "RESOLUCIONES", "DECRETOS", "CONVENIOS", "MEMOS"];
const LIMITE_OPTIONS = [10, 20, 50, 100];

function ChatInput() {
  const {
    allChats,
    sessionId,
    filters,
    setFilters,
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
        <div className="flex items-center gap-1">

          {/* Tipo de Digesto */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <FileText className="h-3 w-3" />
                Tipo {filters.tipo_digesto?.length ? `(${filters.tipo_digesto.length})` : ""}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-0">
              <Card className="border-0">
                <div className="p-2 space-y-1">
                  {TIPO_OPTIONS.map((tipo) => (
                    <label key={tipo} className="flex items-center gap-2 text-xs px-1 py-1 rounded hover:bg-accent cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.tipo_digesto?.includes(tipo) || false}
                        onChange={(e) => {
                          const current = filters.tipo_digesto || [];
                          const next = e.target.checked ? [...current, tipo] : current.filter((t) => t !== tipo);
                          setFilters({ ...filters, tipo_digesto: next.length ? next : undefined });
                        }}
                      />
                      {tipo}
                    </label>
                  ))}
                </div>
              </Card>
            </PopoverContent>
          </Popover>

          {/* Año */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                Año {filters.ddganio?.length ? `(${filters.ddganio.length})` : ""}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-0">
              <Card className="border-0">
                <div className="p-3 space-y-2">
                  <p className="text-xs font-medium">Agregar año</p>
                  <input
                    type="number"
                    placeholder="Ej: 2023"
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    min="1900"
                    max={new Date().getFullYear()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const year = parseInt((e.target as HTMLInputElement).value);
                        if (year > 1900 && year <= new Date().getFullYear()) {
                          const current = filters.ddganio || [];
                          if (!current.includes(year)) {
                            setFilters({ ...filters, ddganio: [...current, year].sort((a, b) => b - a) });
                          }
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <div className="space-y-1">
                    {filters.ddganio?.map((year) => (
                      <div key={year} className="flex items-center justify-between text-xs px-1">
                        <span>{year}</span>
                        <button
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            const next = (filters.ddganio || []).filter((y) => y !== year);
                            setFilters({ ...filters, ddganio: next.length ? next : undefined });
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </PopoverContent>
          </Popover>

          {/* Límite */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Hash className="h-3 w-3" />
                Límite {filters.limit ? `${filters.limit}` : ""}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {LIMITE_OPTIONS.map((n) => (
                <DropdownMenuItem
                  key={n}
                  onSelect={() => setFilters({ ...filters, limit: filters.limit === n ? undefined : n })}
                  className={filters.limit === n ? "font-semibold text-primary" : ""}
                >
                  {n}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtros avanzados */}
          <FilterButton
            trigger={
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Filter className="h-3 w-3" />
                Filtros
              </Button>
            }
          />
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          size="sm"
          className="aspect-square px-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

export default ChatInput;
