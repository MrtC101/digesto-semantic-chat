import { SearchContext } from "@/components/SearchContext";
import { useContext } from "react";


export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
