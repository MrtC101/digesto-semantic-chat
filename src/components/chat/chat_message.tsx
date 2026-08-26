import DOMPurify from "dompurify";
import { Bot, Copy, Check } from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth_context";
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
  const { username } = useAuth();
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#636aaf] to-[#9e1663] text-xs font-bold text-white">
            {username.toUpperCase().slice(0, 2)}
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
              {message.type === "user" ? username.slice(0, 2).toUpperCase() + username.slice(2).toLowerCase() : "Normita"}
            </span>
            <button
              className="p-1 rounded hover:bg-gray-500 text-gray-300 hover:text-white transition"
              onClick={handleCopy}
              title="Copiar texto"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
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
            [&_ul]:list-disc
            [&_ul]:pl-5
            [&_ol]:list-decimal
            [&_ol]:pl-5
            [&_li]:mb-1
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
