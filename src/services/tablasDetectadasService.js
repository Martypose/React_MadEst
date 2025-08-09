import React, { useMemo } from "react";
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

const toLocalYmdHms = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// "YYYY-ww" (ISO) → Date (lunes de esa semana)
const parseIsoWeek = (weekStr) => {
  const m = /^(\d{4})-(\d{1,2})$/.exec(String(weekStr));
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const week = parseInt(m[2], 10);
  const jan4 = new Date(Date.UTC(year, 0, 4));           // semana 1
  const dayOfWeek = jan4.getUTCDay() || 7;               // 1..7 (lun..dom)
  const mondayW1 = new Date(jan4);
  mondayW1.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1));
  const target = new Date(mondayW1);
  target.setUTCDate(mondayW1.getUTCDate() + (week - 1) * 7);
  return target;
};

// Devuelve { label, key } para ordenar y mostrar
const labelAndKey = (rawDate, agrupamiento) => {
  const s = String(rawDate);

  if (agrupamiento === "semana") {
    const d = parseIsoWeek(s); // 'YYYY-ww'
    const [year, ww] = s.split("-");
    const label = `Semana ${ww}\n${year}`;
    return { label, key: d ? d.getTime() : s };
  }

  const d = new Date(s);
  if (isNaN(d.getTime())) return { label: s, key: s };

  if (agrupamiento === "dia") {
    const dayName = d.toLocaleDateString("es-ES", { weekday: "long" });
    const dateString = d.toLocaleDateString("es-ES", { day: "numeric", month: "numeric", year: "numeric" });
    return { label: `${dayName}\n${dateString}`, key: d.getTime() };
  }

  if (agrupamiento === "mes") {
    const monthName = d.toLocaleDateString("es-ES", { month: "long" });
    const keyDate = new Date(d.getFullYear(), d.getMonth(), 1);
    return { label: `${monthName} ${d.getFullYear()}`, key: keyDate.getTime() };
  }

  // minuto / hora → mostrar timestamp local
  return { label: toLocalYmdHms(d), key: d.getTime() };
};

function TablasDetectadasChart({ data = [], agrupamiento = "dia" }) {
  // Normalizamos datos de backend a { fecha, volumen, grosor }
  const normalized = useMemo(() => {
    return (Array.isArray(data) ? data : []).map((d) => ({
      fecha: d.fecha,
      volumen: Number(d.volumen ?? d.volumen_cubico_m3 ?? d.volumen_cubico ?? 0),
      grosor: d.grosor ?? d.grosor_lateral_mm ?? null,
    }));
  }, [data]);

  const { labels, datasets, totalVolumes } = useMemo(() => {
    // 1) Labels únicos + clave temporal para orden correcto
    const labelKeyMap = new Map(); // label -> key (ms | string)
    for (const r of normalized) {
      const { label, key } = labelAndKey(r.fecha, agrupamiento);
      if (!labelKeyMap.has(label)) labelKeyMap.set(label, key);
    }

    const labels = Array.from(labelKeyMap.entries())
      .sort((a, b) => {
        const ka = a[1], kb = b[1];
        const na = Number(ka), nb = Number(kb);
        const bothNum = !Number.isNaN(na) && !Number.isNaN(nb);
        return bothNum ? na - nb : String(ka).localeCompare(String(kb));
      })
      .map(([label]) => label);

    const labelIndex = new Map(labels.map((lab, i) => [lab, i]));

    // 2) Buckets por grosor (si hay), si no 'Total'
    const hasThickness = normalized.some((r) => r.grosor !== null && r.grosor !== undefined);
    const buckets = {}; // key -> array aligned with labels

    for (const r of normalized) {
      const { label } = labelAndKey(r.fecha, agrupamiento);
      const idx = labelIndex.get(label);
      if (idx == null) continue;

      const k = hasThickness ? String(r.grosor) : "Total";
      if (!buckets[k]) buckets[k] = new Array(labels.length).fill(0);
      buckets[k][idx] += r.volumen || 0;
    }

    // 3) Construcción de datasets (ordenamos numéricamente por grosor si procede)
    const keys = Object.keys(buckets).sort((a, b) => {
      const na = parseFloat(a), nb = parseFloat(b);
      const numA = !Number.isNaN(na), numB = !Number.isNaN(nb);
      if (numA && numB) return na - nb;
      if (a === "Total") return -1;
      if (b === "Total") return 1;
      return a.localeCompare(b, "es");
    });

    const datasets = keys.map((key) => {
      const bg = colorForKey(key);
      const border = bg.replace("0.6", "1");
      return {
        label: key === "Total" ? "Total" : `Grosor ${key} mm`,
        data: buckets[key],
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1,
        stack: "volumen",
      };
    });

    // 4) Totales por etiqueta + línea de media
    const totalVolumes = labels.map((_, i) =>
      Object.values(buckets).reduce((acc, arr) => acc + (arr[i] || 0), 0)
    );

    const average = totalVolumes.length
      ? totalVolumes.reduce((a, b) => a + b, 0) / totalVolumes.length
      : 0;

    datasets.push({
      label: "Media",
      data: new Array(labels.length).fill(average),
      borderColor: "rgba(255,0,0,1)",
      borderWidth: 2,
      type: "line",
      fill: false,
      pointRadius: 0,
      borderDash: [10, 5],
      order: 0, // que la línea quede encima
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
      legend: { labels: { font: { size: 16 } } },
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
            // Soporta el salto de línea en 'día' y 'semana'
            return String(label).split("\n");
          },
        },
      },
      y: {
        stacked: true,
        title: { display: true, text: "Volumen (m³)", color: "rgba(0,0,0,1)", font: { size: 16 } },
        grid: { color: "rgba(0,0,0,0.1)", borderColor: "rgba(0,0,0,1)" },
        ticks: { color: "rgba(0,0,0,1)", font: { size: 14 } },
      },
    },
  };

  const chartData = useMemo(() => {
    return (labels && labels.length) ? { labels, datasets } : null;
  }, [labels, datasets]);

  return (
    <div className="chart-container">
      {chartData ? <Bar data={chartData} options={options} /> : <p>No hay datos.</p>}
    </div>
  );
}

export default TablasDetectadasChart;
