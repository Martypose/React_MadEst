// React_MadEst/src/components/TablasNumeros.js
import React, { useEffect, useMemo, useState } from "react";
import useDateForm from "../hooks/useDateForm";
import { obtenerPiezas } from "../services/tablasDetectadasService";

// Helpers de formato
const fmt = (n, d = 2) => {
  const v = Number(n);
  return Number.isFinite(v) ? v.toFixed(d) : "—";
};
const fmtInt = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v) : "—";
};
const fmtLocal = (s) => s || "—";
const pct = (x, d = 1) => {
  const v = Number(x);
  return Number.isFinite(v) ? `${(v * 100).toFixed(d)}%` : "—";
};

// ==== Causa unificada: 'none' | 'tip' | 'shape' | 'edge' | combinaciones '+'
function normalizeDescCausa(s, row) {
  if (typeof s === 'string' && s.trim()) {
    const z = s.toLowerCase().replace(/\|/g,'+').replace(/forma/g,'shape').replace(/borde?s?|irregular/g,'edge');
    const toks = Array.from(new Set(z.split(/[+,\s]+/).filter(Boolean)));
    const valid = toks.filter(t => ['none','tip','shape','edge'].includes(t));
    if (valid.length) {
      const dropNone = valid.includes('none') && valid.length>1 ? valid.filter(t=>t!=='none') : valid;
      const order = { tip:0, shape:1, edge:2, none:3 };
      return dropNone.sort((a,b)=>order[a]-order[b]).join('+');
    }
  }
  // fallback si no vino desc_causa: derivamos de campos
  const tipBad = (row?.desc_tip_ok === false);
  const shapeBad = (() => {
    const r  = Number(row?.desc_shape_taper_ratio);
    const a  = Number(row?.desc_shape_area_ratio);
    const dr = Number(row?.desc_shape_taper_drop);
    const tr = Number(row?.desc_shape_thr_ratio);
    const ta = Number(row?.desc_shape_thr_area);
    const td = Number(row?.desc_shape_thr_drop);
    if (![r,a,dr,tr,ta,td].every(Number.isFinite)) return false;
    return (r < tr && a < ta) || (dr > td);
  })();
  const edgeBad = row?.desc_edge_irregular === true;
  const toks = [];
  if (tipBad) toks.push('tip');
  if (shapeBad) toks.push('shape');
  if (edgeBad) toks.push('edge');
  return toks.length ? toks.join('+') : 'none';
}
function prettyCausa(c) {
  return c.split('+').map(t => (t === 'shape' ? 'FORMA' : t === 'edge' ? 'BORDE' : t.toUpperCase())).join('+');
}

function DescBadge({ row }) {
  const isDesc = !!(row.desc_final_descabezada ?? row.descabezada);
  const causaNorm = normalizeDescCausa(row.desc_causa, row);
  const cls = isDesc ? "chip chip-danger" : "chip chip-success";
  return <span className={cls}>{isDesc ? `DESC (${prettyCausa(causaNorm)})` : "OK"}</span>;
}

function Copyable({ text, label }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <code style={{ userSelect: "all" }}>{label ?? text}</code>
      <button type="button" className="btn-mini" onClick={doCopy} title="Copiar al portapapeles">
        {copied ? "Copiado" : "Copiar"}
      </button>
    </span>
  );
}

