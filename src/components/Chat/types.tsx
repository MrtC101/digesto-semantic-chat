export interface Tag {
  name: string;
  letter: string;
}

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
  generated_response: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  message: string;
  timestamp: Date;
  results?: SearchResult[];
}

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

export class Chat {
  sessionId: string;
  tag: Tag;
  messages: ChatMessage[];
  filters: SearchFilters;
  isLoading: boolean;

  constructor(
    tag: Tag,
    sessionId: string = `session_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`,
    messages: ChatMessage[] = [],
    isLoading = false
  ) {
    this.sessionId = sessionId;
    this.tag = tag;
    this.messages = messages;
    this.filters = {};
    this.isLoading = isLoading;
  }

  get userMessages() {
    return this.messages.filter((msg) => msg.type === "user");
  }
  get assistantMessages() {
    return this.messages.filter((msg) => msg.type === "assistant");
  }
  get lastUserMessage() {
    return this.userMessages[this.userMessages.length - 1];
  }

  get lastAssistMessage() {
    return this.assistantMessages[this.assistantMessages.length - 1];
  }

  addNewMessage(type: "user" | "assistant",msg_text: string) : Chat  {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: type,
      message: msg_text,
      timestamp: new Date(),
    };
    return new Chat(
        this.tag,
        this.sessionId,
        [...this.messages, newMessage],
        true
      );
    }
}
