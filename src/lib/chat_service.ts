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

const chatService = async (session_id, user_msg, filters): Promise<[string,string]> => {
  const params = new URLSearchParams({
    query_str: user_msg,
    mode: "GENERATE",
    session_id: session_id,
  });
  AddFilters(params, filters);
  let msg = "";
  let topic = "";
  try {
    const response = await axios.post(`api/chat/from_contenidos?${params.toString()}`);
    msg = response.data?.generated_response;
    topic = response.data.topic;
  } catch (error) {
    msg = `❌ **Lo sentimos**  
    Ocurrió un error al procesar tu consulta.  
    Por favor, intentá nuevamente más tarde.`;
  }
  return [msg, topic];
};

export default chatService;
