import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "../assets/css/chartproduccion.css";

Chart.register(...registerables);

// Color estable por “clave” (grosor) usando HSL
const colorForKey = (key) => {
  if (key === "Total") return "rgba(75,192,192,0.6)";
  let h = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return `hsla(${h}, 65%, 55%, 0.6)`;
};

function TablasDetectadasChart({ data = [], agrupamiento }) {
  // Normalizamos datos: {fecha, volumen, grosor?}
  const normalized = useMemo(() => {
    return (Array.isArray(data) ? data : []).map((d) => ({
      fecha: d.fecha,
      volumen: Number(d.volumen ?? d.volumen_cubico_m3 ?? d.volumen_cubico ?? 0),
      grosor: d.grosor ?? d.grosor_lateral_mm ?? null,
    }));
  }, [data]);

  const formatLabel = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    if (agrupamiento === "dia") {
      const dayName = d.toLocaleDateString("es-ES", { weekday: "long" });
      const dateString = d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return `${dayName}\n${dateString}`;
    } else if (agrupamiento === "mes") {
      const monthName = d.toLocaleDateString("es-ES", { month: "long" });
      const year = d.getFullYear();
      return `${monthName} ${year}`;
    }
    // minuto/hora/semana → tal cual
    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  const { labels, datasets, totalVolumes } = useMemo(() => {
    const labelsSet = new Set(normalized.map((r) => formatLabel(r.fecha)));
    const labels = Array.from(labelsSet);

    const hasThickness = normalized.some((r) => r.grosor !== null && r.grosor !== undefined);

    const buckets = {}; // key → array aligned with labels
    if (hasThickness) {
      for (const r of normalized) {
        const key = String(r.grosor);
        if (!buckets[key]) buckets[key] = new Array(labels.length).fill(0);
        const idx = labels.indexOf(formatLabel(r.fecha));
        if (idx >= 0) buckets[key][idx] += r.volumen;
      }
    } else {
      const key = "Total";
      buckets[key] = new Array(labels.length).fill(0);
      for (const r of normalized) {
        const idx = labels.indexOf(formatLabel(r.fecha));
        if (idx >= 0) buckets[key][idx] += r.volumen;
      }
    }

    const datasets = Object.keys(buckets).map((key) => ({
      label: key === "Total" ? "Total" : `Grosor ${key} mm`,
      data: buckets[key],
      backgroundColor: colorForKey(key),
      borderColor: colorForKey(key).replace("0.6", "1"),
      borderWidth: 1,
      stack: "volumen",
    }));

    const totalVolumes = labels.map((_, i) =>
      Object.values(buckets).reduce((acc, arr) => acc + (arr[i] || 0), 0)
    );

    // línea de media
    const averageVolume =
      totalVolumes.length ? totalVolumes.reduce((a, b) => a + b, 0) / totalVolumes.length : 0;

    datasets.push({
      label: "Media",
      data: new Array(labels.length).fill(averageVolume),
      borderColor: "rgba(255,0,0,1)",
      borderWidth: 2,
      type: "line",
      fill: false,
      pointRadius: 0,
      borderDash: [10, 5],
    });

    return { labels, datasets, totalVolumes };
  }, [normalized, agrupamiento]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: (ctx) => ctx[0]?.label ?? "",
          beforeBody: (ctx) => {
            const index = ctx[0]?.dataIndex ?? 0;
            const total = (totalVolumes?.[index] ?? 0).toFixed(2);
            return `Total: ${total} m³`;
          },
          label: (context) => {
            const v = Number(context.raw ?? 0).toFixed(2);
            return `${context.dataset.label}: ${v} m³`;
          },
        },
      },
      legend: {
        labels: { font: { size: 16 } },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false, borderColor: "rgba(0,0,0,1)" },
        ticks: {
          color: "rgba(0,0,0,1)",
          font: { size: 14 },
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return String(label).split("\n");
          },
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Volumen (m³)",
          color: "rgba(0,0,0,1)",
          font: { size: 16 },
        },
        grid: { color: "rgba(0,0,0,0.1)", borderColor: "rgba(0,0,0,1)" },
        ticks: { color: "rgba(0,0,0,1)", font: { size: 14 } },
      },
    },
  };

  const chartData = useMemo(() => {
    return labels?.length ? { labels, datasets, totalVolumes } : null;
  }, [labels, datasets, totalVolumes]);

  return (
    <div className="chart-container">
      {chartData ? <Bar data={chartData} options={options} /> : <p>No hay datos.</p>}
    </div>
  );
}

export default TablasDetectadasChart;
