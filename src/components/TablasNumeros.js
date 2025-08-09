import React, { useState, useEffect } from "react";
import TablasNumerosChart from "../utils/TablasNumerosChart";
import useDateForm from "../hooks/useDateForm";
import { obtenerTablasPorMedidaYFecha } from "../services/tablasDetectadasService";

function TablasNumeros() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [agrupamiento, setAgrupamiento] = useState("dia");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFilteredData = async () => {
    const validDates =
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate);

    if (!validDates) {
      setChartData([]);
      return;
    }
    try {
      setLoading(true);
      const data = await obtenerTablasPorMedidaYFecha(startDate, endDate, agrupamiento);
      setChartData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, agrupamiento]);

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return [year, month, day].join("-");
  };

  return (
    <div className="analisis-produccion-container">
      <h1>Tablas por medida (Catálogo)</h1>

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

      {loading && <p>Cargando…</p>}
      <TablasNumerosChart data={chartData} />
    </div>
  );
}

export default TablasNumeros;
