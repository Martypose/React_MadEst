import React, { useEffect, useMemo, useState } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerPiezas } from "../services/tablasDetectadasService";

function fmt(n, d=2) { const v = Number(n); return Number.isFinite(v) ? v.toFixed(d) : "—"; }
function fmtLocal(s) { return s || "—"; }

export default function TablasNumeros() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [orderBy, setOrderBy] = useState("fecha");
  const [orderDir, setOrderDir] = useState("desc");
  const [limit, setLimit] = useState(200);
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) return;
      try {
        setLoading(true);
        const resp = await obtenerPiezas(startDate, endDate, { limit, offset, orderBy, orderDir });
        setRows(resp?.data ?? []);
        setTotal(resp?.total ?? 0);
      } catch (e) {
        console.error(e); setRows([]); setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate, orderBy, orderDir, limit, offset]);

  const stats = useMemo(() => {
    const n = rows.length || 0;
    const meanW = n ? rows.reduce((a,r)=>a+(Number(r.ancho_mm)||0),0)/n : 0;
    const meanT = n ? rows.reduce((a,r)=>a+(Number(r.grosor_mm)||0),0)/n : 0;
    return { n, meanW, meanT };
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const currentPage = Math.floor(offset / Math.max(1, limit)) + 1;

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const m = String(date.getMonth()+1).padStart(2,"0");
    const d = String(date.getDate()).padStart(2,"0");
    return [date.getFullYear(), m, d].join("-");
  };

  return (
    <div className="analisis-produccion-container">
      <h1>Piezas por fecha (mm reales)</h1>

      <form className="formulario-filtrado" style={{gap:12}}>
        <div className="fechas-container">
          <input type="date" value={formatDate(startDate)} onChange={(e)=>setStartDate(new Date(e.target.value))}/>
          <input type="date" value={formatDate(endDate)}   onChange={(e)=>setEndDate(new Date(e.target.value))}/>
        </div>

        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <label>Orden</label>
          <select value={orderBy} onChange={(e)=>setOrderBy(e.target.value)}>
            <option value="fecha">Fecha</option>
            <option value="ancho_mm">Ancho</option>
            <option value="grosor_mm">Grosor</option>
            <option value="id">ID</option>
          </select>
          <select value={orderDir} onChange={(e)=>setOrderDir(e.target.value)}>
            <option value="desc">↓</option>
            <option value="asc">↑</option>
          </select>
          <label>Límite</label>
          <input type="number" min={50} max={2000} value={limit} onChange={(e)=>{ setLimit(Number(e.target.value)||200); setOffset(0); }}/>
        </div>
      </form>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          <div className="estadisticas-container" style={{display:"flex",gap:24}}>
            <p>Mostradas: {stats.n} / {total}</p>
            <p>Ancho medio: {fmt(stats.meanW)} mm</p>
            <p>Grosor medio: {fmt(stats.meanT)} mm</p>
          </div>

          <div style={{overflowX:"auto"}}>
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th>Fecha (local)</th>
                  <th>Ancho (mm)</th>
                  <th>Grosor (mm)</th>
                  <th>Corr.</th>
                  <th>Δcorr (mm)</th>
                  <th>mm/px</th>
                  <th>px μ / σ</th>
                  <th>rows</th>
                  <th>xl / xr (px)</th>
                  <th>edge_left (mm)</th>
                  <th>tabla#frame</th>
                  <th>equipo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{fmtLocal(r.fecha_local)}</td>
                    <td>{fmt(r.ancho_mm)}</td>
                    <td>{fmt(r.grosor_mm)}</td>
                    <td>{r.corregida ? "sí" : "no"}</td>
                    <td>{fmt(r.delta_corr_mm)}</td>
                    <td>{fmt(r.mm_por_px,3)}</td>
                    <td>{fmt(r.ancho_px_mean,1)} / {fmt(r.ancho_px_std,1)}</td>
                    <td>{r.rows_valid ?? "—"}</td>
                    <td>{(r.xl_px??"—")+" / "+(r.xr_px??"—")}</td>
                    <td>{fmt(r.edge_left_mm,1)}</td>
                    <td>{(r.tabla_id??"-") + "#" + (r.frame??"-")}</td>
                    <td>{r.device_id ?? r.camara_id ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="paginador" style={{display:"flex",gap:12,alignItems:"center",marginTop:12}}>
            <button onClick={()=>setOffset(o => Math.max(0, o - limit))} disabled={currentPage<=1}>Anterior</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={()=>setOffset(o => (o + limit < total ? o + limit : o))} disabled={currentPage>=totalPages}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}
