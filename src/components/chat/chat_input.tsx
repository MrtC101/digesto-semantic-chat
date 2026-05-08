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
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const dateRange: DateRange | undefined =
    filters.ddgfechasancion_desde || filters.ddgfechasancion_hasta
      ? {
          from: filters.ddgfechasancion_desde ? new Date(filters.ddgfechasancion_desde + "T00:00:00") : undefined,
          to: filters.ddgfechasancion_hasta ? new Date(filters.ddgfechasancion_hasta + "T00:00:00") : undefined,
        }
      : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters({
      ...filters,
      ddgfechasancion_desde: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
      ddgfechasancion_hasta: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    });
  };

  const fechaCount =
    (filters.ddganio?.length || 0) +
    (filters.ddgfechasancion_desde || filters.ddgfechasancion_hasta ? 1 : 0);

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
                <span className="hidden sm:inline">Tipo</span>
                {!!filters.tipo_digesto?.length && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                    {filters.tipo_digesto.length}
                  </span>
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-0">
              <div className="p-2 space-y-1">
                {TIPO_OPTIONS.map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2 text-xs px-1 py-1 rounded hover:bg-accent cursor-pointer">
                    <Checkbox
                      checked={filters.tipo_digesto?.includes(tipo) || false}
                      onCheckedChange={(checked) => {
                        const current = filters.tipo_digesto || [];
                        const next = checked ? [...current, tipo] : current.filter((t) => t !== tipo);
                        setFilters({ ...filters, tipo_digesto: next.length ? next : undefined });
                      }}
                    />
                    {tipo.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Fecha */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                <span className="hidden sm:inline">Fecha</span>
                {!!fechaCount && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                    {fechaCount}
                  </span>
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Accordion type="multiple" className="px-3">
                <AccordionItem value="anio">
                  <AccordionTrigger className="text-xs py-2">Año del Digesto</AccordionTrigger>
                  <AccordionContent className="space-y-2 pb-3">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fecha-sancion">
                  <AccordionTrigger className="text-xs py-2">Fecha de Sanción</AccordionTrigger>
                  <AccordionContent className="pb-3 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full h-8 text-xs justify-start gap-2 font-normal"
                      onClick={() => setShowCalendar((v) => !v)}
                    >
                      <Calendar className="h-3 w-3 shrink-0" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>{format(dateRange.from, "dd MMM yyyy", { locale: es })} — {format(dateRange.to, "dd MMM yyyy", { locale: es })}</>
                        ) : format(dateRange.from, "dd MMM yyyy", { locale: es })
                      ) : (
                        <span className="text-muted-foreground">Seleccionar rango</span>
                      )}
                    </Button>
                    {showCalendar && (
                      <CalendarPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          handleDateRangeChange(range);
                          if (range?.to) setShowCalendar(false);
                        }}
                        locale={es}
                        disabled={{ after: new Date() }}
                        initialFocus
                      />
                    )}
                    {dateRange && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs h-7"
                        onClick={() => { handleDateRangeChange(undefined); setShowCalendar(false); }}
                      >
                        Limpiar fechas
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </PopoverContent>
          </Popover>

          {/* Límite */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <Hash className="h-3 w-3" />
                <span className="hidden sm:inline">Límite</span>
                {!!filters.limit && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                    {filters.limit}
                  </span>
                )}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="text-xs min-w-[6rem]">
              {LIMITE_OPTIONS.map((n) => (
                <DropdownMenuItem
                  key={n}
                  onSelect={() => setFilters({ ...filters, limit: filters.limit === n ? undefined : n })}
                  className={`text-xs ${filters.limit === n ? "font-semibold text-primary" : ""}`}
                >
                  {n}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filtros avanzados */}
          {(() => {
            const count = [
              filters.estado?.length,
              filters.estado_digesto?.length,
              filters.tipo_publicacion?.length,
            ].filter(Boolean).length;
            return (
              <FilterButton
                trigger={
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <Filter className="h-3 w-3" />
                    <span className="hidden sm:inline">Otros Filtros</span>
                    {count > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                        {count}
                      </span>
                    )}
                  </Button>
                }
              />
            );
          })()}
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
