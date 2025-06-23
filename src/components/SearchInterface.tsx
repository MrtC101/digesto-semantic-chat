
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchResult } from '@/pages/Index';
import { Search } from 'lucide-react';

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

export const SearchInterface = ({ 
  query, 
  onQueryChange, 
  onSearch,
  setQuery,
  isLoading 
}: SearchInterfaceProps) => {

  const handleSearch = () => {
    if (!chatInput.trim()) return;
    setQuery(chatInput);
    onSearch();
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
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
          onClick={handleSearch}
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
