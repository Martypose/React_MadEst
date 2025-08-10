// src/services/estadisticasDetectadasService.js
import axios from "axios";

export const obtenerEstadisticas = async (fromDate, toDate, limit = 15, offset = 0) => {
  const token = localStorage.getItem("accessToken");
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_URL_API}/estadisticas`, {
      headers: { "Content-Type": "application/json", accessToken: token },
      params: { fromDate, toDate, limit, offset },
    });
    // Debe volver { data: [], total: N }
    if (data && Array.isArray(data.data) && typeof data.total === "number") {
      return data;
    }
    return { data: [], total: 0 };
  } catch (error) {
    console.error("Hubo un error al obtener las estadísticas:", error);
    return { data: [], total: 0 };
  }
};
