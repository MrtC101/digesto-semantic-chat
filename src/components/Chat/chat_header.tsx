import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FilterButton from "./Filter/filter";
import { CardTitle } from "../ui/card";
import useChatContext from "@/hooks/use_chat_context_hook";
import { Button } from "../ui/button";

function ChatHeader() {
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