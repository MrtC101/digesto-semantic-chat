import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { FilterSidebar } from "./filter_sidebar";

function FilterButton({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="z-50 w-80 p-0 bg-background border" align="end">
        <Card className="border-0">
          <div className="border-b p-4">
            <h3 className="font-semibold text-lg">Filtros de Búsqueda</h3>
            <p className="text-sm text-muted-foreground">
              Refina tu búsqueda con filtros específicos
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <FilterSidebar />
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default FilterButton;