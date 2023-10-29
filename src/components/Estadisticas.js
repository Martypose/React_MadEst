import React, { useState, useEffect } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerEstadisticas } from "../services/estadisticasDetectadasService";

function Estadisticas() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [estadisticas, setEstadisticas] = useState(null);

  const fetchEstadisticas = async () => {
    if (
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate)
    ) {
      try {
        const data = await obtenerEstadisticas(
          startDate.toISOString(),
          endDate.toISOString(),
          10,
          0
        );
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
      }
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, [startDate, endDate]);

  function formatDate(date) {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  }

  return (
    <div>
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

      {estadisticas ? (
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
      ) : (
        "Cargando..."
      )}
    </div>
  );
}

export default Estadisticas;
