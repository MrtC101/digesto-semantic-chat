import ChatInterface from "@/components/chat/chat";
import { ChatProvider } from "@/contexts/chat_context";
import NewChatButton from "@/components/chat/chatCreateButton/chat_create_button";
import SideBarItem from "@/components/chat/chatSidebar/sidebar_items";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { RETURN_URL } from "@/components/predfined";
import { useAuth } from "@/contexts/auth_context";
import { Scale } from "lucide-react";

const Index = () => {
  const { logout } = useAuth();

  const handleBack = async () => {
    await logout();
    window.location.href = RETURN_URL;
  };

  return (
    <div className="flex h-screen max-h-screen bg-background">
      <main className="flex-1 flex flex-col">
        <ChatProvider>
          <SidebarProvider className="!flex !flex-row min-h-screen w-screen">
            <div className="flex-shrink-0">
              <Sidebar className="shadow-lg shadow-purple-400/20">
                <SidebarHeader className="border-b p-4 flex-shrink-0">
                  <header className="border-b p-4 border border-purple-500/20 p-4 rounded-lg bg-gray-900/80 backdrop-blur-sm mb-3 shadow-lg shadow-purple-400/20" >
                    <div className="flex items-center gap-2 ">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#636aaf] to-[#9e1663] shadow-lg shadow-purple-400/30">
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
              <div className="mt-1 mb-1 flex justify-between items-center">
                <div className="flex items-center gap-12">
                  <SidebarTrigger
                    title="Abrir / Cerrar Menú de Chats"
                    className="
                    inline-flex items-center justify-center 
                    h-10 w-10 
                    rounded-lg 
                    bg-gray-800 hover:bg-gray-700 
                    border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white 
                    transition-all duration-200 shadow-lg hover:shadow-gray-900/50
                    "
                  />
                  <NewChatButton/>
                </div>
                <Button
                  title="Volver a Godoy Cruz Digital"
                  onClick={handleBack}
                  className="
                      text-white font-semibold
                      rounded-lg
                      shadow-sm hover:shadow-md
                      bg-gray-800 hover:bg-gray-700 
                      border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white 
                      transition-all duration-200 shadow-lg hover:shadow-gray-900/50
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    "
                >
                  Volver
                </Button>
              </div>
              <ChatInterface />
            </div>
          </SidebarProvider>
        </ChatProvider>
      </main>
    </div>
  );
};

export default Index;
