import { useState } from "react";
import ChatInterface from "@/components/Chat/ChatInterface/chat_interface";
import SideBar from "@/components/Chat/Sidebar/SideBar";
import NewChatButton from "@/components/Chat/DropdownButton/new_chat_dropdown";
import { ChatProvider } from "@/components/Chat/ChatInterface/chat_context";
import type { Chat } from "@/components/Chat/types";

function ChatPage() {
  const newChatState = useState<Chat | undefined>(undefined);
  const activeChatState = useState<Chat | undefined>(undefined);

  return (
    <ChatProvider>
      <div className="flex max-h-96">
        <SideBar
          newChatState={newChatState}
          activeChatState={activeChatState}
        />
        <div className="flex-1 min-h-0 flex flex-col p-6">
          <NewChatButton newChatState={newChatState} />
          <ChatInterface activeChatState={activeChatState} />
        </div>
      </div>
    </ChatProvider>
  );
}

export default ChatPage;