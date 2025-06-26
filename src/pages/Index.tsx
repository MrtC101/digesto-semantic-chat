import { useState } from "react";
import { Scale } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 flex flex-col">
        
        <header className="border-b p-4" style={{ background: "var(--card)" }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-card-foreground" />
                <h1 className="text-2xl font-bold text-card-foreground">
                  Normita IA
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 flex flex-col p-6">
          <ChatInterface sessionId={sessionId} />
        </div>
      </main>
    </div>
  );
};

export default Index;
