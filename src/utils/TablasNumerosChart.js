import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { DetalleMedidasTabla } from "../utils/detalleMedidasTabla";

Chart.register(...registerables);

function TablasNumerosChart({ data = [] }) {
  const [chartData, setChartData] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const lastHoveredDataRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgba(${red}, ${green}, ${blue}, 0.6)`;
  };

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      setChartData(null);
      return;
    }
    const labels = [];
    const datasets = [];
    const dataByMeasure = {};

    data.forEach((item) => {
      if (!dataByMeasure[item.medida_id]) dataByMeasure[item.medida_id] = [];
      dataByMeasure[item.medida_id].push(item);
      if (!labels.includes(item.fecha)) labels.push(item.fecha);
    });

    Object.keys(dataByMeasure).forEach((measureId) => {
      const firstItem = dataByMeasure[measureId][0];
      const ancho = firstItem.ancho;
      const altura = firstItem.altura;
      const label = `${ancho}cm x ${altura}cm`;
      const color = generateRandomColor();

      datasets.push({
        label,
        data: dataByMeasure[measureId].map((item) => item.num_tablas),
        borderColor: color,
        borderWidth: 2,
        fill: false,
        hidden: true,
      });
    });

    setChartData({ labels, datasets });
  }, [data]);

  const options = {
    maintainAspectRatio: false,
    aspectRatio: 2,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label ? `${context.dataset.label}: ` : "";
            return `${label}${context.parsed.y} piezas`;
          },
        },
        enabled: false,
        external: (context) => {
          const tooltip = context.tooltip;
          if (tooltip && tooltip.dataPoints && tooltip.dataPoints.length > 0) {
            setIsHovering(true);
            const label = tooltip.dataPoints[0].label;
            const newHoveredData = {
              label,
              data: data.filter((item) => item.fecha === label),
            };
            if (JSON.stringify(lastHoveredDataRef.current) !== JSON.stringify(newHoveredData)) {
              setHoveredData(newHoveredData);
              lastHoveredDataRef.current = newHoveredData;
            }
          } else if (lastHoveredDataRef.current) {
            setIsHovering(false);
            setHoveredData(null);
            lastHoveredDataRef.current = null;
          }
        },
      },
      legend: {
        labels: {
          filter: (item) => !item.text.includes("hide"),
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Número de piezas" },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: "100vh" }}>
      {chartData?.labels?.length ? <Line data={chartData} options={options} /> : <p>No hay datos.</p>}
      {isHovering && hoveredData && <DetalleMedidasTabla data={hoveredData.data} />}
    </div>
  );
}

export default TablasNumerosChart;
