import { Chat, Tag, ChatMessage } from "./types";

export function createNewChat(tag: Tag): Chat {
  const newChat: Chat = new Chat(tag);
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
