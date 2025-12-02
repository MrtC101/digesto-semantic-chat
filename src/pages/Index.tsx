import ChatInterface from "@/components/chat/chat";
import SideBar from "@/components/chat/ChatSidebar/chat_sidebar";
import NewChatButton from "@/components/chat/ChatCreateButton/chat_create_button";
import { ChatProvider } from "@/contexts/chat_context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { RETURN_URL } from "@/components/predfined";
import { useAuth } from "@/contexts/auth_context";
import { useNavigate } from "react-router-dom";

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
                <div>
                  <Button
                    onClick={handleBack}
                    className="
                      bg-blue-600 hover:bg-blue-700
                      text-white font-semibold
                      rounded-lg
                      shadow-sm hover:shadow-md
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    "
                  >
                    Volver
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <ChatInterface />
              </div>
            </div>
          </SidebarProvider>
        </ChatProvider>
      </main>
    </div>
  );
};

export default Index;
