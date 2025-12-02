import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FilterButton from "./Filter/filter";
import { Card, CardTitle } from "../ui/card";
import useChatContext from "@/hooks/use-chat-context-hook";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth_context";

function ChatHeader() {
  const { username } = useAuth();
  const { sessionId, filters } = useChatContext();
  const activeFilters = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  );
  const filterCounts = activeFilters.length;

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = `/Instructivo_de_Uso_Normita.pdf`; // PDF en public
    link.download = "Instructivo_de_Uso_Normita.pdf";
    link.click();
  };

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary p-2 rounded-full">
          <MessageSquare className="h-5 w-5" />
        </div>
        <span className="hidden sm:inline">
          ¡Chateá con <span className="font-bold text-primary">Normita</span>!
        </span>
        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 px-2 py-1 gap-1 shadow-lg hover:shadow-xl transition-all duration-200">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-xs font-bold">
            {username.toUpperCase().slice(0, 2)}
          </span>
          <span className="font-semibold">{username.toUpperCase()}</span>
        </Badge>
      </CardTitle>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {filterCounts > 0 && (
          <Badge variant="secondary">{filterCounts} filtros activos</Badge>
        )}
        <FilterButton />
        <Badge variant="outline">Sesión: {sessionId.slice(-8)}</Badge>
        <Button
          title="Descargar Instructivo de uso"
          className="w-8 h-8 p-0 rounded-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-500"
          onClick={handleDownloadPDF}
        >
          ?
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;