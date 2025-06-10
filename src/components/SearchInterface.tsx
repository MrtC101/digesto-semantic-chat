
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  mode: 'RESULTS_ONLY' | 'GENERATE';
  onModeChange: (mode: 'RESULTS_ONLY' | 'GENERATE') => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchInterface = ({ 
  query, 
  onQueryChange, 
  mode, 
  onModeChange, 
  onSearch, 
  isLoading 
}: SearchInterfaceProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search-query" className="text-sm font-medium">
          Consulta de búsqueda
        </Label>
        <div className="relative">
          <Input
            id="search-query"
            type="text"
            placeholder="Ej: ¿mi casa soporta un terremoto?"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pr-12"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1/2 -translate-y-1/2"
            disabled={isLoading || !query.trim()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Ingresa tu consulta en lenguaje natural para buscar en el digesto jurídico
        </p>
      </div>
    </form>
  );
};
