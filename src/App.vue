<template>
  <main class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Kanban Flow</h1>
    <KanbanBoard />
    kzadxzd
    <PomodoroTimer />
    <PomodoroModal
      :isVisible="pomodoroModalStore.showModal"
      @option-selected="pomodoroModalStore.handleSelectedOption"
      @close="pomodoroModalStore.closeModal"
    />
  </main>
</template>

<script setup>
  import KanbanBoard from './components/kanban/DisplayKanbanBoard.vue';
  import PomodoroTimer from './components/pomodoro/DisplayPomodoro.vue';
  import PomodoroModal from '@/components/modals/PomodoroModal.vue';

  import { usePomodoroModalStore } from '@/stores/pomodoroModal';

  const pomodoroModalStore = usePomodoroModalStore();
</script>
