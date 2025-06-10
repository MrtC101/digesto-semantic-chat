
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SearchFilters } from '@/pages/Index';
import { Send, MessageSquare, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  results?: any[];
}

interface ChatInterfaceProps {
  sessionId: string;
  filters: SearchFilters;
  onSearch: () => void;
  isLoading: boolean;
}

export const ChatInterface = ({ sessionId, filters, onSearch, isLoading }: ChatInterfaceProps) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      message: '¡Hola! Soy tu asistente legal especializado en el Digesto Jurídico. Puedes hacerme preguntas sobre leyes, ordenanzas, decretos y demás normativas. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }
  ]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = query;
    setQuery('');

    try {
      // Here you would make the actual API call with mode: 'GENERATE'
      // For now, we'll simulate a response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        message: `Basándome en la consulta "${currentQuery}", he encontrado información relevante en el digesto jurídico. 

Según los documentos analizados, las normativas de construcción en zonas sísmicas están reguladas principalmente por la Ley 12/2019, que establece criterios específicos de seguridad estructural.

Esta normativa es de aplicación obligatoria y se encuentra vigente desde su publicación en 2019. Los principales puntos que debes considerar son:

1. **Evaluación sísmica**: Toda construcción debe contar con un estudio sísmico previo
2. **Materiales certificados**: Se requiere el uso de materiales con certificación antisísmica
3. **Supervisión técnica**: La obra debe estar supervisada por un profesional habilitado

¿Te gustaría que profundice en algún aspecto específico de esta normativa?`,
        timestamp: new Date(),
        results: [
          {
            tipo_digesto: 'LEYES',
            ddganio: 2019,
            ddgnro: 12,
            ddgtitulo: 'Normativa de construcción en zonas sísmicas'
          }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        message: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ''
  ).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Consulta con IA Legal
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Sesión: {sessionId.slice(-8)}</Badge>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} filtros activos</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      
                      {message.results && message.results.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/20">
                          <p className="text-xs font-medium mb-2">Documentos consultados:</p>
                          <div className="space-y-1">
                            {message.results.map((result, index) => (
                              <div key={index} className="text-xs">
                                <Badge variant="outline" className="mr-1">
                                  {result.tipo_digesto}
                                </Badge>
                                {result.ddganio}/{result.ddgnro} - {result.ddgtitulo}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">Analizando documentos...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Escribe tu consulta legal aquí..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!query.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Presiona Enter para enviar • Los filtros activos se aplicarán automáticamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
