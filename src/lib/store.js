import { ref, computed } from 'vue'
import { fit, predict } from './regression'

// Datos por defecto: práctica 7 (Kimi Antonelli, GP de Barcelona 2026, neumático medio)
const DEFAULTS = [
  [2, 82.042], [3, 82.12], [4, 82.271], [5, 82.448], [6, 82.992], [7, 83.088],
  [8, 83.757], [9, 83.56], [10, 83.882], [11, 83.586], [12, 83.367], [13, 83.56],
]
let uid = 1
export const rows = ref(DEFAULTS.map(([x, y]) => ({ id: uid++, x, y })))
export const xLabel = 'Edad del neumático (vueltas)'
export const yLabel = 'Tiempo por vuelta (s)'
export const predictX = ref(14)

export const addRow = () => rows.value.push({ id: uid++, x: '', y: '' })
export const removeRow = (id) => (rows.value = rows.value.filter((r) => r.id !== id))
export const resetRows = () => (rows.value = DEFAULTS.map(([x, y]) => ({ id: uid++, x, y })))

export const points = computed(() =>
  rows.value.filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y)).map((r) => ({ x: r.x, y: r.y }))
)
export const model = computed(() => fit(points.value))
export const prediction = computed(() =>
  model.value && Number.isFinite(predictX.value)
    ? { x: predictX.value, y: predict(model.value, predictX.value) }
    : null
)
