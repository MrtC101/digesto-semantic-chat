import ChatInterface from "@/components/chat/chat";
import { ChatProvider } from "@/contexts/chat_context";
import SideBarItem from "@/components/chat/chatSidebar/sidebar_items";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Scale } from "lucide-react";

const Index = () => {
  return (
    <div className="flex h-screen max-h-screen bg-background">
      <main className="flex-1 flex flex-col">
        <ChatProvider>
          <SidebarProvider className="!flex !flex-row min-h-screen w-screen">
            <div className="flex-shrink-0">
              <Sidebar className="shadow-lg shadow-blue-400/20">
                <SidebarHeader className="border-b p-4 flex-shrink-0">
                  <header className="border-b p-4 border border-blue-500/20 p-4 rounded-lg bg-gray-900/80 backdrop-blur-sm mb-3 shadow-lg shadow-blue-400/20" >
                    <div className="flex items-center gap-2 ">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#636aaf] to-[#9e1663] shadow-lg">
                        <Scale className="h-6 w-6 text-card-foreground" />
                      </div>
                      <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">Normita IA</h1>
                    </div>
                  </header>
                  <h2 className="font-semibold text-lg">Chats</h2>
                  <p className="text-sm">Historial de conversaciones</p>
                </SidebarHeader>
                <SidebarContent className="flex-1 overflow-y-auto">
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
