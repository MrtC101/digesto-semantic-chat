import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SearchFilters } from "../types";
import useChatContext from "@/hooks/use_chat_context_hook";

export const FilterSidebar = () => {
  const { activeChat } = useChatContext()
  const [newYear, setNewYear] = useState("");
  const filters = activeChat.filters

  const tipoDigestoOptions = [
    "LEYES",
    "ORDENANZAS",
    "RESOLUCIONES",
    "DECRETOS",
    "CONVENIOS",
  ];
  const estadoOptions = ["INCIERTO", "PUBLICADO", "PENDIENTE PUBLICACION"];
  const estadoDigestoOptions = [
    "INCIERTO",
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

  const handleCheckboxChange = (
    category: keyof SearchFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (filters[category] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFiltersChange({
      ...filters,
      [category]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const handleYearAdd = () => {
    const year = parseInt(newYear);
    if (year && year > 1900 && year <= new Date().getFullYear()) {
      const currentYears = filters.ddganio || [];
      if (!currentYears.includes(year)) {
        onFiltersChange({
          ...filters,
          ddganio: [...currentYears, year].sort((a, b) => b - a),
        });
      }
      setNewYear("");
    }
  };

  const handleYearRemove = (year: number) => {
    const currentYears = filters.ddganio || [];
    const newYears = currentYears.filter((y) => y !== year);
    onFiltersChange({
      ...filters,
      ddganio: newYears.length > 0 ? newYears : undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== ""
  ).length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Filtros activos: {activeFiltersCount}
        </span>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Limpiar todo
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Tipo de Digesto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tipoDigestoOptions.map((tipo) => (
            <div key={tipo} className="flex items-center space-x-2">
              <Checkbox
                id={`tipo-${tipo}`}
                checked={filters.tipo_digesto?.includes(tipo) || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("tipo_digesto", tipo, checked as boolean)
                }
              />
              <Label htmlFor={`tipo-${tipo}`} className="text-sm font-normal">
                {tipo}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Años</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Año"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
            />
            <Button size="sm" onClick={handleYearAdd} disabled={!newYear}>
              +
            </Button>
          </div>
          {filters.ddganio && filters.ddganio.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.ddganio.map((year) => (
                <Badge key={year} variant="secondary" className="text-xs">
                  {year}
                  <button
                    onClick={() => handleYearRemove(year)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Fechas de Sanción</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="fecha-desde" className="text-xs">
              Desde
            </Label>
            <Input
              id="fecha-desde"
              type="date"
              value={filters.ddgfechasancion_desde || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  ddgfechasancion_desde: e.target.value || undefined,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="fecha-hasta" className="text-xs">
              Hasta
            </Label>
            <Input
              id="fecha-hasta"
              type="date"
              value={filters.ddgfechasancion_hasta || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  ddgfechasancion_hasta: e.target.value || undefined,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Estado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {estadoOptions.map((estado) => (
            <div key={estado} className="flex items-center space-x-2">
              <Checkbox
                id={`estado-${estado}`}
                checked={filters.estado?.includes(estado) || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("estado", estado, checked as boolean)
                }
              />
              <Label
                htmlFor={`estado-${estado}`}
                className="text-sm font-normal"
              >
                {estado}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Estado del Digesto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {estadoDigestoOptions.map((estado) => (
            <div key={estado} className="flex items-center space-x-2">
              <Checkbox
                id={`estado-digesto-${estado}`}
                checked={filters.estado_digesto?.includes(estado) || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(
                    "estado_digesto",
                    estado,
                    checked as boolean
                  )
                }
              />
              <Label
                htmlFor={`estado-digesto-${estado}`}
                className="text-sm font-normal"
              >
                {estado}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Tipo de Publicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tipoPublicacionOptions.map((tipo) => (
            <div key={tipo} className="flex items-center space-x-2">
              <Checkbox
                id={`tipo-pub-${tipo}`}
                checked={filters.tipo_publicacion?.includes(tipo) || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(
                    "tipo_publicacion",
                    tipo,
                    checked as boolean
                  )
                }
              />
              <Label
                htmlFor={`tipo-pub-${tipo}`}
                className="text-sm font-normal"
              >
                {tipo}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Límite de Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id="FiltroLimite"
            type="number"
            placeholder="50"
            min="1"
            max="100"
            value={filters.limit || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                limit: e.target.value ? parseInt(e.target.value) : 50,
              })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Máximo 100 resultados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
