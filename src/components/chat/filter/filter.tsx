import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterSidebar } from "./filter_sidebar";

function FilterButton({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="z-50 w-80 p-0 border" align="end">
          <div className="border-b px-3 py-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filtros de Búsqueda</h3>
            <p className="text-xs text-muted-foreground">Refina tu búsqueda</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <FilterSidebar />
          </div>
      </PopoverContent>
    </Popover>
  );
}

export default FilterButton;