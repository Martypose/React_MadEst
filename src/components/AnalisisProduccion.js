import React, { useState, useEffect, useMemo } from "react";
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

  const fetchFilteredData = async () => {
    const validDates =
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate);

    if (!validDates) {
      setChartData([]);
      setStats({
        totalVolume: 0,
        averageVolume: 0,
        maxVolume: 0,
        maxVolumeDay: null,
        minVolumeDays: [],
        dataAvailable: false,
      });
      return;
    }

    try {
      setLoading(true);
      const data = await obtenerCubicoFiltrado(startDate, endDate, agrupamiento);
      // Normalizamos nombres de campos:
      // - volumen: volumen_cubico_m3 (nuevo) o volumen_cubico (legacy)
      // - grosor: grosor_lateral_mm (nuevo) o grosor (legacy)
      const normalized = (Array.isArray(data) ? data : []).map((d) => ({
        fecha: d.fecha,
        volumen: Number(d.volumen_cubico_m3 ?? d.volumen_cubico ?? 0),
        grosor: d.grosor_lateral_mm ?? d.grosor ?? null,
      }));
      setChartData(normalized);
      calculateStats(normalized);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData([]);
      setStats({
        totalVolume: 0,
        averageVolume: 0,
        maxVolume: 0,
        maxVolumeDay: null,
        minVolumeDays: [],
        dataAvailable: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      setStats({
        totalVolume: 0,
        maxVolume: 0,
        maxVolumeDay: null,
        averageVolume: 0,
        minVolumeDays: [],
        dataAvailable: false,
      });
      return;
    }

    // Agrupamos el volumen por fecha (la API ya devuelve por fecha,
    // pero consolidamos por si vienen varias filas por grosor en el mismo día)
    const volumeByDate = new Map();
    for (const item of data) {
      if (!item || !item.fecha) continue;
      const f = item.fecha;
      const v = Number(item.volumen || 0);
      volumeByDate.set(f, (volumeByDate.get(f) || 0) + v);
    }

    const entries = Array.from(volumeByDate.entries()); // [ [fecha, volumen], ... ]
    if (entries.length === 0) {
      setStats({
        totalVolume: 0,
        maxVolume: 0,
        maxVolumeDay: null,
        averageVolume: 0,
        minVolumeDays: [],
        dataAvailable: false,
      });
      return;
    }

    const totalVolume = entries.reduce((acc, [, v]) => acc + v, 0);
    const averageVolume = totalVolume / entries.length;
    let maxVolume = -Infinity;
    let maxVolumeDay = null;
    for (const [f, v] of entries) {
      if (v > maxVolume) {
        maxVolume = v;
        maxVolumeDay = f;
      }
    }

    const numDaysToShow = entries.length > 10 ? 5 : 1;
    const minVolumeDays = entries
      .map(([f, v]) => ({ fecha: formatDateWithDay(f), volumen: v }))
      .sort((a, b) => a.volumen - b.volumen)
      .slice(0, numDaysToShow);

    setStats({
      totalVolume,
      averageVolume,
      maxVolume,
      maxVolumeDay,
      minVolumeDays,
      dataAvailable: true,
    });
  };

  const formatDateWithDay = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
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

  useEffect(() => {
    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, agrupamiento]);

  const setCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Domingo..6=Sábado
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);

    // Ajustar a lunes
    if (dayOfWeek === 0) {
      startOfWeek.setDate(now.getDate() - 6);
    } else {
      startOfWeek.setDate(now.getDate() - (dayOfWeek - 1));
    }
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setTime(startOfWeek.getTime());
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
    setAgrupamiento("dia");
  };

  const setCurrentMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
    setAgrupamiento("dia");
  };

  const setLastSixMonths = () => {
    const now = new Date();
    const startOfSixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(startOfSixMonthsAgo);
    setEndDate(endOfCurrentMonth);
    setAgrupamiento("mes");
  };

  const setCurrentYear = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    setStartDate(startOfYear);
    setEndDate(endOfYear);
    setAgrupamiento("mes");
  };

  const setTwoWeeksGroupedByDay = () => {
    const now = new Date();
    const startOfTwoWeeksAgo = new Date(now);
    startOfTwoWeeksAgo.setDate(now.getDate() - 18);
    startOfTwoWeeksAgo.setHours(0, 0, 0, 0);
    const endOfCurrentDay = new Date(now);
    endOfCurrentDay.setHours(23, 59, 59, 999);
    setStartDate(startOfTwoWeeksAgo);
    setEndDate(endOfCurrentDay);
    setAgrupamiento("dia");
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
    agrupamiento === "semana" ||
    agrupamiento === "mes";

  return (
    <div className="analisis-produccion-container">
      <h1>Análisis de Producción</h1>

      <form className="formulario-filtrado">
        <div className="fechas-container">
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
        </div>
        <select
          className="select-agrupamiento"
          value={agrupamiento}
          onChange={(e) => setAgrupamiento(e.target.value)}
        >
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
                  <li key={i}>
                    {day.fecha}: {day.volumen.toFixed(3)} m³
                  </li>
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
