import React, { useState, useEffect } from "react";
import TablasDetectadasChart from "../utils/TablasDetectadasChart";
import useDateForm from "../hooks/useDateForm";
import { obtenerCubicoFiltrado } from "../services/tablasDetectadasService";

function AnalisisProduccion() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [agrupamiento, setAgrupamiento] = useState("dia");
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({
    maxVolume: 0,
    averageVolume: 0,
    minVolumeDays: [],
    dataAvailable: false,
  });

  const fetchFilteredData = async () => {
    if (
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate)
    ) {
      try {
        const data = await obtenerCubicoFiltrado(
          startDate,
          endDate,
          agrupamiento
        );
        setChartData(data);
        if (
          (agrupamiento === "dia" &&
            getDifferenceInDays(startDate, endDate) <= 365) ||
          agrupamiento === "semana" ||
          agrupamiento === "mes"
        ) {
          calculateStats(data);
        } else {
          setStats({
            maxVolume: 0,
            averageVolume: 0,
            minVolumeDays: [],
            dataAvailable: false,
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setStats({
          maxVolume: 0,
          averageVolume: 0,
          minVolumeDays: [],
          dataAvailable: false,
        });
      }
    } else {
      console.log(
        "Ambas fechas deben estar seleccionadas y ser válidas para filtrar los datos"
      );
      setStats({
        maxVolume: 0,
        averageVolume: 0,
        minVolumeDays: [],
        dataAvailable: false,
      });
    }
  };

  const calculateStats = (data) => {
    if (data && data.length > 0) {
      const validData = data.filter((item) => item.volumen_cubico > 0);

      if (validData.length === 0) {
        setStats({
          maxVolume: 0,
          averageVolume: 0,
          minVolumeDays: [],
          dataAvailable: false,
        });
        return;
      }

      // Agrupar los volúmenes por fecha
      const volumeByDate = {};
      validData.forEach((item) => {
        if (!volumeByDate[item.fecha]) {
          volumeByDate[item.fecha] = 0;
        }
        volumeByDate[item.fecha] += item.volumen_cubico;
      });

      const volumes = Object.values(volumeByDate);
      const totalVolume = volumes.reduce((acc, curr) => acc + curr, 0);
      const averageVolume = totalVolume / volumes.length;
      const maxVolume = Math.max(...volumes);

      const numDaysToShow = volumes.length > 10 ? 5 : 1;
      const minVolumeDays = Object.keys(volumeByDate)
        .map((fecha) => ({
          fecha: formatDateWithDay(fecha),
          volumen_cubico: volumeByDate[fecha],
        }))
        .sort((a, b) => a.volumen_cubico - b.volumen_cubico)
        .slice(0, numDaysToShow);

      setStats({
        maxVolume,
        averageVolume,
        minVolumeDays,
        dataAvailable: true,
      });
    } else {
      setStats({
        maxVolume: 0,
        averageVolume: 0,
        minVolumeDays: [],
        dataAvailable: false,
      });
    }
  };

  const formatDateWithDay = (date) => {
    const d = new Date(date),
      days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
      dayName = days[d.getDay()],
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return `${dayName}, ${day}/${month}/${year}`;
  };

  const getDifferenceInDays = (startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    fetchFilteredData();
  }, [startDate, endDate, agrupamiento]);

  function formatDate(date) {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  }

  const setCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);

    // Adjust to Monday (1)
    if (dayOfWeek === 0) {
      startOfWeek.setDate(now.getDate() - 6);
    } else {
      startOfWeek.setDate(now.getDate() - dayOfWeek);
    }

    endOfWeek.setDate(startOfWeek.getDate() + 6);
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
    const startOfSixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 6,
      1
    );
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );
    setStartDate(startOfSixMonthsAgo);
    setEndDate(endOfCurrentMonth);
    setAgrupamiento("mes");
  };

  const setCurrentYear = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    setStartDate(startOfYear);
    setEndDate(endOfYear);
    setAgrupamiento("mes");
  };

  const setTwoWeeksGroupedByDay = () => {
    const now = new Date();
    const startOfTwoWeeksAgo = new Date(now);
    startOfTwoWeeksAgo.setDate(now.getDate() - 18);
    const endOfCurrentDay = new Date(now);
    setStartDate(startOfTwoWeeksAgo);
    setEndDate(endOfCurrentDay);
    setAgrupamiento("dia");
  };

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
        <button className="btnbuscador" onClick={setCurrentWeek}>
          Semana actual
        </button>
        <button className="btnbuscador" onClick={setTwoWeeksGroupedByDay}>
          Dos semanas
        </button>
        <button className="btnbuscador" onClick={setCurrentMonth}>
          Mes actual
        </button>
        <button className="btnbuscador" onClick={setLastSixMonths}>
          Últimos 6 meses
        </button>
        <button className="btnbuscador" onClick={setCurrentYear}>
          Año actual
        </button>
      </div>

      {(agrupamiento === "dia" &&
        getDifferenceInDays(startDate, endDate) <= 365) ||
      agrupamiento === "semana" ||
      agrupamiento === "mes" ? (
        stats.dataAvailable && (
          <div className="estadisticas-container">
            <p>Máximo: {stats.maxVolume.toFixed(3)} m³</p>
            <p>Media: {stats.averageVolume.toFixed(3)} m³</p>
            {agrupamiento === "dia" && (
              <>
                <p>Días menos productivos:</p>
                <ul>
                  {stats.minVolumeDays.map((day, index) => (
                    <li key={index}>
                      {day.fecha}: {day.volumen_cubico.toFixed(3)} m³
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )
      ) : (
        <p>
          No se pueden calcular las estadísticas para el rango de fechas
          seleccionado.
        </p>
      )}

      <TablasDetectadasChart data={chartData} agrupamiento={agrupamiento} />
    </div>
  );
}

export default AnalisisProduccion;
