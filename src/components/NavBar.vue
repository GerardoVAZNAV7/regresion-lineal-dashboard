<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
const items = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'procedure', label: 'Procedimiento' },
  { id: 'team', label: 'Integrantes' },
]
</script>

<template>
  <header class="nav">
    <div class="nav-in">
      <div class="brand">
        <span class="brand-mark">ŷ</span>
        <span>Regresión lineal<small>Mínimos cuadrados · Equipo 13</small></span>
      </div>
      <nav class="links">
        <button v-for="i in items" :key="i.id" class="link" :class="{ active: modelValue === i.id }"
          @click="$emit('update:modelValue', i.id)">{{ i.label }}</button>
      </nav>
    </div>
  </header>
</template>
