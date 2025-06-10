
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { FilterSidebar } from './FilterSidebar';
import { SearchFilters } from '@/pages/Index';

interface AppSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function AppSidebar({ filters, onFiltersChange }: AppSidebarProps) {
  return (
    <Sidebar className="w-80">
      <SidebarHeader className="border-b p-4">
        <h2 className="font-semibold text-lg">Filtros de Búsqueda</h2>
        <p className="text-sm text-muted-foreground">
          Refina tu búsqueda con filtros específicos
        </p>
      </SidebarHeader>
      <SidebarContent>
        <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} />
      </SidebarContent>
    </Sidebar>
  );
}
