import { useState } from "react";
import ChatInterface from "@/components/Chat/ChatInterface/chat_interface";
import SideBar from "@/components/Chat/Sidebar/sidebar";
import NewChatButton from "@/components/Chat/DropdownButton/new_chat_dropdown";
import { ChatProvider } from "@/components/Chat/ChatInterface/chat_context";
import type { Chat } from "@/components/Chat/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function ChatPage() {
  return (
    <ChatProvider>
      <SidebarProvider className="!flex !flex-row min-h-screen w-screen">
        <div className="flex-shrink-0">
          <SideBar/>
        </div>
        <div className="flex-1 flex flex-col p-5 min-w-0 h-max-screen">
          <div className="mb-4 flex items-center gap-12">
            <SidebarTrigger
              className="
              inline-flex items-center justify-center 
              h-10 w-10 
              rounded-lg 
              bg-white hover:bg-gray-50 
              border bg-blue-600 hover:border-gray-300
              text-white-600 hover:text-gray-900
              transition-all duration-200 ease-in-out
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              group
            "
            />
            <NewChatButton />
          </div>
          <div className="flex-1">
            {/* <ChatInterface /> */}
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}

export default ChatPage;
