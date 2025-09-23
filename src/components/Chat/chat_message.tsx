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
      className={`flex gap-3 ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          message.type === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {message.type === "user" ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600 text-white">
            <User className="h-4 w-4" />
          </div>
        ) : (
          <NormitaPicture />
        )}

        <div className="rounded-lg p-3 bg-gray-600 text-white">
          <div
            className="
              markdown
              text-base
              leading-relaxed
              break-words
              [&_a]:text-sky-300
              [&_a]:underline
              hover:[&_a]:text-sky-500
              [&_p]:break-words
              [&_p]:whitespace-pre-wrap
              [&_code]:break-words
              [&_pre]:break-words
              [&_td]:break-words
              [&_th]:break-words
              [&_hr]:my-4
            "
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />

          <p className="text-xs opacity-70 mt-2">
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}