import useChatContext from "@/hooks/use-chat-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect } from "react";
import { Send } from "lucide-react";

interface ChatTextBarProps {
  sessionId: string;
}

function ChatTextBar({ sessionId }: ChatTextBarProps) {
  const {
    filters,
    searchField,
    query,
    isLoading,
    setQuery,
    setIsLoading,
    setResponse,
    setSearchField,
  } = useChatContext();

  useEffect(() => {
    const callAPI = async () => {
      setQuery(searchField);
      if (!query.trim()) return;

      setIsLoading(true);
      try {
        const apiUrl = "/api";

        const params = new URLSearchParams({
          query_str: query,
          mode: "GENERATE",
          session_id: sessionId,
        });

        // Add filters to params
        if (filters.tipo_digesto?.length) {
          filters.tipo_digesto.forEach((tipo) =>
            params.append("tipo_digesto", tipo)
          );
        }
        if (filters.ddganio?.length) {
          filters.ddganio.forEach((anio) =>
            params.append("ddganio", anio.toString())
          );
        }
        if (filters.ddgfechasancion_desde) {
          params.append("ddgfechasancion_desde", filters.ddgfechasancion_desde);
        }
        if (filters.ddgfechasancion_hasta) {
          params.append("ddgfechasancion_hasta", filters.ddgfechasancion_hasta);
        }
        if (filters.estado?.length) {
          filters.estado.forEach((est) => params.append("estado", est));
        }
        if (filters.estado_digesto?.length) {
          filters.estado_digesto.forEach((est) =>
            params.append("estado_digesto", est)
          );
        }
        if (filters.tipo_publicacion?.length) {
          filters.tipo_publicacion.forEach((tipo) =>
            params.append("tipo_publicacion", tipo)
          );
        }
        if (filters.limit) {
          params.append("limit", filters.limit.toString());
        } else {
          filters.limit = 50;
          params.append("limit", filters.limit.toString());
        }

        const fullUrl = `${apiUrl}?${params.toString()}`;
        const response = await axios.post(fullUrl);
        setResponse(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
        setSearchField("");
        setQuery("");
      }
    };
    callAPI();
  }, [query]);

  const handleSendMessage = () => {
    if (!searchField.trim()) return;
    setQuery(searchField);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Escribe tu consulta aquí..."
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!searchField.trim() || isLoading}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Presiona Enter para enviar • Los filtros activos se aplicarán
        automáticamente
      </p>
    </>
  );
}

export default ChatTextBar;
