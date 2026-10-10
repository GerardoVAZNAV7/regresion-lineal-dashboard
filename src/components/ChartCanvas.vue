<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
Chart.defaults.font.family = "'Inter', system-ui, sans-serif"
Chart.defaults.color = 'rgba(32, 37, 34, 0.62)'

const props = defineProps({ config: { type: Object, required: true } })
const canvas = ref(null)
let chart = null
const draw = () => {
  chart?.destroy()
  chart = new Chart(canvas.value, props.config)
}
onMounted(draw)
watch(() => props.config, draw)
onBeforeUnmount(() => chart?.destroy())
</script>

<template><div class="chart-box"><canvas ref="canvas"></canvas></div></template>