function RowDetails({ r }) {
  const hasTip = r.desc_tip_score != null || r.desc_tip_thr != null;
  const hasShape =
    r.desc_shape_taper_ratio != null ||
    r.desc_shape_taper_drop != null ||
    r.desc_shape_area_ratio != null ||
    r.desc_shape_slope_norm != null ||
    r.desc_shape_centroid_pct != null;
  const hasEdge =
    r.desc_edge_irregular != null ||
    r.edge_rmse_l_px != null || r.edge_rmse_r_px != null ||
    r.edge_jitter_l_px != null || r.edge_jitter_r_px != null ||
    r.widths_cv != null || r.rows_total != null || r.rows_kept != null;

  return (
    <div className="details">
      <div className="details-grid">
        <div>
          <h4>Identidad</h4>
          <p>
            UID:{" "}
            {r.tabla_uid ? (
              <Copyable text={r.tabla_uid} />
            ) : (
              <span className="muted">—</span>
            )}
          </p>
          <p>Tabla ID: <code>{fmtInt(r.tabla_id)}</code></p>
          <p>Equipo: <span className="chip">{r.device_id ?? r.camara_id ?? "—"}</span></p>
        </div>

        <div>
          <h4>Medida (px / mm)</h4>
          <p>px μ / σ: <b>{fmt(r.ancho_px_mean, 1)}</b> / {fmt(r.ancho_px_std, 1)}</p>
          <p>mm/px – px/mm: <b>{fmt(r.mm_por_px, 3)}</b> — {fmt(r.px_por_mm, 3)}</p>
          <p>Filas válidas: {r.rows_valid ?? "—"}</p>
          <p>xl / xr (px): {(r.xl_px ?? "—") + " / " + (r.xr_px ?? "—")}</p>
        </div>

        <div>
          <h4>Geometría ROI/BBox</h4>
          <p>bbox [x,y,w,h]: [{fmtInt(r.bbox_x)},{fmtInt(r.bbox_y)},{fmtInt(r.bbox_w)},{fmtInt(r.bbox_h)}]</p>
          <p>ROI y0–y1: [{fmtInt(r.roi_y0)}–{fmtInt(r.roi_y1)}]</p>
          <p>edge_left_mm: {fmt(r.edge_left_mm, 1)} mm</p>
        </div>

        {hasTip && (
          <div>
            <h4>Punta (TIP)</h4>
            <p>score: <b>{pct(r.desc_tip_score, 1)}</b> — thr: {pct(r.desc_tip_thr, 1)}</p>
            <p>OK: {r.desc_tip_ok === true ? "sí" : r.desc_tip_ok === false ? "no" : "—"}</p>
            <p>TIP ROI y0–y1: [{fmtInt(r.desc_tip_roi_y0)}–{fmtInt(r.desc_tip_roi_y1)}]</p>
          </div>
        )}

        {hasShape && (
          <div>
            <h4>Forma (flecha)</h4>
            <p>taper ratio (top/bot): <b>{fmt(r.desc_shape_taper_ratio, 2)}</b></p>
            <p>drop ((wb-wt)/wb): {fmt(r.desc_shape_taper_drop, 2)}</p>
            <p>area ratio (top/bot): {fmt(r.desc_shape_area_ratio, 2)}</p>
            <p>slope norm.: {fmt(r.desc_shape_slope_norm, 2)}</p>
            <p>centroid (%): {fmt(r.desc_shape_centroid_pct, 2)}</p>
          </div>
        )}

        {hasEdge && (
          <div>
            <h4>Borde (irregularidad)</h4>
            <p>irregular: {r.desc_edge_irregular === true ? "sí" : r.desc_edge_irregular === false ? "no" : "—"} {r.desc_edge_reason ? `(${r.desc_edge_reason})` : ""}</p>
            <p>RMSE L/R: {fmt(r.edge_rmse_l_px, 2)} / {fmt(r.edge_rmse_r_px, 2)} px</p>
            <p>Jitter L/R: {fmt(r.edge_jitter_l_px, 2)} / {fmt(r.edge_jitter_r_px, 2)} px</p>
            <p>CV anchos por fila: {fmt(r.widths_cv, 4)}</p>
            <p>Filas kept/total: {fmtInt(r.rows_kept)} / {fmtInt(r.rows_total)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TablasNumeros() {
  const { startDate, endDate, setStartDate, setEndDate } = useDateForm();
  const [orderBy, setOrderBy] = useState("fecha");
  const [orderDir, setOrderDir] = useState("desc");
  const [limit, setLimit] = useState(200);
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) return;
      try {
        setLoading(true);
        const resp = await obtenerPiezas(startDate, endDate, { limit, offset, orderBy, orderDir });
        setRows(Array.isArray(resp?.data) ? resp.data : []);
        setTotal(Number(resp?.total) || 0);
      } catch (e) {
        console.error(e);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate, orderBy, orderDir, limit, offset]);

  const stats = useMemo(() => {
    const n = rows.length || 0;
    const meanW = n ? rows.reduce((a, r) => a + (Number(r.ancho_mm) || 0), 0) / n : 0;
    const meanT = n ? rows.reduce((a, r) => a + (Number(r.grosor_mm) || 0), 0) / n : 0;
    const descN = rows.reduce((a, r) => a + ((r.desc_final_descabezada ?? r.descabezada) ? 1 : 0), 0);
    return { n, meanW, meanT, descN };
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const currentPage = Math.floor(offset / Math.max(1, limit)) + 1;

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return [date.getFullYear(), m, d].join("-");
  };

  return (
    <div className="analisis-produccion-container">
      <h1>Piezas por fecha (mm reales)</h1>

      <form className="formulario-filtrado" style={{ gap: 12 }}>
        <div className="fechas-container">
          <input type="date" value={formatDate(startDate)} onChange={(e) => setStartDate(new Date(e.target.value))} />
          <input type="date" value={formatDate(endDate)} onChange={(e) => setEndDate(new Date(e.target.value))} />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>Orden</label>
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="fecha">Fecha</option>
            <option value="ancho_mm">Ancho</option>
            <option value="grosor_mm">Grosor</option>
            <option value="id">ID</option>
          </select>
          <select value={orderDir} onChange={(e) => setOrderDir(e.target.value)}>
            <option value="desc">↓</option>
            <option value="asc">↑</option>
          </select>
          <label>Límite</label>
          <input
            type="number"
            min={50}
            max={2000}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value) || 200);
              setOffset(0);
            }}
          />
        </div>
      </form>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          <div className="estadisticas-container" style={{ display: "flex", gap: 24 }}>
            <p>Mostradas: {stats.n} / {total}</p>
            <p>Ancho medio: {fmt(stats.meanW)} mm</p>
            <p>Grosor medio: {fmt(stats.meanT)} mm</p>
            <p>Descabezadas: {stats.descN}</p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th>Fecha (local)</th>
                  <th>UID</th>
                  <th>Ancho (mm)</th>
                  <th>Grosor (mm)</th>
                  <th>Corr.</th>
                  <th>Δcorr (mm)</th>
                  <th>Descab</th>
                  <th>TIP % (thr)</th>
                  <th>mm/px</th>
                  <th>Equipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isExpanded = expanded === r.id;
                  return (
                    <React.Fragment key={r.id}>
                      <tr>
                        <td>{fmtLocal(r.fecha_local)}</td>
                        <td>
                          {r.tabla_uid ? (
                            <Copyable text={r.tabla_uid} label={(r.tabla_uid || "").slice(0, 10) + "…"} />
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                        <td>{fmt(r.ancho_mm)}</td>
                        <td>{fmt(r.grosor_mm)}</td>
                        <td>{r.corregida ? "sí" : "no"}</td>
                        <td>{fmt(r.delta_corr_mm)}</td>
                        <td><DescBadge row={r} /></td>
                        <td>
                          {pct(r.desc_tip_score, 1)}
                          {r.desc_tip_thr != null ? ` (${pct(r.desc_tip_thr, 0)})` : ""}
                        </td>
                        <td>{fmt(r.mm_por_px, 3)}</td>
                        <td>{r.device_id ?? r.camara_id ?? "—"}</td>
                        <td>
                          <button className="btn-mini" onClick={() => setExpanded((x) => (x === r.id ? null : r.id))}>
                            {isExpanded ? "Ocultar" : "Detalles"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="row-details">
                          <td colSpan={11}><RowDetails r={r} /></td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="paginador" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
            <button onClick={() => setOffset((o) => Math.max(0, o - limit))} disabled={currentPage <= 1}>Anterior</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={() => setOffset((o) => (o + limit < total ? o + limit : o))} disabled={currentPage >= totalPages}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}
