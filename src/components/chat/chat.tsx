import { useEffect, useRef } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import useChatContext from "@/hooks/use-chat-context-hook";
import ChatInput from "@/components/chat/chat_input";
import { ChatMessage, LoadingDisplay } from "@/components/chat/chat_message";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { tags } from "@/components/predfined";
import { Download, ArrowLeft, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ChatInterface = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { messages, isLoading, allChats, createNewChat, switchToChat } = useChatContext()

  useEffect(() => {
    /* Create default chat */
    if (allChats.length == 0) {
      const newSessionId = createNewChat(tags[0]);
      switchToChat(newSessionId);
    }
  }, []);

  const handleBack = async () => {
    await logout();
    window.location.href = import.meta.env.VITE_RETURN_URL;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      });
    }
  }, [messages, isLoading]);

  if (allChats.length === 0) {
    return (
      <Card className="flex-1 flex flex-col w-full h-full max-h-[90vh] overflow-hidden">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            Selecciona o crea un chat para comenzar
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { username } = useAuth();
  const { sessionId } = useChatContext();

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = `/Instructivo_de_Uso_Normita.pdf`;
    link.download = "Instructivo_de_Uso_Normita.pdf";
    link.click();
  };

  return (
    <Card className="flex flex-col bg-chat border-0 h-full">
      {/* Header Principal - Solo información esencial */}
      <CardHeader className="pb-3 pt-4 px-6">
        <div className="flex items-center justify-between">
          {/* Lado izquierdo - Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#636aaf] to-[#9e1663] shadow-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">Normita IA</h1>
              <p className="text-xs text-gray-400">Sesión: {sessionId.slice(-8)}</p>
            </div>
          </div>

          {/* Lado derecho - Usuario y acciones */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              title="Descargar Instructivo de uso"
              className="
                gap-2 
                text-gray-300 hover:text-white 
                hover:bg-gray-800
                transition-all duration-200
              "
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Instructivo</span>
            </Button>

            <div className="h-8 w-px bg-gray-700" />

            <Badge className="
              bg-gray-800 hover:bg-gray-700
              text-gray-300 
              px-3 py-2 gap-2 
              border border-gray-700
              transition-all duration-200
            ">
              <div className="
                flex items-center justify-center 
                w-7 h-7 rounded-full 
                bg-gradient-to-br from-[#636aaf] to-[#9e1663]
                text-xs font-bold text-white
              ">
                {username.toUpperCase().slice(0, 2)}
              </div>
              <span className="font-medium">{username}</span>
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              title="Volver a Godoy Cruz Digital"
              onClick={handleBack}
              className="
                gap-2
                text-gray-300 hover:text-white 
                hover:bg-gray-800
                transition-all duration-200
              "
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Volver</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <Separator className="bg-gray-800" />

      {/* Área de mensajes */}
      <div className="flex flex-col flex-1 items-center min-h-0">
        <CardContent className="flex flex-col flex-1 min-h-0 pt-2 pb-4 px-4 w-full max-w-[1000px]">
          <ScrollArea className="flex-1 overflow-y-auto w-full">
            <div className="space-y-4 w-full">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id + index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
              {isLoading && (
                <div className="animate-pulse">
                  <LoadingDisplay />
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>
          <div className="shrink-0">
            <ChatInput />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ChatInterface;