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
  const { isLoading } = useChatContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          title="Iniciar un nuevo chat"
          className="
          w-full h-8 text-sm inline-flex items-center justify-center
          rounded-lg
          text-gray-300 hover:text-white hover:bg-gray-800
          transition-all duration-200
          group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0
          "
          disabled={isLoading}
        >
          <PlusIcon className="shrink-0 h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
          <span className="group-data-[collapsible=icon]:hidden">Nuevo Chat</span>
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
