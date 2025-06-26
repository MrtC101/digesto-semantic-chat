import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { FilterSidebar } from "./FilterSidebar";
import useChatContext from "@/hooks/use-chat-context";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";



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
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <h3 className="font-semibold text-lg">Filtros de Búsqueda</h3>
          <p className="text-sm text-muted-foreground">
            Refina tu búsqueda con filtros específicos
          </p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <FilterSidebar filters={filters} onFiltersChange={setFilters} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FilterButton;
