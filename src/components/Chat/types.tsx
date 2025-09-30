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

