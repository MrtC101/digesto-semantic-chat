
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useSearchContext } from '@/hooks/use-chat-context';

export const SearchInterface = () => {

  const searchContext = useSearchContext();

  const handleSearch = () => {
    if (!searchContext.searchField.trim()) return;
    searchContext.setQuery(searchContext.searchField);
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
          value={searchContext.searchField}
          onChange={(e) => searchContext.setSearchField(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-12"
        />
        <Button
          onClick={handleSearch}
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={searchContext.isLoading || !searchContext.searchField.trim()}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Ingresa tu consulta en lenguaje natural para buscar en el digesto
        jurídico
      </p>
    </div>
  );
};
