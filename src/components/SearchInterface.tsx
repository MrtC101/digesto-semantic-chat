
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
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
          onKeyPress={handleKeyPress}
          className="pr-12"
        />
        <Button 
          onClick={onSearch}
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
  );
};
