import React, { useEffect, useState } from "react";
import { obtenerUltimasMedidas } from "../services/tablasDetectadasService";

function fmt(n, d=2) { const v = Number(n); return Number.isFinite(v) ? v.toFixed(d) : "—"; }

export default function TablasNumeros() {
  const [limit, setLimit] = useState(500);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await obtenerUltimasMedidas(limit);
        setRows(data);
      } catch (e) {
        console.error(e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  const total = rows.length;
  const mediaAncho  = total ? rows.reduce((a,r)=>a+(Number(r.ancho_mm)||0),0)/total : 0;
  const mediaGrosor = total ? rows.reduce((a,r)=>a+(Number(r.grosor_lateral_mm||r.grosor_mm)||0),0)/total : 0;

  return (
    <div className="analisis-produccion-container">
      <h1>Piezas recientes (mm reales)</h1>

      <div className="formulario-filtrado" style={{display:"flex",gap:12,alignItems:"center"}}>
        <label>Mostrar últimas</label>
        <input type="number" min={10} max={1000} value={limit}
               onChange={(e)=>setLimit(e.target.value)} />
        <span className="muted">piezas</span>
      </div>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          <div className="estadisticas-container" style={{display:"flex",gap:24}}>
            <p>Total: {total}</p>
            <p>Ancho medio: {fmt(mediaAncho)} mm</p>
            <p>Grosor medio: {fmt(mediaGrosor)} mm</p>
          </div>

          <div style={{overflowX:"auto"}}>
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th>Fecha (UTC)</th>
                  <th>Ancho (mm)</th>
                  <th>Grosor (mm)</th>
                  <th>Corr.</th>
                  <th>Δcorr (mm)</th>
                  <th>mm/px</th>
                  <th>px σ</th>
                  <th>rows</th>
                  <th>xl / xr (px)</th>
                  <th>edge_left (mm)</th>
                  <th>tabla#frame</th>
                  <th>dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.fecha ?? "—"}</td>
                    <td>{fmt(r.ancho_mm)}</td>
                    <td>{fmt(r.grosor_lateral_mm ?? r.grosor_mm)}</td>
                    <td>{r.corregida ? "sí" : "no"}</td>
                    <td>{fmt(r.delta_corr_mm)}</td>
                    <td>{fmt(r.mm_por_px,3)}</td>
                    <td>{fmt(r.ancho_px_std,1)}</td>
                    <td>{r.rows_valid ?? "—"}</td>
                    <td>{(r.xl_px??"—") + " / " + (r.xr_px??"—")}</td>
                    <td>{fmt(r.edge_left_mm,1)}</td>
                    <td>{(r.tabla_id??"-") + "#" + (r.frame??"-")}</td>
                    <td>{r.device_id ?? r.camara_id ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
