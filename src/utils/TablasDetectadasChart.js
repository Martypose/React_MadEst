import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "../assets/css/chartproduccion.css"; // Importa el nuevo archivo CSS

Chart.register(...registerables);

function TablasDetectadasChart({ data, agrupamiento }) {
  const [chartData, setChartData] = useState(null);
  const colors = [
    "rgba(75,192,192,0.6)",
    "rgba(255,99,132,0.6)",
    "rgba(54,162,235,0.6)",
    "rgba(255,206,86,0.6)",
    "rgba(153,102,255,0.6)",
  ];

  useEffect(() => {
    if (data) {
      const labels = Array.from(
        new Set(data.map((item) => formatLabel(item.fecha)))
      );
      const grosorData = {};

      data.forEach((item) => {
        if (!grosorData[item.grosor]) {
          grosorData[item.grosor] = labels.map(() => 0);
        }
        const index = labels.indexOf(formatLabel(item.fecha));
        grosorData[item.grosor][index] += item.volumen_cubico;
      });

      const datasets = Object.keys(grosorData).map((grosor, index) => ({
        label: `Grosor ${grosor} mm`,
        data: grosorData[grosor],
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace("0.6", "1"),
        borderWidth: 1,
      }));

      // Cálculo de los volúmenes totales y la media
      const totalVolumes = labels.map((_, index) => {
        return Object.keys(grosorData).reduce((sum, grosor) => {
          return sum + grosorData[grosor][index];
        }, 0);
      });
      const averageVolume =
        totalVolumes.reduce((sum, vol) => sum + vol, 0) / totalVolumes.length;

      datasets.push({
        label: "Media",
        data: Array(labels.length).fill(averageVolume),
        borderColor: "rgba(255,0,0,1)",
        borderWidth: 2,
        type: "line",
        fill: false,
        pointRadius: 0,
        borderDash: [10, 5],
      });

      setChartData({
        labels: labels,
        datasets: datasets,
        totalVolumes: totalVolumes, // Guardamos los volúmenes totales para los tooltips
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
          title: function (context) {
            return context[0].label;
          },
          beforeBody: function (context) {
            const index = context[0].dataIndex;
            const totalVolume = chartData.totalVolumes[index];
            return `Total: ${totalVolume.toFixed(2)} m³`;
          },
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += `${context.raw.toFixed(2)} m³`;
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
        stacked: true,
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
        stacked: true,
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
  };

  return (
    <div className="chart-container">
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}

export default TablasDetectadasChart;
