import DOMPurify from "dompurify";
import { Bot, User } from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import type { ChatMessage as ChatMessageType } from "./types";

function NormitaPicture() {
  return (
    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-28 md:h-28 rounded-full flex items-center justify-center bg-gray-600 text-white">
      <img
        src="/Normita.png"
        alt="Normita"
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          // Fallback to Bot icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <Bot className="h-8 w-8 hidden" />
    </div>
  );
}

export function LoadingDisplay() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-3 max-w-[80%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
        <div className="rounded-lg p-3 bg-muted">
          <div className="flex items-center gap-2">
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
              <div
                className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">
              Esperando la respuesta...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const raw = DOMPurify.sanitize(message.message, {
          ALLOWED_ATTR: ["href", "target", "rel"],
        });
        const mark = await marked(raw);
        setHtml(mark);
      } catch (error) {
        console.error("Error processing markdown:", error);
        setHtml(message.message);
      }
    })();
  }, [message.message]);

  return (
    <div
      key={message.id}
      className={`max-w-[84vw] sm:max-w-[100vw] w-full flex gap-3 ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 ${
          message.type === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Message icon */}
        {message.type === "user" ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600 text-white">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <NormitaPicture />
        )}
        {/* Se modifica el max-w de esta manera porque usar procentaje es inconsistente debido al scrollArea */}
        <div
          className="rounded-lg 
          bg-gray-600 
          min-w-[150px] 
          max-w-[300px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]
          flex flex-col shadow-md"
        >
          {/* Header con botón copiar */}
          <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-gray-500">
            <span className="font-semibold text-white text-sm">
              {`${message.type === "user" ? "Usuario" : "Normita"}`}
            </span>
            <button
              className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-400 rounded text-white transition"
              onClick={() => navigator.clipboard.writeText(message.message)}
              title="Copiar texto"
            >
              Copiar
            </button>
          </div>
          {/* Contenido del mensaje con scroll horizontal */}
          <div className="max-w-[800px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 rounded px-3 py-2">
            <div
              className="
            leading-relaxed
            [&_p]:text-base
            [&_p]:leading-relaxed
            [&_a]:text-sky-300
            [&_a]:underline
            [&_hr]:my-4
            hover:[&_a]:text-sky-500
            [&_pre]:bg-gray-800 
            [&_pre]:text-white 
            [&_pre]:p-2 
            [&_pre]:mb-2
            [&_pre]:mt-2 
            [&_pre]:rounded-lg
            [&_pre]:border-gray-700
            [&_pre]:overflow-x-auto
            "
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </div>
          {/* Timestamp alineado a la derecha */}
          <div className="flex justify-end px-3 pb-2">
            <p className="text-xs opacity-70 text-white">
              {message.timestamp.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
