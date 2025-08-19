// src/services/tablasDetectadasService.js
import axios from "axios";
import { api } from "../lib/Api";

const API = process.env.REACT_APP_URL_API;

function cfg() {
  const token = localStorage.getItem("accessToken");
  return { headers: { "Content-Type": "application/json", accessToken: token } };
}

// Cubicaje por fecha y grosor (minuto/hora/día/semana/mes)
export async function obtenerCubicoFiltrado(startDate, endDate, agrupamiento = "dia") {
  const params = {
    startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
    endDate:   endDate   instanceof Date ? endDate.toISOString()   : endDate,
    agrupamiento,
  };
  const { data } = await axios.get(`${API}/tablasdetectadas/cubico-por-fecha`, { ...cfg(), params });
  return Array.isArray(data) ? data : [];
}

function fmtLocal(dt) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = dt.getFullYear(), m = pad(dt.getMonth()+1), d = pad(dt.getDate());
  const hh = pad(dt.getHours()), mm = pad(dt.getMinutes()), ss = pad(dt.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

export async function obtenerCubicoFiltrado(startDate, endDate, agrupamiento="dia", descabezadaFilter="all") {
  const params = {
    startDate: fmtLocal(startDate),
    endDate:   fmtLocal(endDate),
    agrupamiento,
    descabezadaFilter,
  };
  const { data } = await api.get("/tablasdetectadas/cubico-por-fecha", { params });
  return data;
}

// Listado por medida/fecha (vista legacy)
export async function obtenerTablasPorMedidaYFecha(startDate, endDate, agrupamiento = "dia") {
  const params = {
    startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
    endDate:   endDate   instanceof Date ? endDate.toISOString()   : endDate,
    agrupamiento,
  };
  const { data } = await axios.get(`${API}/tablasdetectadas/por-fechas`, { ...cfg(), params });
  return Array.isArray(data) ? data : [];
}

export async function obtenerUltimasMedidas(limit = 500) {
  const { data } = await axios.get(`${API}/tablasdetectadas/ultimas`, {
    ...cfg(),
    params: { limit: Math.min(Number(limit) || 200, 1000) },
  });
  return Array.isArray(data) ? data : [];
}

export async function obtenerPiezas(startDate, endDate, opts = {}) {
  const params = {
    startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
    endDate:   endDate   instanceof Date ? endDate.toISOString()   : endDate,
    limit:  Number(opts.limit ?? 200),
    offset: Number(opts.offset ?? 0),
    orderBy: String(opts.orderBy ?? 'fecha'),
    orderDir: String(opts.orderDir ?? 'desc'),
  };
  const { data } = await axios.get(`${API}/tablasdetectadas/piezas`, { ...cfg(), params });
  return data; // { data: [...], total: N }
}

// (Opcional) también exporto por defecto para quien prefiera import default
const service = { obtenerCubicoFiltrado, obtenerTablasPorMedidaYFecha };
export default service;
