<script setup>
import { computed } from 'vue'
import ChartCanvas from '../components/ChartCanvas.vue'
import { rows, points, model, prediction, predictX, xLabel, yLabel, addRow, removeRow, resetRows } from '../lib/store'
import { equation, fmt, mean, std, variance } from '../lib/regression'

const C = { sage: '#6E8B78', amber: '#D9A66B', midnight: '#202522', border: '#E7E5DF' }
const axis = (title) => ({ title: { display: true, text: title }, grid: { color: C.border }, border: { color: C.border } })
const base = (x, y) => ({
  responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } },
  scales: { x: axis(x), y: axis(y) },
})

const mainChart = computed(() => {
  const datasets = [{ label: 'Datos', data: points.value, backgroundColor: C.sage, borderColor: C.sage, pointRadius: 5 }]
  if (model.value) {
    const xs = points.value.map((p) => p.x)
    if (prediction.value) xs.push(prediction.value.x)
    const lo = Math.min(...xs), hi = Math.max(...xs)
    datasets.push({
      label: 'Recta de tendencia', showLine: true, pointRadius: 0, borderColor: C.midnight, borderWidth: 2,
      data: [lo, hi].map((x) => ({ x, y: model.value.b + model.value.m * x })),
    })
  }
  if (prediction.value) {
    datasets.push({
      label: 'Predicción', data: [prediction.value], pointRadius: 9, pointStyle: 'rectRot',
      backgroundColor: C.amber, borderColor: C.midnight, borderWidth: 2,
    })
  }
  return { type: 'scatter', data: { datasets }, options: base(xLabel, yLabel) }
})

// Gráficas por separado de x y de y (por número de dato), con su media
const seriesChart = (key, label, color, type) => {
  const vals = points.value.map((p) => p[key])
  const m = vals.length ? mean(vals) : 0
  return {
    type,
    data: {
      labels: vals.map((_, i) => i + 1),
      datasets: [
        { type, label, data: vals, backgroundColor: color, borderColor: color, borderRadius: 4, tension: 0.25 },
        { type: 'line', label: 'Media', data: vals.map(() => m), borderColor: C.midnight, borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0 },
      ],
    },
    options: base('Dato (n)', label),
  }
}
const xChart = computed(() => seriesChart('x', 'x', C.amber, 'bar'))
const yChart = computed(() => seriesChart('y', 'y', C.sage, 'line'))

const stat = (key) => {
  const v = points.value.map((p) => p[key])
  return v.length ? { mean: mean(v), std: std(v), variance: variance(v), min: Math.min(...v), max: Math.max(...v) } : null
}
const stats = computed(() => ({ x: stat('x'), y: stat('y') }))
const statRows = [['Media', 'mean'], ['Desviación estándar', 'std'], ['Varianza', 'variance'], ['Mínimo', 'min'], ['Máximo', 'max']]
</script>

<template>
  <div class="head">
    <h1>Dashboard de regresión lineal</h1>
    <p class="muted">Modifica los datos de la tabla y todo se recalcula al instante.</p>
  </div>

  <div class="grid kpis" style="margin-bottom: 18px">
    <div class="card kpi eq span-3">
      <div class="muted">Modelo obtenido</div>
      <div class="value">{{ model ? equation(model) : 'Faltan datos' }}</div>
    </div>
    <div class="card kpi span-3"><div class="muted">RMSE</div><div class="value">{{ model ? fmt(model.rmse) : '—' }}<span class="unit">s</span></div></div>
    <div class="card kpi span-3"><div class="muted">MAE</div><div class="value">{{ model ? fmt(model.mae) : '—' }}<span class="unit">s</span></div></div>
    <div class="card kpi span-3"><div class="muted">MAPE</div><div class="value">{{ model ? fmt(model.mape) : '—' }}<span class="unit">%</span></div></div>
  </div>

  <div class="grid">
    <section class="card span-8">
      <h2>Datos y recta de tendencia</h2>
      <p class="card-sub">Puntos reales, recta de mínimos cuadrados y el punto que predices.</p>
      <ChartCanvas :config="mainChart" />
    </section>

    <section class="card span-4">
      <h2>Predicción</h2>
      <p class="card-sub">Escribe un valor de x para evaluarlo en la recta.</p>
      <label class="muted" for="px">{{ xLabel }}</label>
      <input id="px" type="number" step="any" v-model.number="predictX" />
      <div class="result">
        <div class="muted">ŷ estimada</div>
        <div class="value">{{ prediction ? fmt(prediction.y, 3) : '—' }}<span class="unit"> s</span></div>
      </div>
      <p v-if="model" class="muted" style="margin-top: 12px">R² = {{ fmt(model.r2) }}: la edad del neumático explica {{ fmt(model.r2 * 100, 1) }}% de la variación del tiempo.</p>
    </section>

    <section class="card span-4">
      <h2>Variable x</h2>
      <p class="card-sub">{{ xLabel }}</p>
      <ChartCanvas :config="xChart" />
    </section>
    <section class="card span-4">
      <h2>Variable y</h2>
      <p class="card-sub">{{ yLabel }}</p>
      <ChartCanvas :config="yChart" />
    </section>
    <section class="card span-4">
      <h2>Estadísticas generales</h2>
      <p class="card-sub">Varianza y desviación poblacionales (÷ n).</p>
      <table v-if="stats.x">
        <thead><tr><th></th><th>x</th><th>y</th></tr></thead>
        <tbody>
          <tr v-for="[label, k] in statRows" :key="k"><td>{{ label }}</td><td>{{ fmt(stats.x[k]) }}</td><td>{{ fmt(stats.y[k]) }}</td></tr>
        </tbody>
      </table>
      <p v-else class="empty">Agrega datos para ver las estadísticas.</p>
    </section>

    <section class="card span-12">
      <h2>Captura de datos</h2>
      <p class="card-sub">Por defecto aparecen los datos de la práctica 7. Las filas incompletas se ignoran.</p>
      <div class="scroll">
        <table>
          <thead><tr><th>n</th><th>x · {{ xLabel }}</th><th>y · {{ yLabel }}</th><th></th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in rows" :key="r.id">
              <td>{{ i + 1 }}</td>
              <td><input type="number" step="any" v-model.number="r.x" :aria-label="`x del dato ${i + 1}`" /></td>
              <td><input type="number" step="any" v-model.number="r.y" :aria-label="`y del dato ${i + 1}`" /></td>
              <td><button class="btn icon" @click="removeRow(r.id)" :aria-label="`Eliminar dato ${i + 1}`">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions">
        <button class="btn primary" @click="addRow">Agregar dato</button>
        <button class="btn" @click="resetRows">Restablecer práctica 7</button>
      </div>
    </section>
  </div>
</template>
