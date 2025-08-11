// src/components/Estadisticas.js
import React, { useState, useEffect } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerEstadisticas } from "../services/estadisticasDetectadasService";

// Permite ajustar nº de núcleos desde .env si quieres (por defecto 4)
const CORES = Number(process.env.REACT_APP_PI_CORES || 4);

// Límites “sanos” (OK), de aviso (WARN) y rojos (BAD)
const LIMITS = {
  CPU_OK: 80, CPU_WARN: 90,           // %
  MEM_OK: 80, MEM_WARN: 90,           // %
  LOAD_OK: 0.7 * CORES, LOAD_WARN: 1.0 * CORES, // load 1 min (absoluto)
  TEMP_OK: 70, TEMP_WARN: 80          // °C
};

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

  // Formateo con decimales controlados
  const fmt = (v, dec = 1) => {
    if (v === null || v === undefined) return "—";
    const n = Number(v);
    return isNaN(n) ? "—" : n.toFixed(dec);
  };

  // Clase por severidad
  const cls = (val, type) => {
    const v = Number(val);
    if (isNaN(v)) return "";
    switch (type) {
      case "cpu":
        return v < LIMITS.CPU_OK ? "ok" : v < LIMITS.CPU_WARN ? "warn" : "bad";
      case "mem":
        return v < LIMITS.MEM_OK ? "ok" : v < LIMITS.MEM_WARN ? "warn" : "bad";
      case "load":
        return v < LIMITS.LOAD_OK ? "ok" : v < LIMITS.LOAD_WARN ? "warn" : "bad";
      case "temp":
        return v < LIMITS.TEMP_OK ? "ok" : v < LIMITS.TEMP_WARN ? "warn" : "bad";
      default:
        return "";
    }
  };

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
                <th>Equipo</th>
                <th>Uso de CPU&nbsp;({`≤ ${LIMITS.CPU_OK}%`})</th>
                <th>Uso de Memoria&nbsp;({`≤ ${LIMITS.MEM_OK}%`})</th>
                <th>
                  Carga de CPU (1 min)&nbsp;
                  {`(≤ ${LIMITS.LOAD_OK.toFixed(2)} / ${CORES} núcleos)`}
                </th>
                <th>Temperatura&nbsp;({`≤ ${LIMITS.TEMP_OK}°C`})</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((stat, index) => (
                <tr key={stat.id ?? index}>
                  <td>{stat.fecha}</td>
                  <td>{stat.id_raspberry || stat.device_id || "—"}</td>
                  <td className={cls(stat.uso_cpu, "cpu")}  title="OK <80%, aviso 80–90%, rojo ≥90%">
                    {fmt(stat.uso_cpu)}
                  </td>
                  <td className={cls(stat.uso_memoria, "mem")} title="OK <80%, aviso 80–90%, rojo ≥90%">
                    {fmt(stat.uso_memoria)}
                  </td>
                  <td className={cls(stat.carga_cpu, "load")} title={`OK < ${LIMITS.LOAD_OK.toFixed(2)}, aviso < ${LIMITS.LOAD_WARN.toFixed(2)}, rojo ≥ ${LIMITS.LOAD_WARN.toFixed(2)}`}>
                    {fmt(stat.carga_cpu, 3)}
                  </td>
                  <td className={cls(stat.temperatura, "temp")} title="OK <70 °C, aviso 70–80 °C, rojo ≥80 °C">
                    {fmt(stat.temperatura, 1)}
                  </td>
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
