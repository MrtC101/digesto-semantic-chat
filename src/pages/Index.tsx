import ChatInterface from "@/components/chat/chat";
import { ChatProvider } from "@/contexts/chat_context";
import SideBarItem from "@/components/chat/chatSidebar/sidebar_items";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NewChatButton from "@/components/chat/chatCreateButton/chat_create_button";

const Index = () => {
  return (
    <div className="flex h-screen max-h-screen bg-background">
      <main className="flex-1 flex flex-col">
        <ChatProvider>
          <SidebarProvider className="!flex !flex-row min-h-screen w-screen">
            <div className="flex-shrink-0">
              <Sidebar collapsible="icon" className="shadow-lg shadow-blue-400/20">
                <SidebarHeader className="border-b p-4 flex-shrink-0">
                  <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                    <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Chats</span>
                    <SidebarTrigger className="h-9 w-9 flex-shrink-0 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200" />
                  </div>
                </SidebarHeader>
                <SidebarContent className="flex-1 overflow-y-auto">
                  <div className="px-2 py-1 border-b border-gray-800 flex group-data-[collapsible=icon]:justify-center">
                    <NewChatButton />
                  </div>
                  <SideBarItem />
                </SidebarContent>
              </Sidebar>
            </div>
            <div className="flex-1 flex flex-col p-2 min-w-0 h-max-screen">
              <ChatInterface />
            </div>
          </SidebarProvider>
        </ChatProvider>
      </main>
    </div>
  );
};

export default Index;
