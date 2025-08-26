import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadDropDownButtons from "@/components/Chat/DropdownButton/load_dropdown_buttons";
import { useState } from "react";
import { Chat } from "../types";

interface NewChatButtonProps {
  newChatState: ReturnType<typeof useState<Chat | undefined>>;
}

function NewChatButton({ newChatState }: NewChatButtonProps) {
  const [, setNewChat] = newChatState;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Chat
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={4}
        className="w-56 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95"
      >
        <LoadDropDownButtons setNewChat={setNewChat} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NewChatButton;