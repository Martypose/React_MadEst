// src/services/estadisticasDetectadasService.js
import { api } from "../lib/api";

// MySQL local
function fmtLocal(dt) {
  if (typeof dt === "string") return dt;
  const d = dt instanceof Date ? dt : new Date(dt);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const y = d.getFullYear(), m = pad(d.getMonth() + 1), day = pad(d.getDate());
  const hh = pad(d.getHours()), mm = pad(d.getMinutes()), ss = pad(d.getSeconds());
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

// Devuelve { data: [], total: N }
export async function obtenerEstadisticas(fromDate, toDate, limit = 15, offset = 0) {
  try {
    const params = {
      fromDate: fmtLocal(fromDate),
      toDate:   fmtLocal(toDate),
      limit,
      offset,
    };
    const { data } = await api.get("/estadisticas", { params });
    if (data && Array.isArray(data.data) && typeof data.total === "number") {
      return data;
    }
    return { data: [], total: 0 };
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error);
    return { data: [], total: 0 };
  }
}
