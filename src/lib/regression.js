const sum = (a) => a.reduce((s, v) => s + v, 0)
export const mean = (a) => sum(a) / a.length
export const variance = (a) => {
  const m = mean(a)
  return sum(a.map((v) => (v - m) ** 2)) / a.length
}
export const std = (a) => Math.sqrt(variance(a))
export const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '—')

// Mínimos cuadrados ordinarios para y = b + m·x
export function fit(pts) {
  const n = pts.length
  if (n < 2) return null
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const sx = sum(xs), sy = sum(ys)
  const sxy = sum(pts.map((p) => p.x * p.y))
  const sxx = sum(xs.map((x) => x * x))
  const num = n * sxy - sx * sy
  const den = n * sxx - sx * sx
  if (den === 0) return null
  const m = num / den
  const meanX = sx / n, meanY = sy / n
  const b = meanY - m * meanX
  const rows = pts.map((p) => {
    const yhat = b + m * p.x
    const e = p.y - yhat
    return {
      x: p.x, y: p.y, xy: p.x * p.y, xx: p.x * p.x, yhat, e,
      e2: e * e, abs: Math.abs(e),
      pct: p.y !== 0 ? (Math.abs(e) / Math.abs(p.y)) * 100 : NaN,
    }
  })
  const sse = sum(rows.map((r) => r.e2))
  const sst = sum(ys.map((y) => (y - meanY) ** 2))
  return {
    n, sx, sy, sxy, sxx, num, den, m, b, meanX, meanY, rows, sse, sst,
    sumAbs: sum(rows.map((r) => r.abs)),
    sumPct: sum(rows.map((r) => r.pct)),
    mse: sse / n,
    rmse: Math.sqrt(sse / n),
    mae: sum(rows.map((r) => r.abs)) / n,
    mape: sum(rows.map((r) => r.pct)) / n,
    r2: sst === 0 ? NaN : 1 - sse / sst,
  }
}

export const predict = (model, x) => model.b + model.m * x
export const equation = (model, d = 4) =>
  `ŷ = ${fmt(model.b, d)} ${model.m < 0 ? '−' : '+'} ${fmt(Math.abs(model.m), d)}x`
