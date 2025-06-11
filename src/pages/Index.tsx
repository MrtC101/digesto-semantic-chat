import { useState } from 'react';
import { SearchInterface } from '@/components/SearchInterface';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Scale, MessageSquare, Search, Filter } from 'lucide-react';

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

export interface SearchResult {
  tipo_digesto: string;
  ddganio: number;
  ddgnro: number;
  ddgtitulo: string;
  ddgsumario: string;
  estado_digesto: string;
  estado: string;
  tipo_publicacion: string;
  ddgnormasrelacionadas?: string;
  ddgfechaalta?: string;
  ddgfechasancion?: string;
  ddgfechapublicacion?: string;
  ddgfechapromulgacion?: string;
  ddgfechaderogacion?: string;
  chunk: string;
  page: number;
}

export interface ApiResponse {
  status: string;
  generated_response?: string;
  results: SearchResult[];
}

const Index = () => {
  const [activeMode, setActiveMode] = useState<'search' | 'chat'>('search');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'RESULTS_ONLY' | 'GENERATE'>('RESULTS_ONLY');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [generatedResponse, setGeneratedResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = 'https://10.1.136.87/normita/api/v1/chat/from_contenidos';
      const params = new URLSearchParams({
        query_str: query,
        mode: mode,
        session_id: sessionId,
      });

      // Add filters to params
      if (filters.tipo_digesto?.length) {
        filters.tipo_digesto.forEach(tipo => params.append('tipo_digesto', tipo));
      }
      if (filters.ddganio?.length) {
        filters.ddganio.forEach(anio => params.append('ddganio', anio.toString()));
      }
      if (filters.ddgfechasancion_desde) {
        params.append('ddgfechasancion_desde', filters.ddgfechasancion_desde);
      }
      if (filters.ddgfechasancion_hasta) {
        params.append('ddgfechasancion_hasta', filters.ddgfechasancion_hasta);
      }
      if (filters.estado?.length) {
        filters.estado.forEach(est => params.append('estado', est));
      }
      if (filters.estado_digesto?.length) {
        filters.estado_digesto.forEach(est => params.append('estado_digesto', est));
      }
      if (filters.tipo_publicacion?.length) {
        filters.tipo_publicacion.forEach(tipo => params.append('tipo_publicacion', tipo));
      }
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }

      const fullUrl = `${apiUrl}?${params.toString()}`;
      console.log('Making API request to:', fullUrl);

      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      console.log('API response:', data);
      
      if (data.status === 'OK') {
        setResults(data.results);
        if (data.generated_response) {
          setGeneratedResponse(data.generated_response);
        }
      } else {
        console.error('API returned error status:', data);
        // Handle error appropriately
      }

    } catch (error) {
      console.error('Error searching:', error);
      // Handle error appropriately - you might want to show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        <header className="border-b bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Digesto Jurídico</h1>
              </div>
              <div className="text-sm text-muted-foreground">
                Sistema de búsqueda semántica de documentos legales
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="w-full space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <SearchInterface
                    query={query}
                    onQueryChange={setQuery}
                    mode="RESULTS_ONLY"
                    onModeChange={setMode}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="border-b p-4">
                      <h3 className="font-semibold text-lg">Filtros de Búsqueda</h3>
                      <p className="text-sm text-muted-foreground">
                        Refina tu búsqueda con filtros específicos
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <FilterSidebar filters={filters} onFiltersChange={setFilters} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </Card>

            {results.length > 0 && (
              <ResultsDisplay results={results} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
