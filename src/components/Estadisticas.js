import React, { useState, useEffect } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerEstadisticas } from "../services/estadisticasDetectadasService";

function Estadisticas() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [estadisticas, setEstadisticas] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;

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
          registrosPorPagina,
          (paginaActual - 1) * registrosPorPagina
        );
        setEstadisticas(data.data);
        setTotalRegistros(data.total);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
      }
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, [startDate, endDate, paginaActual]);

  function formatDate(date) {
    const d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  }
  const totalPages = Math.ceil(totalRegistros / registrosPorPagina);

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
      <button
        onClick={() => setPaginaActual(paginaActual + 1)}
        disabled={paginaActual >= totalPages} // Deshabilitar si es la última página
      >
        Siguiente
      </button>
      <span>{`${paginaActual}/${totalPages}`}</span>
      <button
        onClick={() => setPaginaActual(paginaActual - 1)}
        disabled={paginaActual <= 1} // Deshabilitar si es la primera página
      >
        Anterior
      </button>
    </div>
  );
}

export default Estadisticas;
