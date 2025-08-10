// src/components/Estadisticas.js
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
        setEstadisticas([]);
        setTotalRegistros(0);
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
        setEstadisticas([]);
        setTotalRegistros(0);
      } finally {
        setLoading(false);
      }
    };
    fetchEstadisticas();
  }, [startDate, endDate, paginaActual, fechasValidas]);

  const totalPages = Math.max(1, Math.ceil(totalRegistros / registrosPorPagina));

  function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day   = String(d.getDate()).padStart(2, "0");
    const year  = d.getFullYear();
    return [year, month, day].join("-");
  }

  return (
    <div className="analisis-produccion-container">
      <h1>Estadísticas de la Raspberry Pi</h1>

      <form className="formulario-filtrado">
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        <input
          type="date"
          value={formatDate(endDate)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </form>

      {loading ? (
        <p>Cargando…</p>
      ) : estadisticas.length ? (
        <>
          <table className="tabla-datos">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Uso de CPU</th>
                <th>Uso de Memoria</th>
                <th>Carga de CPU</th>
                <th>Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.fecha}</td>
                  <td>{stat.uso_cpu}</td>
                  <td>{stat.uso_memoria}</td>
                  <td>{stat.carga_cpu}</td>
                  <td>{stat.temperatura}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual <= 1}
            >
              Anterior
            </button>
            <span>{`${paginaActual}/${totalPages}`}</span>
            <button
              onClick={() => setPaginaActual((p) => Math.min(totalPages, p + 1))}
              disabled={paginaActual >= totalPages}
            >
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
