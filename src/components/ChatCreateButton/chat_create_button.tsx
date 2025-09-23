import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateDropdown from "@/components/ChatCreateButton/create_dropdown";
import useChatContext from "@/hooks/use_chat_context_hook";

function NewChatButton() {
  const {isLoading} = useChatContext()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
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
        <CreateDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NewChatButton;
