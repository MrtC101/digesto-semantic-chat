import { createContext, useState } from "react";
import { ChatMessage } from "./ChatInterface";
import { SearchResponse } from "@/pages/Index";

interface SearchContextType {
  query: string;
  searchField: string;
  isLoading: boolean;
  response: SearchResponse;
  messages: ChatMessage[];
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setSearchField: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResponse: React.Dispatch<React.SetStateAction<SearchResponse>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
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
    <SearchContext.Provider
      value={{
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
    </SearchContext.Provider>
  );
};