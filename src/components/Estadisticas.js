// src/components/Estadisticas.js
import React, { useState, useEffect, useMemo } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerEstadisticas } from "../services/estadisticasDetectadasService";

const UMBRALES = {
  cpu:  { ok: 40, warn: 70, high: 85 },   // %
  mem:  { ok: 60, warn: 75, high: 85 },   // %
  load: { ok: 0.50, warn: 0.75, high: 1 },// fracción de núcleos (× cores)
  temp: { ok: 60, warn: 70, high: 80 },   // °C
};

// Ajusta aquí si alguna Pi tiene otros núcleos
const CORES_BY_DEVICE = {
  "pi-cenital": 4,
  "pi-lateral": 4,
};

function coresFor(device) {
  return CORES_BY_DEVICE[device] ?? 4;
}

function levelBy(value, kind, device) {
  const v = Number(value) || 0;
  const t = UMBRALES[kind];

  if (kind === "load") {
    const n = coresFor(device);
    const r = n > 0 ? v / n : v; // ratio sobre capacidad
    if (r <= t.ok)   return "ok";
    if (r <= t.warn) return "warn";
    if (r <= t.high) return "high";
    return "crit";
  }

  if (v <= t.ok)   return "ok";
  if (v <= t.warn) return "warn";
  if (v <= t.high) return "high";
  return "crit";
}

function clampPct(x) {
  const v = Number.isFinite(x) ? x : 0;
  return Math.max(0, Math.min(100, v));
}

function asLocal(dateStr) {
  // El backend devuelve "YYYY-MM-DD HH:mm:ss" (sin zona).
  // Lo mostramos tal cual (ya viene en la TZ del servidor).
  return dateStr || "";
}

export default function Estadisticas() {
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
      } catch (e) {
        console.error("Error al obtener las estadísticas:", e);
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

  // Agrupa por equipo (opcionalmente, por si quieres hacer filtros después)
  const equipos = useMemo(() => {
    const set = new Set((estadisticas || []).map(r => r.id_raspberry).filter(Boolean));
    return Array.from(set.values());
  }, [estadisticas]);

  function Meter({ value, unit = "%", level = "ok", title = "", pctOverride }) {
    const pct = clampPct(
      pctOverride == null ? Number(value) : Number(pctOverride)
    );
    return (
      <div className="kpi">
        <div className="kpi-top">
          <span className={`badge ${level}`}>{title}</span>
          <span className="kpi-val">
            {Number(value).toFixed(unit === "°C" ? 1 : unit === "" ? 3 : 1)}{unit}
          </span>
        </div>
        <div className="meter">
          <div className={`bar ${level}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="analisis-produccion-container">
      <h1>Estadísticas de la Raspberry Pi</h1>

      <form className="formulario-filtrado">
        <input type="date" value={formatDateInput(startDate)} onChange={(e) => setStartDate(new Date(e.target.value))}/>
        <input type="date" value={formatDateInput(endDate)}   onChange={(e) => setEndDate(new Date(e.target.value))}/>
      </form>

      <div className="legend">
        <span className="dot ok" /> Baja
        <span className="dot warn" /> Aviso
        <span className="dot high" /> Alta
        <span className="dot crit" /> Crítica
      </div>

      {loading ? (
        <p>Cargando…</p>
      ) : (estadisticas?.length ? (
        <>
          <table className="tabla-datos tabla-stats">
            <thead>
              <tr>
                <th style={{minWidth: 160}}>Fecha</th>
                <th>Equipo</th>
                <th>Uso de CPU</th>
                <th>Uso de Memoria</th>
                <th>Carga (1m)</th>
                <th>Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((stat, idx) => {
                const equipo = stat.id_raspberry || "-";
                const cpuL   = levelBy(stat.uso_cpu, "cpu", equipo);
                const memL   = levelBy(stat.uso_memoria, "mem", equipo);
                const loadL  = levelBy(stat.carga_cpu, "load", equipo);
                const tempL  = levelBy(stat.temperatura, "temp", equipo);

                const cores   = coresFor(equipo);
                const loadPct = clampPct((Number(stat.carga_cpu || 0) / Math.max(1, cores)) * 100);

                // Nivel de fila: si algo es crítico → crit; si no, coge el peor
                const rowLevel =
                  ["crit","high","warn","ok"].find(l =>
                    [cpuL,memL,loadL,tempL].includes(l)
                  ) || "ok";

                return (
                  <tr key={idx} className={`row-${rowLevel}`}>
                    <td className="fecha">{asLocal(stat.fecha)}</td>
                    <td className="equipo">
                      <span className="chip">{equipo}</span>
                    </td>
                    <td>
                      <Meter value={stat.uso_cpu} unit="%" level={cpuL} title="CPU" />
                    </td>
                    <td>
                      <Meter value={stat.uso_memoria} unit="%" level={memL} title="Mem" />
                    </td>
                    <td>
                      <div className="kpi">
                        <div className="kpi-top">
                          <span className={`badge ${loadL}`}>Load</span>
                          <span className="kpi-val">
                            {Number(stat.carga_cpu).toFixed(3)}{" "}
                            <span className="muted">({cores} núc)</span>
                          </span>
                        </div>
                        <div className="meter">
                          <div className={`bar ${loadL}`} style={{ width: `${loadPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Meter value={stat.temperatura} unit="°C" level={tempL} title="Temp" pctOverride={(Number(stat.temperatura) / 90) * 100} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="paginador">
            <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual <= 1}>
              Anterior
            </button>
            <span>{`${paginaActual}/${totalPages}`}</span>
            <button onClick={() => setPaginaActual(p => Math.min(totalPages, p + 1))} disabled={paginaActual >= totalPages}>
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p>Sin datos para el rango seleccionado.</p>
      ))}
    </div>
  );
}
