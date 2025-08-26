import PageHeader from "@/components/PageHeader";
import ChatPage from "@/pages/chat_page"

const Index = () => {
  return (
    <div className="flex h-screen max-h-screen bg-background">
      <main className="flex-1 flex flex-col">
        <PageHeader />
        <ChatPage />
      </main>
    </div>
  );
};

export default Index;
