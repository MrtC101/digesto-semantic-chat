
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SearchResult } from '@/pages/Index';
import { Calendar, FileText, BookOpen } from 'lucide-react';

interface ResultsDisplayProps {
  results: SearchResult[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'VIGENTE':
        return 'bg-green-100 text-green-800';
      case 'NO VIGENTE':
      case 'DEROGADO/A':
        return 'bg-red-100 text-red-800';
      case 'MODIFICADO/A':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'LEYES':
        return 'bg-blue-100 text-blue-800';
      case 'ORDENANZAS':
        return 'bg-purple-100 text-purple-800';
      case 'RESOLUCIONES':
        return 'bg-orange-100 text-orange-800';
      case 'DECRETOS':
        return 'bg-indigo-100 text-indigo-800';
      case 'CONVENIOS':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No especificada';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Resultados de búsqueda ({results.length})
        </h2>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTipoColor(result.tipo_digesto)}>
                      {result.tipo_digesto}
                    </Badge>
                    <Badge className={getStatusColor(result.estado_digesto)}>
                      {result.estado_digesto}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {result.ddganio}/{result.ddgnro}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {result.ddgtitulo}
                  </CardTitle>
                  {result.ddgsumario && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.ddgsumario}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  Página {result.page}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {result.chunk}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Fechas importantes</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    {result.ddgfechasancion && (
                      <div>
                        <span className="font-medium">Sanción:</span> {formatDate(result.ddgfechasancion)}
                      </div>
                    )}
                    {result.ddgfechapublicacion && (
                      <div>
                        <span className="font-medium">Publicación:</span> {formatDate(result.ddgfechapublicacion)}
                      </div>
                    )}
                    {result.ddgfechapromulgacion && (
                      <div>
                        <span className="font-medium">Promulgación:</span> {formatDate(result.ddgfechapromulgacion)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span className="font-medium">Estado y publicación</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="font-medium">Estado:</span> 
                      <Badge variant="outline" className="ml-1 text-xs">
                        {result.estado}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Tipo publicación:</span> {result.tipo_publicacion}
                    </div>
                  </div>
                </div>

                {result.ddgnormasrelacionadas && (
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Normas relacionadas</span>
                    <p className="text-xs">{result.ddgnormasrelacionadas}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
