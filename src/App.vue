<template>
  <main class="min-h-screen bg-gray-100 p-4">
    <img src="/logo.png" class="h-20 mb-4 mx-auto" />
    <KanbanBoard />
    <PomodoroTimer v-if="boardStore.activePomodoro" />
  </main>
</template>

<script setup>
import KanbanBoard from '@/components/kanban/DisplayKanbanBoard.vue'
import PomodoroTimer from '@/components/pomodoro/DisplayPomodoro.vue'

import { useBoardStore } from './stores/board'
const boardStore = useBoardStore()
</script>
