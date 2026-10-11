<script setup>
import { ref } from 'vue'
const members = [
  { name: 'Carlos David Cota Sañudo', first: 'carlos' },
  { name: 'Jaime Omar Escalante Soto', first: 'jaime' },
  { name: 'Gerardo Miguel Vázquez Navarro', first: 'gerardo' },
]
const initials = (n) => n.split(' ').filter((_, i, a) => i === 0 || i === a.length - 2).map((w) => w[0]).join('')
const photos = import.meta.glob('../../assets/*.{jpeg,jpg,png,webp}', { eager: true, import: 'default' })
const photo = (first) => Object.entries(photos).find(([p]) => new RegExp(`/${first}\\.(jpe?g|png|webp)$`, 'i').test(p))?.[1] ?? null
const zoomed = ref(null)
const info = [
  ['Universidad', 'Universidad Autónoma de Sinaloa'],
  ['Facultad', 'Facultad de Ingeniería Mochis'],
  ['Carrera', 'Ingeniería de Software'],
  ['Asignatura', 'Sistemas de Apoyo a la Decisión'],
  ['Docente', 'Alan David Ramírez Noriega'],
  ['Equipo y grupo', 'Equipo 13 · Grupo 4-01'],
]
</script>

<template>
  <div class="head">
    <h1>Integrantes del equipo</h1>
    <p class="muted">Tarea 8 · Aplicación para regresión lineal (Unidad 3)</p>
  </div>
  <div class="grid">
    <section v-for="m in members" :key="m.name" class="card span-4 member">
      <img v-if="photo(m.first)" class="avatar member-photo" :src="photo(m.first)" :alt="m.name" title="Ver foto" @click="zoomed = { src: photo(m.first), name: m.name }" />
      <div v-else class="avatar">{{ initials(m.name) }}</div>
      <div><h3>{{ m.name }}</h3><p class="muted">Equipo 13</p></div>
    </section>
    <section class="card span-12">
      <h2 style="margin-bottom: 14px">Datos del curso</h2>
      <dl><template v-for="[k, v] in info" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></template></dl>
    </section>
  </div>
  <Teleport to="body">
    <div v-if="zoomed" class="lightbox" @click="zoomed = null">
      <figure>
        <img :src="zoomed.src" :alt="zoomed.name" />
        <figcaption>{{ zoomed.name }}</figcaption>
      </figure>
      <button class="lightbox-close" aria-label="Cerrar" @click="zoomed = null">×</button>
    </div>
  </Teleport>
</template>
