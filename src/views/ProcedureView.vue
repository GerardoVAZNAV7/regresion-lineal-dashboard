<script setup>
import { computed } from 'vue'
import { model, prediction } from '../lib/store'
import { equation, fmt, mean, variance, std } from '../lib/regression'
import { points } from '../lib/store'

const d = computed(() => model.value)
const xs = computed(() => points.value.map((p) => p.x))
const ys = computed(() => points.value.map((p) => p.y))
</script>

<template>
  <div class="head">
    <h1>Procedimiento paso a paso</h1>
    <p class="muted">Todos los cálculos con los datos que hay ahora mismo en el dashboard.</p>
  </div>

  <div v-if="!d" class="card empty">Necesitas al menos 2 datos con valores de x distintos. Vuelve al dashboard y captúralos.</div>

  <template v-else>
    <section class="step">
      <div class="step-n">1</div>
      <div class="card">
        <h2>Sumas necesarias</h2>
        <p class="card-sub">Para cada dato se calcula x·y y x². Después se suma cada columna.</p>
        <div class="scroll">
          <table>
            <thead><tr><th>n</th><th>x</th><th>y</th><th>x·y</th><th>x²</th></tr></thead>
            <tbody>
              <tr v-for="(r, i) in d.rows" :key="i"><td>{{ i + 1 }}</td><td>{{ fmt(r.x, 0) === fmt(r.x, 4) ? r.x : fmt(r.x) }}</td><td>{{ fmt(r.y, 3) }}</td><td>{{ fmt(r.xy, 3) }}</td><td>{{ fmt(r.xx, 3) }}</td></tr>
            </tbody>
            <tfoot><tr><td>Σ</td><td>{{ fmt(d.sx, 3) }}</td><td>{{ fmt(d.sy, 3) }}</td><td>{{ fmt(d.sxy, 3) }}</td><td>{{ fmt(d.sxx, 3) }}</td></tr></tfoot>
          </table>
        </div>
        <pre class="formula">n = {{ d.n }}</pre>
      </div>
    </section>

    <section class="step">
      <div class="step-n">2</div>
      <div class="card">
        <h2>Medias de x y de y</h2>
        <pre class="formula">x̄ = Σx / n = {{ fmt(d.sx, 3) }} / {{ d.n }} = {{ fmt(d.meanX) }}
ȳ = Σy / n = {{ fmt(d.sy, 3) }} / {{ d.n }} = {{ fmt(d.meanY) }}</pre>
      </div>
    </section>

    <section class="step">
      <div class="step-n">3</div>
      <div class="card">
        <h2>Pendiente (m)</h2>
        <pre class="formula">m = [ n·Σxy − Σx·Σy ] / [ n·Σx² − (Σx)² ]
m = [ {{ d.n }}·{{ fmt(d.sxy, 3) }} − {{ fmt(d.sx, 3) }}·{{ fmt(d.sy, 3) }} ] / [ {{ d.n }}·{{ fmt(d.sxx, 3) }} − ({{ fmt(d.sx, 3) }})² ]
m = {{ fmt(d.num, 3) }} / {{ fmt(d.den, 3) }}
m = {{ fmt(d.m, 5) }}</pre>
      </div>
    </section>

    <section class="step">
      <div class="step-n">4</div>
      <div class="card">
        <h2>Ordenada al origen (b)</h2>
        <pre class="formula">b = ȳ − m·x̄
b = {{ fmt(d.meanY) }} − ({{ fmt(d.m, 5) }})({{ fmt(d.meanX) }})
b = {{ fmt(d.b, 5) }}</pre>
      </div>
    </section>

    <section class="step">
      <div class="step-n">5</div>
      <div class="card">
        <h2>Ecuación de la recta</h2>
        <pre class="formula">{{ equation(d) }}</pre>
        <template v-if="prediction">
          <p class="card-sub" style="margin-top: 14px">Predicción para x = {{ prediction.x }}:</p>
          <pre class="formula" style="margin-top: 0">ŷ = {{ fmt(d.b) }} + ({{ fmt(d.m) }})({{ prediction.x }}) = {{ fmt(prediction.y, 4) }}</pre>
        </template>
      </div>
    </section>

    <section class="step">
      <div class="step-n">6</div>
      <div class="card">
        <h2>Errores del modelo</h2>
        <p class="card-sub">e = y − ŷ. Con el error se obtienen e², |e| y |e|/y en porcentaje.</p>
        <div class="scroll">
          <table>
            <thead><tr><th>n</th><th>x</th><th>y</th><th>ŷ</th><th>e</th><th>e²</th><th>|e|</th><th>|e|/y (%)</th></tr></thead>
            <tbody>
              <tr v-for="(r, i) in d.rows" :key="i">
                <td>{{ i + 1 }}</td><td>{{ r.x }}</td><td>{{ fmt(r.y, 3) }}</td><td>{{ fmt(r.yhat, 3) }}</td>
                <td>{{ fmt(r.e, 3) }}</td><td>{{ fmt(r.e2) }}</td><td>{{ fmt(r.abs, 3) }}</td><td>{{ fmt(r.pct, 3) }}</td>
              </tr>
            </tbody>
            <tfoot><tr><td>Σ</td><td></td><td></td><td></td><td></td><td>{{ fmt(d.sse) }}</td><td>{{ fmt(d.sumAbs, 3) }}</td><td>{{ fmt(d.sumPct, 3) }}</td></tr></tfoot>
          </table>
        </div>
      </div>
    </section>

    <section class="step">
      <div class="step-n">7</div>
      <div class="card">
        <h2>Métricas de evaluación</h2>
        <pre class="formula">MSE  = Σ(y − ŷ)² / n = {{ fmt(d.sse) }} / {{ d.n }} = {{ fmt(d.mse, 6) }}
RMSE = √MSE = √{{ fmt(d.mse, 6) }} = {{ fmt(d.rmse) }} s
MAE  = Σ|y − ŷ| / n = {{ fmt(d.sumAbs, 3) }} / {{ d.n }} = {{ fmt(d.mae) }} s
MAPE = Σ(|y − ŷ| / y · 100) / n = {{ fmt(d.sumPct, 3) }} / {{ d.n }} = {{ fmt(d.mape) }} %
R²   = 1 − Σ(y − ŷ)² / Σ(y − ȳ)² = 1 − {{ fmt(d.sse) }} / {{ fmt(d.sst) }} = {{ fmt(d.r2) }}</pre>
      </div>
    </section>

    <section class="step">
      <div class="step-n">8</div>
      <div class="card">
        <h2>Estadísticas generales</h2>
        <pre class="formula">Media      x̄ = {{ fmt(mean(xs)) }}     ȳ = {{ fmt(mean(ys)) }}
Varianza   σ²ₓ = Σ(x − x̄)² / n = {{ fmt(variance(xs)) }}     σ²ᵧ = {{ fmt(variance(ys)) }}
Desv. est. σₓ = √σ²ₓ = {{ fmt(std(xs)) }}     σᵧ = √σ²ᵧ = {{ fmt(std(ys)) }}</pre>
      </div>
    </section>
  </template>
</template>
