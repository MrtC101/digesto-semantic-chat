import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateDropdown from "@/components/chat/chatCreateButton/create_dropdown";
import useChatContext from "@/hooks/use-chat-context-hook";
import { tags } from "../../predfined";
import { useEffect } from "react";

function NewChatButton() {
  const {isLoading, allChats, createNewChat, switchToChat} = useChatContext()

  useEffect(() => {
    /* Create default chat */
    if (allChats.length == 0) {
      const newSessionId = createNewChat(tags[0]);
      switchToChat(newSessionId);
    }
  }, [allChats.length, createNewChat, switchToChat]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          title="Iniciar un nuevo chat"
          className="
          inline-flex items-center justify-center 
          rounded-lg 
          bg-gray-800 hover:bg-gray-700 
          border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white 
          transition-all duration-200 shadow-lg hover:shadow-gray-900/50
          "
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
