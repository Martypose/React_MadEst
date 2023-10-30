import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function TablasNumerosChart({ data }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      console.log(data);
      const labels = [];
      const datasets = [];

      const dataByMeasure = {};
      data.forEach((item) => {
        if (!dataByMeasure[item.medida_id]) {
          dataByMeasure[item.medida_id] = [];
        }
        dataByMeasure[item.medida_id].push(item);
        if (!labels.includes(item.fecha)) {
          labels.push(item.fecha);
        }
      });

      // Crear conjuntos de datos para cada medida
      Object.keys(dataByMeasure).forEach((measureId, index) => {
        const firstItem = dataByMeasure[measureId][0];
        console.log(firstItem);
        const ancho = firstItem.ancho;
        const altura = firstItem.altura;
        const label = `${ancho}cm x ${altura}cm`;

        const color = `rgba(${index * 20}, ${(index + 1) * 40}, ${
          (index + 2) * 60
        }, 0.6)`;
        datasets.push({
          label: label,
          data: dataByMeasure[measureId].map((item) => item.num_tablas),
          borderColor: color,
          borderWidth: 2,
          fill: false,
        });
      });

      setChartData({ labels, datasets });
    }
  }, [data]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            label += `${context.parsed.y} piezas`;
            return label;
          },
        },
      },
      legend: {
        labels: {
          filter: function (item, chart) {
            return !item.text.includes("hide");
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Número de piezas",
        },
      },
    },
  };

  return (
    <div className="chart-container">
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}

export default TablasNumerosChart;
