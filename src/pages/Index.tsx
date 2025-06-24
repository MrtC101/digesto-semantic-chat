import { useEffect, useState } from "react";
import { SearchInterface } from "@/components/SearchInterface";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ResultsDisplay, SearchResult } from "@/components/ResultsDisplay";
import { ChatInterface, ChatMessage } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Scale, MessageSquare, Search, Filter } from "lucide-react";
import axios from "axios";
import { useSearchContext } from "@/hooks/use-search-context";
import { marked } from "marked";

export interface SearchFilters {
  tipo_digesto?: string[];
  ddganio?: number[];
  ddgfechasancion_desde?: string;
  ddgfechasancion_hasta?: string;
  estado?: string[];
  estado_digesto?: string[];
  tipo_publicacion?: string[];
  limit?: number;
}

export interface SearchResponse {
  generated_response: string;
  results: SearchResult[];
}


const Index = () => {
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [activeMode, setActiveMode] = useState<"search" | "chat">("chat");
  const [mode, setMode] = useState<"RESULTS_ONLY" | "GENERATE">("GENERATE");
  const [filters, setFilters] = useState<SearchFilters>({});

  const searchContext = useSearchContext();

  // Sends first message to the chat:
  useEffect(() => {
    if (!searchContext.query.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: searchContext.query,
      timestamp: new Date(),
    };
    searchContext.setMessages((prev) => [...prev, userMessage]);
  }, [searchContext.query]);

  // Handles the response message:
  useEffect(() => {
    if (!searchContext.response) return;
    const processResults = async () => {
      searchContext.setIsLoading(true);
      if (!searchContext.response?.generated_response) return;

      try {
        const text = await marked(searchContext.response?.generated_response);
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          message: text,
          timestamp: new Date(),
        };
        searchContext.setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error procesando la respuesta:", error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          message: "Lo siento, ocurrió un error al procesar tu consulta.",
          timestamp: new Date(),
        };
        searchContext.setMessages((prev) => [...prev, errorMessage]);
      } finally {
        searchContext.setIsLoading(false);
      }
    };

    processResults();
  }, [searchContext.response, searchContext.setIsLoading]);
  
  useEffect(() => {
    const callAPI = async () => {
      searchContext.setQuery(searchContext.searchField);
      if (!searchContext.query.trim()) return;

      searchContext.setIsLoading(true);

      try {
        const apiUrl = "/api";

        const params = new URLSearchParams({
          query_str: searchContext.query,
          mode: mode,
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
        searchContext.setResponse(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        searchContext.setIsLoading(false);
        searchContext.setSearchField("");
        searchContext.setQuery("");
      }
    };
    callAPI();
  }, [searchContext.query, searchContext.setQuery]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <header
          className="border-b bg-card p-4"
          style={{
            backgroundColor: "var(--muni-color)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-white" />
                <h1 className="text-2xl font-bold text-white">Normita IA</h1>
              </div>
              <div className="text-sm text-muted-foreground"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col p-6">
          <ChatInterface sessionId={sessionId} />

          {/* <Tabs
            value={activeMode}
            onValueChange={(value) => setActiveMode(value as "search" | "chat")}
            className="flex flex-col w-full flex-1"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Búsqueda
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <SearchInterface />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filtros
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                      <div className="border-b p-4">
                        <h3 className="font-semibold text-lg">
                          Filtros de Búsqueda
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Refina tu búsqueda con filtros específicos
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <FilterSidebar
                          filters={filters}
                          onFiltersChange={setFilters}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </Card>

              {searchContext.response && <ResultsDisplay />}
            </TabsContent>

            <TabsContent
              value="chat"
              className="flex-1 min-h-0 overflow-auto space-y-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filtros
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="border-b p-4">
                      <h3 className="font-semibold text-lg">
                        Filtros de Búsqueda
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Refina tu búsqueda con filtros específicos
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <ChatInterface sessionId={sessionId} />
            </TabsContent>
          </Tabs> */}
        </div>
      </main>
    </div>
  );
};

export default Index;
