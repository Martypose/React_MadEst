import React, { useState, useEffect, useCallback } from "react";
import TablasDetectadasChart from "../utils/TablasDetectadasChart";
import useDateForm from "../hooks/useDateForm";
import { obtenerCubicoFiltrado } from "../services/tablasDetectadasService";

function AnalisisProduccion() {
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
      const raw = await obtenerCubicoFiltrado(startDate, endDate, agrupamiento);
      // NORMALIZACIÓN: volumen_cubico_m3 (nuevo) o volumen_cubico (legacy),
      // y grosor_lateral_mm (nuevo) o grosor (legacy).
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

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return [year, month, day].join("-");
  };

  const canShowStats =
    (agrupamiento === "dia" && getDifferenceInDays(startDate, endDate) <= 365) ||
    agrupamiento === "semana" || agrupamiento === "mes";

  return (
    <div className="analisis-produccion-container">
      <h1>Análisis de Producción</h1>

      <form className="formulario-filtrado">
        <div className="fechas-container">
          <input type="date" value={formatDate(startDate)} onChange={(e) => setStartDate(new Date(e.target.value))}/>
          <input type="date" value={formatDate(endDate)} onChange={(e) => setEndDate(new Date(e.target.value))}/>
        </div>
        <select className="select-agrupamiento" value={agrupamiento} onChange={(e) => setAgrupamiento(e.target.value)}>
          <option value="minuto">Minuto</option>
          <option value="hora">Hora</option>
          <option value="dia">Día</option>
          <option value="semana">Semana</option>
          <option value="mes">Mes</option>
        </select>
      </form>

      <div className="botones-consulta">
        <button className="btnbuscador" onClick={setCurrentWeek}>Semana actual</button>
        <button className="btnbuscador" onClick={setTwoWeeksGroupedByDay}>Dos semanas</button>
        <button className="btnbuscador" onClick={setCurrentMonth}>Mes actual</button>
        <button className="btnbuscador" onClick={setLastSixMonths}>Últimos 6 meses</button>
        <button className="btnbuscador" onClick={setCurrentYear}>Año actual</button>
      </div>

      {loading && <p>Cargando…</p>}

      {canShowStats && stats.dataAvailable && (
        <div className="estadisticas-container">
          <p>Total: {stats.totalVolume.toFixed(3)} m³</p>
          <p>Máximo: {stats.maxVolume.toFixed(3)} m³{stats.maxVolumeDay ? ` — ${formatDateWithDay(stats.maxVolumeDay)}` : ""}</p>
          <p>Media: {stats.averageVolume.toFixed(3)} m³</p>
          {agrupamiento === "dia" && stats.minVolumeDays.length > 0 && (
            <>
              <p>Días menos productivos:</p>
              <ul>
                {stats.minVolumeDays.map((day, i) => (
                  <li key={i}>{day.fecha}: {day.volumen.toFixed(3)} m³</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <TablasDetectadasChart data={chartData} agrupamiento={agrupamiento} />
    </div>
  );
}

export default AnalisisProduccion;
