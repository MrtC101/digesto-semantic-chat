import { Chat, Tag, ChatMessage } from "./types";

export function createNewChat(tag: Tag): Chat {
  const newChat: Chat = {
    sessionId: `session_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`,
    tag: tag,
    messages: [],
    filters: {},
    isLoading: false,
    get userMessages() {
      return this.messages.filter((msg) => msg.type === "user");
    },
    get assistantMessages() {
      return this.messages.filter((msg) => msg.type === "assistant");
    },
    get lastUserMessage() {
      return this.userMessages[this.userMessages.length - 1];
    },
    get lastAssistMessage() {
      return this.assistantMessages[this.assistantMessages.length - 1];
    },
    addNewMessage(type: "user" | "assistant", msg_text: string) {
      if (!msg_text.trim()) return;
      const msg: ChatMessage = {
        id: Date.now().toString(),
        type: type,
        message: msg_text,
        timestamp: new Date(),
      };
      this.messages.push(msg);
    },
  };
  return newChat;
}

// {
//   id: "1",
//   type: "assistant",
//   message: `👋 **¡Hola!**

// Soy tu **asistente legal**, especializado en el **Digesto Jurídico** de la Municipalidad.

// Podés consultarme sobre:

// - 📘 **Leyes**
// - 🏛️ **Ordenanzas**
// - 📄 **Decretos**
// - 📚 **Otras normativas municipales**
// - 🗺️ **Información geográfica de Godoy Cruz**
// Podés consultar la **zonificación**, **distrito** y **barrio** de cualquier dirección.

// > 🗣️ **¿En qué puedo ayudarte hoy?**
// `,
//   timestamp: new Date(),
// }
