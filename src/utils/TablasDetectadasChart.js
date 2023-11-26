import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function TablasDetectadasChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      console.log(data);
      // Extrae las fechas y los volúmenes cúbicos de los datos
      const labels = data.map((item) => item.fecha);
      const volumes = data.map((item) => item.volumen_cubico);

      // Configura los datos para el gráfico
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Total cúbico",
            data: volumes,
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 2,
          },
        ],
      });
    }
  }, [data]);

  const options = {
    maintainAspectRatio: false, // Ajusta a false para que el gráfico se adapte al contenedor
    responsive: true, // Asegura que el gráfico sea responsivo
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            label += `${context.parsed.y} m³`;
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Volumen (m³)",
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: "80vh" }}>
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}

export default TablasDetectadasChart;
