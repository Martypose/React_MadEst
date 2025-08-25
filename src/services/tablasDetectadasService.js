// src/services/tablasDetectadasService.js
import { api } from "../lib/api";

// Formato MySQL local "YYYY-MM-DD HH:mm:ss"
function fmtLocal(dt) {
  if (typeof dt === "string") return dt; // asumimos ya formateada
  const d = dt instanceof Date ? dt : new Date(dt);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
}

// Cubicaje por fecha y grosor (minuto/hora/día/semana/mes)
export async function obtenerCubicoFiltrado(startDate, endDate, agrupamiento = "dia", descabezadaFilter = "all") {
  const params = {
    startDate: fmtLocal(startDate),
    endDate:   fmtLocal(endDate),
    agrupamiento,
    descabezadaFilter,
  };
  const { data } = await api.get("/tablasdetectadas/cubico-por-fecha", { params });
  return Array.isArray(data) ? data : [];
}

// Listado por medida/fecha (vista legacy)
export async function obtenerTablasPorMedidaYFecha(startDate, endDate, agrupamiento = "dia") {
  const params = {
    startDate: fmtLocal(startDate),
    endDate:   fmtLocal(endDate),
    agrupamiento,
  };
  const { data } = await api.get("/tablasdetectadas/por-fechas", { params });
  return Array.isArray(data) ? data : [];
}

// Últimas medidas crudas
export async function obtenerUltimasMedidas(limit = 500) {
  const lim = Math.min(Number(limit) || 200, 1000);
  const { data } = await api.get("/tablasdetectadas/ultimas", { params: { limit: lim } });
  return Array.isArray(data) ? data : [];
}

// Listado detallado/paginado de piezas (usado por TablasNumeros)
export async function obtenerPiezas(startDate, endDate, opts = {}) {
  const params = {
    startDate: fmtLocal(startDate),
    endDate:   fmtLocal(endDate),
    limit:     Number(opts.limit ?? 200),
    offset:    Number(opts.offset ?? 0),
    orderBy:   String(opts.orderBy ?? "fecha"),
    orderDir:  String(opts.orderDir ?? "desc"),
  };
  const { data } = await api.get("/tablasdetectadas/piezas", { params });
  // El backend devuelve { data: [], total: N }
  return (data && typeof data.total === "number") ? data : { data: [], total: 0 };
}

// export default para compatibilidad si en algún sitio usan import default
const service = {
  obtenerCubicoFiltrado,
  obtenerTablasPorMedidaYFecha,
  obtenerUltimasMedidas,
  obtenerPiezas,
};
export default service;
