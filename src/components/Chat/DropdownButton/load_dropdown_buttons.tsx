import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Chat, Tag } from "../types";

interface LoadDropDownButtonsProps {
  setNewChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
}

function LoadDropDownButtons({ setNewChat }: LoadDropDownButtonsProps) {
  const [tagList, setTagList] = useState<Tag[]>([]);

  function createNewChat(tag: Tag) {
    const newChat: Chat = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tag: tag,
      messages: [],
      filters: {},
      isLoading: false,
    };
    setNewChat(newChat);
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
            onClick={() => createNewChat(tag)}
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

export default LoadDropDownButtons;