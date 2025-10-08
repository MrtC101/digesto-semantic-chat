import { useState } from "react";
import ChatInterface from "@/components/Chat/chat";
import SideBar from "@/components/ChatSidebar/chat_sidebar";
import NewChatButton from "@/components/ChatCreateButton/chat_create_button";
import { ChatProvider } from "@/components/ChatContext/chat_context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

function ChatPage() {
  return (
    <ChatProvider>
      <SidebarProvider className="!flex !flex-row min-h-screen w-screen">
        <div className="flex-shrink-0">
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col p-5 min-w-0 h-max-screen">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-12">
              <SidebarTrigger
                className="
          inline-flex items-center justify-center 
          h-10 w-10 
          rounded-lg 
          bg-blue-600 hover:bg-blue-700 
          border border-transparent hover:border-gray-300
          text-white hover:text-white
          transition-all duration-200 ease-in-out
          shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
        "
              />
              <NewChatButton />
            </div>

            <Button
              asChild
              className="
        bg-blue-600 hover:bg-blue-700 
        text-white font-semibold 
        rounded-lg 
        shadow-sm hover:shadow-md 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500/20
      "
            >
              <a
                href="https://farogafc.godoycruz.gob.ar/k2b/com.k2b.hk2binicio"
                rel="noopener noreferrer"
              >
                Volver
              </a>
            </Button>
          </div>
          <div className="flex-1">
            <ChatInterface />
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}

export default ChatPage;
