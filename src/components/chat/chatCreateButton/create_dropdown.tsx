import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Tag } from "../types";
import useChatContext from "@/hooks/use-chat-context-hook";
import { useAuth } from "@/contexts/auth_context";

function CreateDropdown() {
  const {
    isLoading,
    allChats,
    switchToChat,
    createNewChat,
  } = useChatContext();
  const { tags } = useAuth();

  function handleCreateChat(tag: Tag) {
    const newSessionId = createNewChat(tag);
    switchToChat(newSessionId);
  }

  return (
    <>
      {tags.map((tag: Tag) => (
        <DropdownMenuItem key={tag.clave} asChild>
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
