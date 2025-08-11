// src/services/tablasDetectadasService.js
import axios from "axios";

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

// (Opcional) también exporto por defecto para quien prefiera import default
const service = { obtenerCubicoFiltrado, obtenerTablasPorMedidaYFecha };
export default service;
