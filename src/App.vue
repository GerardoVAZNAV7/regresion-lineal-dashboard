<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import DashboardView from './views/DashboardView.vue'
import ProcedureView from './views/ProcedureView.vue'
import TeamView from './views/TeamView.vue'

const view = ref('dashboard')
const views = { dashboard: DashboardView, procedure: ProcedureView, team: TeamView }
</script>

<template>
  <NavBar v-model="view" />
  <main class="page"><component :is="views[view]" /></main>
</template>
