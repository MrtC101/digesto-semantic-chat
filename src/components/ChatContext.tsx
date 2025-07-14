import { createContext, useState } from "react";
import { ChatMessage } from "./ChatMessages";
import { SearchResponse } from "./ChatTextBar";
import { SearchFilters } from "./FilterSidebar";

export interface ChatContextType {
  filters: SearchFilters;
  userMsg: string;
  assistantMsg: string;
  isLoading: boolean;
  messages: ChatMessage[];
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  setUserMsg: React.Dispatch<React.SetStateAction<string>>;
  setAssistantMsg: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [userMsg, setUserMsg] = useState<string>("");
  const [assistantMsg, setAssistantMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      message: `👋 **¡Hola!**

Soy tu **asistente legal**, especializado en el **Digesto Jurídico** de la Municipalidad.

Podés consultarme sobre:

- 📘 **Leyes**
- 🏛️ **Ordenanzas**
- 📄 **Decretos**
- 📚 **Otras normativas municipales**
- 🗺️ **Información geográfica de Godoy Cruz**  
  Podés consultar la **zonificación**, **distrito** y **barrio** de cualquier dirección.

> 🗣️ **¿En qué puedo ayudarte hoy?**
`,
      timestamp: new Date(),
    },
  ]);

  return (
    <ChatContext.Provider
      value={{
        filters,
        setFilters,
        userMsg,
        setUserMsg,
        assistantMsg,
        setAssistantMsg,
        isLoading,
        setIsLoading,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
