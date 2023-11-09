import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { DetalleMedidasTabla } from "../utils/detalleMedidasTabla";

Chart.register(...registerables);

function TablasNumerosChart({ data }) {
  const [chartData, setChartData] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const lastHoveredDataRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const chartRef = useRef(null);

  // Función para generar un color aleatorio en formato RGBA
  const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgba(${red}, ${green}, ${blue}, 0.6)`;
  };

  useEffect(() => {
    if (data && data.length > 0) {
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
        const color = generateRandomColor();

        datasets.push({
          label: label,
          data: dataByMeasure[measureId].map((item) => item.num_tablas),
          borderColor: color,
          borderWidth: 2,
          fill: false,
          hidden: true,
        });
      });

      setChartData({ labels, datasets });
    }
  }, [data]);

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
            label += `${context.parsed.y} piezas`;
            return label;
          },
        },
        enabled: false, // Deshabilita el tooltip por defecto
        external: function (context) {
          const tooltip = context.tooltip;
          if (tooltip.dataPoints.length > 0) {
            setIsHovering(true);
            const label = tooltip.dataPoints[0].label;
            const newHoveredData = {
              label: label,
              data: data.filter((item) => item.fecha === label),
            };

            if (
              JSON.stringify(lastHoveredDataRef.current) !==
              JSON.stringify(newHoveredData)
            ) {
              setHoveredData(newHoveredData);
              console.log("entro hover");
              lastHoveredDataRef.current = newHoveredData;
            }
          } else {
            // Aquí es donde detectamos que no hay hover y ocultamos la tabla
            if (lastHoveredDataRef.current) {
              setIsHovering(false);
              setHoveredData(null);
              lastHoveredDataRef.current = null;
              console.log("salgo");
            }
          }
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
    <div className="chart-container" style={{ height: "50vh" }}>
      {chartData && chartData.labels && chartData.labels.length > 0 && (
        <Line data={chartData} options={options} />
      )}
      {isHovering && hoveredData && (
        <DetalleMedidasTabla data={hoveredData.data} />
      )}
    </div>
  );
}

export default TablasNumerosChart;
