<template>
  <main class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Kanban Flow</h1>
    <KanbanBoard />
    <PomodoroTimer v-if="boardStore.activePomodoro" />
  </main>
</template>

<script setup>
import KanbanBoard from './components/kanban/DisplayKanbanBoard.vue'
  import PomodoroTimer from './components/pomodoro/DisplayPomodoro.vue'

import { useBoardStore } from './stores/board'
const boardStore = useBoardStore()
</script>
