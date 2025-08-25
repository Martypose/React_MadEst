import React, { useState, useEffect, useCallback, useMemo } from "react";
import TablasDetectadasChart from "../utils/TablasDetectadasChart";
import useDateForm from "../hooks/useDateForm";
import { obtenerCubicoFiltrado } from "../services/tablasDetectadasService";

// ✅ Estético minimalista sin dependencias: estilos locales y prefijados `ap-`
function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById("ap-styles")) return;
    const style = document.createElement("style");
    style.id = "ap-styles";
    style.textContent = `
      :root {
        --ap-bg: #f6f7f9;
        --ap-surface: #ffffff;
        --ap-text: #0f172a;
        --ap-muted: #64748b;
        --ap-accent: #2563eb;
        --ap-border: rgba(2, 6, 23, 0.08);
        --ap-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --ap-bg: #0b0e13;
          --ap-surface: #12161c;
          --ap-text: #e5e7eb;
          --ap-muted: #9ca3af;
          --ap-accent: #60a5fa;
          --ap-border: rgba(255,255,255,0.08);
          --ap-shadow: 0 1px 2px rgba(0,0,0,0.5), 0 6px 24px rgba(0,0,0,0.35);
        }
      }
      .ap-container {
        background: var(--ap-bg);
        min-height: 100%;
        padding: 16px;
      }
      .ap-shell {
        max-width: 1180px; margin: 0 auto;
      }
      .ap-toolbar {
        position: sticky; top: 0; z-index: 5;
        background: color-mix(in oklab, var(--ap-surface) 88%, transparent);
        backdrop-filter: blur(8px);
        border: 1px solid var(--ap-border);
        box-shadow: var(--ap-shadow);
        border-radius: 14px;
        padding: 12px 16px;
        margin-bottom: 16px;
      }
      .ap-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
      .ap-title { font-size: 18px; font-weight: 600; color: var(--ap-text); margin-right: auto; }
      .ap-date {
        appearance: none; border: 1px solid var(--ap-border); background: var(--ap-surface);
        color: var(--ap-text); padding: 8px 10px; border-radius: 10px;
      }
      .ap-seg {
        display: inline-flex; border: 1px solid var(--ap-border); border-radius: 10px; overflow: hidden;
      }
      .ap-seg button {
        background: transparent; border: 0; padding: 8px 12px; color: var(--ap-muted);
        cursor: pointer; font-weight: 600;
      }
      .ap-seg button[aria-pressed="true"] {
        background: color-mix(in oklab, var(--ap-accent) 16%, var(--ap-surface));
        color: var(--ap-text);
      }
      .ap-chips { display: flex; gap: 8px; flex-wrap: wrap; }
      .ap-chip {
        border: 1px solid var(--ap-border); background: var(--ap-surface);
        color: var(--ap-text); padding: 6px 10px; border-radius: 999px; cursor: pointer;
        transition: transform .08s ease;
      }
      .ap-chip:hover { transform: translateY(-1px); }
      .ap-section { display: grid; gap: 16px; }
      .ap-grid {
        display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px;
      }
      .ap-card {
        grid-column: span 12; background: var(--ap-surface);
        border: 1px solid var(--ap-border); border-radius: 14px;
        box-shadow: var(--ap-shadow); padding: 16px;
      }
      @media (min-width: 900px) {
        .ap-card--kpi { grid-column: span 3; }
        .ap-card--chart { grid-column: span 12; }
      }
      .ap-kpi-title { color: var(--ap-muted); font-size: 12px; letter-spacing: .02em; }
      .ap-kpi-value { color: var(--ap-text); font-size: 24px; font-weight: 700; margin-top: 4px; }
      .ap-kpi-sub { color: var(--ap-muted); font-size: 12px; margin-top: 2px; }
      .ap-empty {
        display: grid; place-items: center; padding: 48px; color: var(--ap-muted);
      }
      .ap-skeleton {
        position: relative; overflow: hidden; background: color-mix(in oklab, var(--ap-text) 8%, transparent);
        border-radius: 10px; min-height: 160px;
      }
      .ap-skeleton::after {
        content: ""; position: absolute; inset: 0;
        background: linear-gradient(90deg, transparent, color-mix(in oklab, var(--ap-surface) 65%, transparent), transparent);
        transform: translateX(-100%); animation: ap-shimmer 1.2s infinite;
      }
      @keyframes ap-shimmer { to { transform: translateX(100%); } }
      .ap-chart-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px; }
      .ap-muted { color: var(--ap-muted); font-size: 12px; }
      .ap-badge {
        border: 1px solid var(--ap-border); border-radius: 999px; padding: 4px 8px; color: var(--ap-muted);
      }
    `;
    document.head.appendChild(style);
  }, []);
}

