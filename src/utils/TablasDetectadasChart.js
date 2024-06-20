import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "../assets/css/chartproduccion.css"; // Importa el nuevo archivo CSS

Chart.register(...registerables);

function TablasDetectadasChart({ data, agrupamiento }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      console.log(data);
      const labels = data.map((item) => formatLabel(item.fecha));
      const volumes = data.map((item) => item.volumen_cubico);

      const totalVolume = volumes.reduce((acc, curr) => acc + curr, 0);
      const averageVolume = totalVolume / volumes.length;

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
          {
            label: "Media",
            data: Array(volumes.length).fill(averageVolume),
            borderColor: "rgba(255,0,0,1)",
            borderWidth: 2,
            type: "line",
            fill: false,
            pointRadius: 0,
            borderDash: [10, 5],
          },
        ],
      });
    }
  }, [data, agrupamiento]);

  const formatLabel = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date; // If date is invalid, return the original value

    if (agrupamiento === "dia") {
      const dayName = d.toLocaleDateString("es-ES", { weekday: "long" });
      const dateString = d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return `${dayName}\n${dateString}`;
    } else if (agrupamiento === "semana") {
      return ""; // No formatting for "semana"
    } else if (agrupamiento === "mes") {
      const monthName = d.toLocaleDateString("es-ES", { month: "long" });
      const year = d.getFullYear();
      return `${monthName} ${year}`;
    } else {
      return date;
    }
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
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
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: "rgba(0,0,0,1)",
        },
        ticks: {
          color: "rgba(0,0,0,1)",
          font: {
            size: 14,
          },
          callback: function (value, index, values) {
            const label = this.getLabelForValue(value);
            return label.split("\n");
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Volumen (m³)",
          color: "rgba(0,0,0,1)",
          font: {
            size: 16,
          },
        },
        grid: {
          color: "rgba(0,0,0,0.1)",
          borderColor: "rgba(0,0,0,1)",
        },
        ticks: {
          color: "rgba(0,0,0,1)",
          font: {
            size: 14,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0,
      },
    },
  };

  return (
    <div className="chart-container">
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}

export default TablasDetectadasChart;
