import { createContext, useState } from "react";
import { ChatMessage } from "./ChatInterface";

export interface SearchResult {
  chunk: string;
  ddganio: number;
  ddgfechaalta?: string;
  ddgfechaderogacion?: string;
  ddgfechapromulgacion?: string;
  ddgfechapublicacion?: string;
  ddgfechasancion?: string;
  ddgid: number;
  ddgnormasrelacionadas: string;
  ddgnro: string;
  ddgsumario: string;
  ddgtitulo: string;
  distance: number;
  estado: string;
  estado_digesto: string;
  pagina: number;
  tipo_digesto: string;
  tipo_ley: string;
  tipo_publicacion: string;
}

interface SearchResponse {
  generated_response: string;
  results: SearchResult[];
}

interface SearchFilters {
  tipo_digesto?: string[];
  ddganio?: number[];
  ddgfechasancion_desde?: string;
  ddgfechasancion_hasta?: string;
  estado?: string[];
  estado_digesto?: string[];
  tipo_publicacion?: string[];
  limit?: number;
}

export interface ChatContextType {
  query: string;
  filters: SearchFilters,
  searchField: string;
  isLoading: boolean;
  response: SearchResponse;
  messages: ChatMessage[];
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  setSearchField: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResponse: React.Dispatch<React.SetStateAction<SearchResponse>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SearchResponse>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      message:
        "¡Hola! Soy tu asistente legal especializado en el Digesto Jurídico. Puedes hacerme preguntas sobre leyes, ordenanzas, decretos y demás normativas. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);

  return (
    <ChatContext.Provider
      value={{
        filters,
        setFilters,
        query,
        setQuery,
        searchField,
        setSearchField,
        isLoading,
        setIsLoading,
        response,
        setResponse,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
