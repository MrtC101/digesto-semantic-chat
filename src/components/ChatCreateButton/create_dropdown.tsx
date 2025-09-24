import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Tag } from "../Chat/types";
import useChatContext from "@/hooks/use_chat_context_hook";
import callAPI from "@/lib/api";

const welcome_msg = `👋 **¡Hola!**

Soy tu asistente virtual Normita y si me das una orden clara y un contexto breve, puedo ayudarte a:
ㅤ
- 📘 **Buscar información** sobre Leyes, Ordenanzas,  Decretos, Resoluciones y Convenios.
- 📄 **Redactar un borrador** de Ordenanza o Decreto a partir de la información que me brindes.

ㅤ
> 🗣️ ¿En qué puedo ayudarte hoy?
  `;
const tags: Tag[] = [
    {
      name: "Reclamos",
      letter: "R",
    }
  ];

function CreateDropdown() {
  const {
    sessionId,
    isLoading,
    filters,
    addMessage,
    setIsLoading,
    switchToChat,
    createNewChat,
  } = useChatContext();

  function handleCreateChat(tag: Tag) {
    const newSessionId = createNewChat(tag);

    switchToChat(newSessionId);
    addMessage("assistant", welcome_msg);
    addMessage("user", tag.letter);

    setIsLoading(true);
    const set_mode = async () => {
      const msg = await callAPI(sessionId, tag.letter, filters);
      addMessage("assistant", msg);
      setIsLoading(false);
    };
    set_mode();
  }

  return (
    <>
      {tags.map((tag: Tag) => (
        <DropdownMenuItem key={tag.name} asChild>
          <Button
            variant="ghost"
            className="w-full justify-start"
            disabled={isLoading}
            onClick={() => handleCreateChat(tag)}
          >
            <span className="mr-2 h-4 w-4 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
              {tag.letter}
            </span>
            {tag.name}
          </Button>
        </DropdownMenuItem>
      ))}
    </>
  );
}

export default CreateDropdown;
