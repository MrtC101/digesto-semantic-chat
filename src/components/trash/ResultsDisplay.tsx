import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, BookOpen } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { marked } from "marked";
import { useSearchContext } from "@/hooks/use-chat-context";
import { CardResult } from "./CardResult";
import DOMPurify from "dompurify";

interface SearchResponse {
  generated_response: string;
  results: SearchResult[];
}

interface SearchResult {
  chunk: string;
  ddganio: number;
  ddgfechaalta?: string;
  ddgfechaderogacion?: string;
  ddgfechapromulgacion?: string;
  ddgfechapublicacion?: string;
  ddgfechasancion?: string;
  ddgid: number;
  ddgnormasrelacionadas: string;
  ddgnro: string;
  ddgsumario: string;
  ddgtitulo: string;
  distance: number;
  estado: string;
  estado_digesto: string;
  pagina: number;
  tipo_digesto: string;
  tipo_ley: string;
  tipo_publicacion: string;
}

export const ResultsDisplay = () => {
  const searchContext = useSearchContext();
  return (
    <div className="space-y-4">
      <div className="flex items-start p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            Respuesta IA
          </h1>
          <div
            className="markdown text-base leading-relaxed [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                marked(searchContext.response?.generated_response)
              ),
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Resultados de búsqueda</h2>
      </div>

      <div className="space-y-4">
        {searchContext.response?.results.length === 0 ? (
          <p className="text-sm text-gray-500">No se encontraron resultados.</p>
        ) : (
          searchContext.response?.results
            .slice()
            .sort((r1, r2) => r1.distance - r2.distance)
            .map((result, index) => (
              <div key={uuidv4()}>
                <CardResult result={result} />
              </div>
            ))
        )}
      </div>
    </div>
  );
};
