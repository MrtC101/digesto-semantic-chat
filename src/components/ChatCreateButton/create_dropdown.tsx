import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Tag } from "../Chat/types";
import useChatContext from "@/hooks/use_chat_context_hook";
import { createNewChat } from "../Chat/chat_methods";

function CreateDropdown() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { setActiveChatId, setChats } = useChatContext();

  function setNewActiveChat(tag: Tag) {
    const newChat = createNewChat(tag);
    setActiveChatId(newChat.sessionId);
    setChats((prev) => [...prev, newChat]);
  }

  useEffect(() => {
    // In the future use axios to get tags
    const tags: Tag[] = [
      {
        name: "Reclamos",
        letter: "R",
      },
      {
        name: "Consultas Generales",
        letter: "C",
      },
      {
        name: "Normativas",
        letter: "N",
      },
    ];
    setTagList(tags);
  }, []);

  return (
    <>
      {tagList.map((tag: Tag) => (
        <DropdownMenuItem key={tag.name} asChild>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setNewActiveChat(tag)}
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
