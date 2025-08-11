// src/components/Estadisticas.js — completo
import React, { useState, useEffect } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerEstadisticas } from "../services/estadisticasDetectadasService";

function Estadisticas() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [estadisticas, setEstadisticas] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(false);
  const registrosPorPagina = 15;

  const fechasValidas =
    startDate instanceof Date && !isNaN(startDate.getTime()) &&
    endDate   instanceof Date && !isNaN(endDate.getTime());

  useEffect(() => {
    const fetchEstadisticas = async () => {
      if (!fechasValidas) {
        setEstadisticas([]); setTotalRegistros(0);
        return;
      }
      try {
        setLoading(true);
        const resp = await obtenerEstadisticas(
          startDate.toISOString(),
          endDate.toISOString(),
          registrosPorPagina,
          (paginaActual - 1) * registrosPorPagina
        );
        setEstadisticas(resp.data ?? []);
        setTotalRegistros(resp.total ?? 0);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        setEstadisticas([]); setTotalRegistros(0);
      } finally { setLoading(false); }
    };
    fetchEstadisticas();
  }, [startDate, endDate, paginaActual, fechasValidas]);

  const totalPages = Math.max(1, Math.ceil(totalRegistros / registrosPorPagina));

  function formatDateInput(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day   = String(d.getDate()).padStart(2, "0");
    const year  = d.getFullYear();
    return [year, month, day].join("-");
  }

  function toLocalFromUTCString(s) {
    // acepta "YYYY-MM-DD HH:mm:ss" asumiendo UTC y lo pinta en local
    if (!s) return "";
    const d = new Date(s.replace(" ", "T") + "Z");
    if (isNaN(d)) return s;
    return d.toLocaleString("es-ES");
  }

  return (
    <div className="analisis-produccion-container">
      <h1>Estadísticas de la Raspberry Pi</h1>

      <form className="formulario-filtrado">
        <input type="date" value={formatDateInput(startDate)} onChange={(e) => setStartDate(new Date(e.target.value))}/>
        <input type="date" value={formatDateInput(endDate)} onChange={(e) => setEndDate(new Date(e.target.value))}/>
      </form>

      {loading ? (
        <p>Cargando…</p>
      ) : estadisticas.length ? (
        <>
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Fecha (local)</th>
                <th>Equipo</th>
                <th>Uso de CPU</th>
                <th>Uso de Memoria</th>
                <th>Carga de CPU</th>
                <th>Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((stat, idx) => (
                <tr key={idx}>
                  <td>{stat.fecha_local || stat.fecha || toLocalFromUTCString(stat.fecha_utc)}</td>
                  <td>{stat.id_raspberry || "-"}</td>
                  <td>{Number(stat.uso_cpu).toFixed(1)}</td>
                  <td>{Number(stat.uso_memoria).toFixed(1)}</td>
                  <td>{Number(stat.carga_cpu).toFixed(3)}</td>
                  <td>{Number(stat.temperatura).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button onClick={() => setPaginaActual((p) => Math.max(1, p - 1))} disabled={paginaActual <= 1}>
              Anterior
            </button>
            <span>{`${paginaActual}/${totalPages}`}</span>
            <button onClick={() => setPaginaActual((p) => Math.min(totalPages, p + 1))} disabled={paginaActual >= totalPages}>
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p>Sin datos para el rango seleccionado.</p>
      )}
    </div>
  );
}

export default Estadisticas;
