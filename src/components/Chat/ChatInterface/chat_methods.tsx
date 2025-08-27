import { Chat, Tag } from "../types";

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
    get last_user_msg() {
      return this.userMessages[this.userMessages.length - 1];
    },
    get last_ass_msg() {
      return this.assistantMessages[this.assistantMessages.length - 1];
    },
    addNewMessage(msg: string) {
      this.messages.push({ type: "user", text: msg });
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