export default function AnalisisProduccion() {
  useInjectStyles();

  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [agrupamiento, setAgrupamiento] = useState("dia");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalVolume: 0,
    maxVolume: 0,
    maxVolumeDay: null,
    averageVolume: 0,
    minVolumeDays: [],
    dataAvailable: false,
  });

  const nf = useMemo(
    () => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3 }),
    []
  );
  const fmtDate = (d) => {
    const x = new Date(d);
    if (isNaN(x)) return d;
    return x.toISOString().slice(0, 10);
  };
  const formatDateWithDay = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    const dayName = days[d.getDay()];
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };
  const getDifferenceInDays = (a, b) => {
    if (!(a instanceof Date) || !(b instanceof Date)) return 0;
    const diffTime = Math.abs(b - a);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateStats = useCallback((data) => {
    if (!Array.isArray(data) || data.length === 0) {
      setStats({
        totalVolume: 0, maxVolume: 0, maxVolumeDay: null,
        averageVolume: 0, minVolumeDays: [], dataAvailable: false,
      });
      return;
    }
    const volumeByDate = new Map();
    for (const item of data) {
      if (!item || !item.fecha) continue;
      const v = Number(item.volumen || 0);
      volumeByDate.set(item.fecha, (volumeByDate.get(item.fecha) || 0) + v);
    }
    const entries = Array.from(volumeByDate.entries());
    if (!entries.length) {
      setStats({
        totalVolume: 0, maxVolume: 0, maxVolumeDay: null,
        averageVolume: 0, minVolumeDays: [], dataAvailable: false,
      });
      return;
    }
    const totalVolume = entries.reduce((acc, [, v]) => acc + v, 0);
    const averageVolume = totalVolume / entries.length;
    let maxVolume = -Infinity, maxVolumeDay = null;
    for (const [f, v] of entries) if (v > maxVolume) { maxVolume = v; maxVolumeDay = f; }
    const numDaysToShow = entries.length > 10 ? 5 : 1;
    const minVolumeDays = entries
      .map(([f, v]) => ({ fecha: formatDateWithDay(f), volumen: v }))
      .sort((a, b) => a.volumen - b.volumen)
      .slice(0, numDaysToShow);
    setStats({ totalVolume, averageVolume, maxVolume, maxVolumeDay, minVolumeDays, dataAvailable: true });
  }, []);

  const fetchFilteredData = useCallback(async () => {
    const valid =
      startDate instanceof Date && !isNaN(startDate) &&
      endDate instanceof Date && !isNaN(endDate);

    if (!valid) {
      setChartData([]);
      setStats(s => ({ ...s, dataAvailable: false, totalVolume: 0, averageVolume: 0, maxVolume: 0, maxVolumeDay: null, minVolumeDays: [] }));
      return;
    }
    try {
      setLoading(true);
      // Backend soporta agrupamiento minuto|hora|dia|semana|mes|año (map de la ruta) → usamos dia/semana/mes. :contentReference[oaicite:1]{index=1}
      const raw = await obtenerCubicoFiltrado(startDate, endDate, agrupamiento);
      const normalized = (Array.isArray(raw) ? raw : []).map(d => ({
        fecha: d.fecha,
        volumen: Number(d.volumen_cubico_m3 ?? d.volumen_cubico ?? 0),
        grosor: d.grosor_lateral_mm ?? d.grosor ?? null,
      }));
      setChartData(normalized);
      calculateStats(normalized);
    } catch (e) {
      console.error("Error al obtener los datos:", e);
      setChartData([]);
      setStats(s => ({ ...s, dataAvailable: false, totalVolume: 0, averageVolume: 0, maxVolume: 0, maxVolumeDay: null, minVolumeDays: [] }));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, agrupamiento, calculateStats]);

  useEffect(() => { fetchFilteredData(); }, [fetchFilteredData]);

  // RANGOS RÁPIDOS (chips)
  const setCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);
    if (dayOfWeek === 0) startOfWeek.setDate(now.getDate() - 6);
    else startOfWeek.setDate(now.getDate() - (dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setTime(startOfWeek.getTime());
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    setStartDate(startOfWeek); setEndDate(endOfWeek); setAgrupamiento("dia");
  };
  const setCurrentMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(startOfMonth); setEndDate(endOfMonth); setAgrupamiento("dia");
  };
  const setLastSixMonths = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start); setEndDate(end); setAgrupamiento("mes");
  };
  const setCurrentYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    setStartDate(start); setEndDate(end); setAgrupamiento("mes");
  };
  const setTwoWeeksGroupedByDay = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 18);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    setStartDate(start); setEndDate(end); setAgrupamiento("dia");
  };

  // Condición para mostrar KPIs (misma que tenías, con copia visual)
  const canShowStats =
    (agrupamiento === "dia" && getDifferenceInDays(startDate, endDate) <= 365) ||
    agrupamiento === "semana" || agrupamiento === "mes";

  return (
    <div className="ap-container">
      <div className="ap-shell">

        {/* ───────── Toolbar sticky ───────── */}
        <div className="ap-toolbar" role="region" aria-label="Filtros de análisis">
          <div className="ap-row" style={{marginBottom: 8}}>
            <div className="ap-title">Análisis de Producción</div>
            <div className="ap-seg" role="group" aria-label="Agrupamiento">
              {["dia","semana","mes"].map(opt => (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={agrupamiento===opt}
                  onClick={() => setAgrupamiento(opt)}
                  title={`Agrupar por ${opt}`}
                >
                  {opt === "dia" ? "Día" : opt === "semana" ? "Semana" : "Mes"}
                </button>
              ))}
            </div>
            <input
              className="ap-date"
              type="date"
              value={startDate instanceof Date && !isNaN(startDate) ? fmtDate(startDate) : ""}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              aria-label="Fecha inicio"
            />
            <input
              className="ap-date"
              type="date"
              value={endDate instanceof Date && !isNaN(endDate) ? fmtDate(endDate) : ""}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              aria-label="Fecha fin"
            />
          </div>
          <div className="ap-row ap-chips" aria-label="Rangos rápidos">
            <button className="ap-chip" type="button" onClick={setCurrentWeek}>Semana actual</button>
            <button className="ap-chip" type="button" onClick={setCurrentMonth}>Mes actual</button>
            <button className="ap-chip" type="button" onClick={setTwoWeeksGroupedByDay}>Últ. 2 semanas</button>
            <button className="ap-chip" type="button" onClick={setLastSixMonths}>Últ. 6 meses</button>
            <button className="ap-chip" type="button" onClick={setCurrentYear}>Año actual</button>
            <span className="ap-badge" aria-live="polite">
              {loading ? "Actualizando…" : "Listo"}
            </span>
          </div>
        </div>

        {/* ───────── Contenido ───────── */}
        <div className="ap-section">

          {/* KPI cards */}
          <div className="ap-grid">
            {canShowStats ? (
              <>
                <div className="ap-card ap-card--kpi">
                  <div className="ap-kpi-title">Total (m³)</div>
                  <div className="ap-kpi-value">{nf.format(stats.totalVolume)}</div>
                  <div className="ap-kpi-sub">Periodo seleccionado</div>
                </div>
                <div className="ap-card ap-card--kpi">
                  <div className="ap-kpi-title">Media (m³ / periodo)</div>
                  <div className="ap-kpi-value">{nf.format(stats.averageVolume)}</div>
                  <div className="ap-kpi-sub">
                    Agr: {agrupamiento === "dia" ? "día" : (agrupamiento === "semana" ? "semana" : "mes")}
                  </div>
                </div>
                <div className="ap-card ap-card--kpi">
                  <div className="ap-kpi-title">Pico (m³)</div>
                  <div className="ap-kpi-value">{nf.format(stats.maxVolume)}</div>
                  <div className="ap-kpi-sub">{stats.maxVolumeDay ? formatDateWithDay(stats.maxVolumeDay) : "—"}</div>
                </div>
                <div className="ap-card ap-card--kpi">
                  <div className="ap-kpi-title">Días mínimos</div>
                  <div className="ap-kpi-sub">Más bajos del rango</div>
                  <ul style={{marginTop: 6, paddingLeft: 16}}>
                    {stats.minVolumeDays.map((d, i) => (
                      <li key={i} className="ap-muted">
                        {d.fecha}: <strong style={{color: "var(--ap-text)"}}>{nf.format(d.volumen)} m³</strong>
                      </li>
                    ))}
                    {!stats.minVolumeDays.length && <li className="ap-muted">—</li>}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="ap-card ap-card--kpi ap-skeleton" aria-hidden="true"></div>
                <div className="ap-card ap-card--kpi ap-skeleton" aria-hidden="true"></div>
                <div className="ap-card ap-card--kpi ap-skeleton" aria-hidden="true"></div>
                <div className="ap-card ap-card--kpi ap-skeleton" aria-hidden="true"></div>
              </>
            )}
          </div>

          {/* Chart */}
          <div className="ap-card ap-card--chart">
            <div className="ap-chart-header">
              <div className="ap-muted">
                {startDate && endDate ? `${fmtDate(startDate)} → ${fmtDate(endDate)}` : "Selecciona fechas"}
              </div>
              <div className="ap-muted">{chartData?.length ?? 0} puntos</div>
            </div>
            {loading ? (
              <div className="ap-skeleton" style={{minHeight: 280}} aria-hidden="true"></div>
            ) : chartData && chartData.length ? (
              <TablasDetectadasChart data={chartData} />
            ) : (
              <div className="ap-empty">
                <div>
                  <div style={{fontWeight: 700, color: "var(--ap-text)", marginBottom: 6}}>Sin datos</div>
                  <div className="ap-muted">Cambia el rango o el agrupamiento.</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
