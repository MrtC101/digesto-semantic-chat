import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { SearchFilters } from "../types";
import useChatContext from "@/hooks/use-chat-context-hook";

export const FilterSidebar = () => {
  const estadoOptions = ["PUBLICADO", "PENDIENTE PUBLICACION"];
  const estadoDigestoOptions = [
    "NO VIGENTE",
    "VIGENTE",
    "DEROGADO/A",
    "MODIFICADO/A",
  ];
  const tipoPublicacionOptions = [
    "PUBLICO",
    "INTERNO HCD",
    "INTERNO EJECUTIVO",
  ];

  const { allChats, filters, setFilters } = useChatContext();

  if (allChats.length === 0) return null;

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleCheckboxChange = (
    category: keyof SearchFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (filters[category] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    updateFilters({
      ...filters,
      [category]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const toLabel = (str: string) =>
    str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="px-3 pt-2 pb-1 text-xs">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="estado">
          <AccordionTrigger className="text-xs py-2">Estado de Publicación</AccordionTrigger>
          <AccordionContent className="space-y-1 pb-3">
            {estadoOptions.map((estado) => (
              <label key={estado} className="flex items-center gap-2 py-0.5 cursor-pointer">
                <Checkbox
                  id={`estado-${estado}`}
                  checked={filters.estado?.includes(estado) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("estado", estado, checked as boolean)
                  }
                />
                <span>{toLabel(estado)}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="estado-digesto">
          <AccordionTrigger className="text-xs py-2">Vigencia</AccordionTrigger>
          <AccordionContent className="space-y-1 pb-3">
            {estadoDigestoOptions.map((estado) => (
              <label key={estado} className="flex items-center gap-2 py-0.5 cursor-pointer">
                <Checkbox
                  id={`estado-digesto-${estado}`}
                  checked={filters.estado_digesto?.includes(estado) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("estado_digesto", estado, checked as boolean)
                  }
                />
                <span>{toLabel(estado)}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tipo-publicacion">
          <AccordionTrigger className="text-xs py-2">Tipo de Publicación</AccordionTrigger>
          <AccordionContent className="space-y-1 pb-3">
            {tipoPublicacionOptions.map((tipo) => (
              <label key={tipo} className="flex items-center gap-2 py-0.5 cursor-pointer">
                <Checkbox
                  id={`tipo-pub-${tipo}`}
                  checked={filters.tipo_publicacion?.includes(tipo) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("tipo_publicacion", tipo, checked as boolean)
                  }
                />
                <span>{toLabel(tipo)}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
