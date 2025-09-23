import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { Chat, Tag, ChatMessage, SearchFilters } from "@/components/Chat/types";

// Estados del chat activo
export interface ChatStates {
  sessionId: string | null;
  tag: Tag | null;
  messages: ChatMessage[];
  filters: SearchFilters;
  isLoading: boolean;
}

export interface ChatContextType {
  // Estados del chat actual (hidratados)
  sessionId: string | null;
  tag: Tag | null;
  messages: ChatMessage[];
  filters: SearchFilters;
  isLoading: boolean;

  // Métodos para modificar el chat actual
  setTag: (tag: Tag) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (type: "user" | "assistant", text: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setIsLoading: (loading: boolean) => void;

  // Control de chats
  allChats: Chat[];
  switchToChat: (sessionId: string) => void;
  createNewChat: (tag: Tag) => string; // Retorna el sessionId del nuevo chat
  deleteChat: (sessionId: string) => void;

  // Utilidades
  hasUnsavedChanges: boolean;
  saveCurrentChat: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Almacén persistente de chats (como un "database" en memoria)
  const chatsStore = useRef<Map<string, Chat>>(new Map());
  const [allChats, setAllChats] = useState<Chat[]>([]);

  // Estados hidratados del chat actual
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tag, setTag] = useState<Tag | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Control de cambios no guardados
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<ChatStates | null>(null);

  // Marcar cambios cuando se modifiquen los estados
  useEffect(() => {
    if (!sessionId || !lastSavedState) return;

    const currentState: ChatStates = {
      sessionId,
      tag,
      messages,
      filters,
      isLoading,
    };
    const hasChanged =
      JSON.stringify(currentState) !== JSON.stringify(lastSavedState);
    setHasUnsavedChanges(hasChanged);
  }, [sessionId, tag, messages, filters, isLoading, lastSavedState]);

  // Guardar chat actual en el store
  const saveCurrentChat = useCallback(() => {
    if (!sessionId || !tag) return;

    const currentChat = new Chat(tag, sessionId, messages, filters, isLoading);
    chatsStore.current.set(sessionId, currentChat);

    // Actualizar lista de chats
    setAllChats(Array.from(chatsStore.current.values()));

    // Actualizar estado guardado
    const savedState: ChatStates = {
      sessionId,
      tag,
      messages,
      filters,
      isLoading,
    };
    setLastSavedState(savedState);
    setHasUnsavedChanges(false);
  }, [sessionId, tag, messages, filters, isLoading]);

  // Cargar chat desde el store
  const loadChat = useCallback((targetSessionId: string) => {
    const chat = chatsStore.current.get(targetSessionId);
    if (!chat) return false;

    // Hidratar estados con los valores del chat
    setSessionId(chat.sessionId);
    setTag(chat.tag);
    setMessages([...chat.messages]); // Copia para evitar mutaciones
    setFilters({ ...chat.filters }); // Copia para evitar mutaciones
    setIsLoading(chat.isLoading);

    // Marcar como estado guardado
    const loadedState: ChatStates = {
      sessionId: chat.sessionId,
      tag: chat.tag,
      messages: chat.messages,
      filters: chat.filters,
      isLoading: chat.isLoading,
    };
    setLastSavedState(loadedState);
    setHasUnsavedChanges(false);

    return true;
  }, []);

  // Cambiar a otro chat
  const rswitchToChat = useCallback(
    (targetSessionId: string) => {
      // Guardar chat actual antes de cambiar
      if (hasUnsavedChanges) {
        saveCurrentChat();
      }

      // Cargar nuevo chat
      const loaded = loadChat(targetSessionId);
      if (!loaded) {
        console.warn(`Chat ${targetSessionId} not found`);
      }
    },
    [hasUnsavedChanges, saveCurrentChat, loadChat]
  );

  // Crear nuevo chat
  const createNewChat = useCallback(
    (newTag: Tag): string => {
      // Guardar chat actual si hay cambios
      if (hasUnsavedChanges) {
        saveCurrentChat();
      }

      // Crear nuevo chat
      const newChat = new Chat(newTag);
      const newSessionId = newChat.sessionId;

      // Guardarlo en el store
      chatsStore.current.set(newSessionId, newChat);
      setAllChats(Array.from(chatsStore.current.values()));

      // Hidratarlo como chat actual
      loadChat(newSessionId);

      return newSessionId;
    },
    [hasUnsavedChanges, saveCurrentChat, loadChat]
  );

  // Eliminar chat
  const deleteChat = useCallback(
    (targetSessionId: string) => {
      chatsStore.current.delete(targetSessionId);
      setAllChats(Array.from(chatsStore.current.values()));

      // Si se eliminó el chat actual, limpiar estados
      if (sessionId === targetSessionId) {
        setSessionId(null);
        setTag(null);
        setMessages([]);
        setFilters({});
        setIsLoading(false);
        setLastSavedState(null);
        setHasUnsavedChanges(false);
      }
    },
    [sessionId]
  );

  // Métodos para modificar el chat actual
  const updateTag = useCallback((newTag: Tag) => {
    setTag(newTag);
  }, []);

  const updateMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages([...newMessages]); // Copia para inmutabilidad
  }, []);

  const addMessage = useCallback((type: "user" | "assistant", text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      message: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters({ ...newFilters }); // Copia para inmutabilidad
  }, []);

  const updateIsLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Auto-guardar periódico (opcional)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      saveCurrentChat();
    }, 2000); // Auto-guardar después de 2 segundos de inactividad

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, saveCurrentChat]);

  const contextValue: ChatContextType = {
    // Estados hidratados
    sessionId,
    tag,
    messages,
    filters,
    isLoading,

    // Métodos para modificar chat actual
    setTag: updateTag,
    setMessages: updateMessages,
    addMessage,
    setFilters: updateFilters,
    setIsLoading: updateIsLoading,

    // Control de chats
    allChats,
    switchToChat,
    createNewChat,
    deleteChat,

    // Utilidades
    hasUnsavedChanges,
    saveCurrentChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}
