import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterSidebar } from "../Sidebar/filter_sidebar";
import useChatContext from "@/hooks/use_chat_context_hook";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function FilterButton() {
  const { filters, setFilters } = useChatContext();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-80 p-0 bg-background border" align="end">
        <Card className="border-0">
          <div className="border-b p-4">
            <h3 className="font-semibold text-lg">Filtros de Búsqueda</h3>
            <p className="text-sm text-muted-foreground">
              Refina tu búsqueda con filtros específicos
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default FilterButton;