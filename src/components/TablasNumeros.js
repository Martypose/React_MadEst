import React, { useState, useEffect } from "react";
import TablasNumerosChart from "../utils/TablasNumerosChart";
import useDateForm from "../hooks/useDateForm";
import { obtenerTablasPorMedidaYFecha } from "../services/tablasDetectadasService";
import { DetalleMedidasTabla } from "../utils/detalleMedidasTabla";

function TablasNumeros() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [agrupamiento, setAgrupamiento] = useState("dia");
  const [chartData, setChartData] = useState([]);

  const fetchFilteredData = async () => {
    // Comprobar si ambas fechas están establecidas y son instancias válidas de Date
    if (
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate)
    ) {
      try {
        const data = await obtenerTablasPorMedidaYFecha(
          startDate,
          endDate,
          agrupamiento
        );
        setChartData(data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    } else {
      console.log(
        "Ambas fechas deben estar seleccionadas y ser válidas para filtrar los datos"
      );
    }
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

      <TablasNumerosChart data={chartData} />
    </div>
  );
}

export default TablasNumeros;
