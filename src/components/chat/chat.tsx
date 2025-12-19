import { useEffect, useRef } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import useChatContext from "@/hooks/use-chat-context-hook";
import ChatInput from "@/components/chat/chat_input";
import { ChatMessage, LoadingDisplay } from "@/components/chat/chat_message";
import { motion } from "framer-motion";
import ChatHeader from "./chat_header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { RETURN_URL, tags } from "@/components/predfined";
import NewChatButton from "@/components/chat/chatCreateButton/chat_create_button";
import { MessageSquare, Download, ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FilterButton from "./filter/filter";
import { CardTitle } from "../ui/card";

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
    window.location.href = RETURN_URL;
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
  const { sessionId, filters } = useChatContext();
  const activeFilters = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  );
  const filterCounts = activeFilters.length;

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
          {/* Lado izquierdo - Navegación y título */}
          <div className="flex items-center gap-3">
            <SidebarTrigger
              title="Abrir / Cerrar Menú de Chats"
              className="
                h-9 w-9
                rounded-lg
                bg-gray-900 
                border-0
                shadow-none
                text-gray-300
                hover:text-white
                hover:bg-gray-800
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-gray-600
                transition-colors duration-200
              "
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-white">Chat Normita</h2>
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
                bg-gray-900
                hover:bg-gray-800
                transition-all duration-200
              "
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4 " />
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
              <span className="font-medium">{username.toUpperCase()}</span>
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              title="Volver a Godoy Cruz Digital"
              onClick={handleBack}
              className="
                gap-2
                bg-gray-900 
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

      {/* Barra de herramientas - Acciones del chat */}
      <div className="px-6 py-3 bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NewChatButton />
            {filterCounts > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filterCounts} filtro{filterCounts > 1 ? 's' : ''} activo{filterCounts > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <FilterButton />
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 flex flex-col items-center overflow-hidden">
        <CardContent className="flex flex-col flex-1 w-full max-w-4xl px-6 pt-4 pb-2">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
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
          
          {/* Input del chat */}
          <div className="pt-4">
            <ChatInput />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ChatInterface;