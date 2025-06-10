
import { useState } from 'react';
import { SearchInterface } from '@/components/SearchInterface';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Scale, MessageSquare, Search } from 'lucide-react';

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
      // Here you would replace with your actual API endpoint
      const apiUrl = 'YOUR_API_ENDPOINT_HERE';
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

      // Mock response for demonstration
      // Replace this with actual fetch call
      const mockResponse: ApiResponse = {
        status: 'OK',
        generated_response: mode === 'GENERATE' ? 'Esta es una respuesta generada por el LLM basada en los documentos encontrados...' : undefined,
        results: [
          {
            tipo_digesto: 'LEYES',
            ddganio: 2019,
            ddgnro: 12,
            ddgtitulo: 'Normativa de construcción',
            ddgsumario: 'Normativa de construcción segura en zonas sísmicas',
            estado_digesto: 'VIGENTE',
            estado: 'PUBLICADO',
            tipo_publicacion: 'PUBLICO',
            ddgnormasrelacionadas: 'DEROGA DECRETO XXXX/XX',
            ddgfechaalta: '2019-06-12',
            ddgfechasancion: '2019-06-12',
            ddgfechapublicacion: '2019-06-12',
            ddgfechapromulgacion: '2019-06-12',
            ddgfechaderogacion: null,
            chunk: 'Visto: que es necesario establecer normativas claras para la construcción en zonas sísmicas y Considerando: que la seguridad de las construcciones es fundamental...',
            page: 1
          }
        ]
      };

      setResults(mockResponse.results);
      if (mockResponse.generated_response) {
        setGeneratedResponse(mockResponse.generated_response);
      }

    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar filters={filters} onFiltersChange={setFilters} />
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-card p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
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
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'search' | 'chat')} className="w-full">
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
                  <SearchInterface
                    query={query}
                    onQueryChange={setQuery}
                    mode="RESULTS_ONLY"
                    onModeChange={setMode}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                  />
                </Card>

                {results.length > 0 && (
                  <ResultsDisplay results={results} />
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-6">
                <ChatInterface
                  sessionId={sessionId}
                  filters={filters}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
