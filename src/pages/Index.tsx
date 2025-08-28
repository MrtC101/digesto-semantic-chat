import PageHeader from "@/components/ChatSidebar/page_header";
import ChatPage from "@/pages/chat_page"

const Index = () => {
  return (
    <div className="flex h-screen max-h-screen bg-background">
      <main className="flex-1 flex flex-col">
        <ChatPage />
      </main>
    </div>
  );
};

export default Index;
