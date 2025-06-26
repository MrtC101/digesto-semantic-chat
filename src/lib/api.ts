import { SearchResponse } from "@/components/ChatTextBar";
import axios from "axios";

function AddFilters(params, filters) {
  // Add filters to params
  if (filters.tipo_digesto?.length) {
    filters.tipo_digesto.forEach((tipo) => params.append("tipo_digesto", tipo));
  }
  if (filters.ddganio?.length) {
    filters.ddganio.forEach((anio) =>
      params.append("ddganio", anio.toString())
    );
  }
  if (filters.ddgfechasancion_desde) {
    params.append("ddgfechasancion_desde", filters.ddgfechasancion_desde);
  }
  if (filters.ddgfechasancion_hasta) {
    params.append("ddgfechasancion_hasta", filters.ddgfechasancion_hasta);
  }
  if (filters.estado?.length) {
    filters.estado.forEach((est) => params.append("estado", est));
  }
  if (filters.estado_digesto?.length) {
    filters.estado_digesto.forEach((est) =>
      params.append("estado_digesto", est)
    );
  }
  if (filters.tipo_publicacion?.length) {
    filters.tipo_publicacion.forEach((tipo) =>
      params.append("tipo_publicacion", tipo)
    );
  }
  if (filters.limit) {
    params.append("limit", filters.limit.toString());
  } else {
    filters.limit = 50;
    params.append("limit", filters.limit.toString());
  }
}

const callAPI = async (sessionId, userQuery, filters, setAssistantMsg) => {
  const apiUrl = "/api";
  const params = new URLSearchParams({
    query_str: userQuery,
    mode: "GENERATE",
    session_id: sessionId,
  });
  AddFilters(params, filters);
  const fullUrl = `${apiUrl}?${params.toString()}`;
  try {
    const response = await axios.post(fullUrl);
    const answare: SearchResponse = response.data;
    setAssistantMsg(answare?.generated_response);
  } catch (error) {
    setAssistantMsg(
      `❌ **Lo sentimos**  
Ocurrió un error al procesar tu consulta.  
Por favor, intentá nuevamente más tarde.`
    );
    //console.error("Error searching:", error);
  }
};

export default callAPI;