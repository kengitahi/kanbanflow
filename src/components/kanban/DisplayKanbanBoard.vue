<template>
  <div class="flex flex-col mb-4" v-if="!boardStore.activePomodoro">
    <span class="font-semibold">You don't have an active pomodoro session.</span>
    <span class="text-sm text-gray-500"
      >Start one by dragging a task to the "Doing" column or clicking the "clock" icon on a
      task.</span
    >
  </div>

  <div class="flex gap-4 overflow-x-auto flex-col">
    <div class="gap-4 flex justify-between">
      <Column v-for="col in columns" :key="col.id" :column="col" />
    </div>
    <AddColumnForm />

    <StartPomodoroModal
      :isVisible="pomodoroModalStore.showModal"
      :task="pomodoroModalStore.task"
      @option-selected="pomodoroModalStore.handleSelectedOption"
      @close="pomodoroModalStore.showModal = false"
    />
  </div>
</template>

<script setup>
import { useBoardStore } from '@/stores/board'
import { usePomodoroModalStore } from '@/stores/pomodoroModal'

import Column from '@/components/kanban/SingleColumn.vue'
import AddColumnForm from '@/components/kanban/AddColumnForm.vue'
import StartPomodoroModal from '../Modals/StartPomodoroModal.vue'

const boardStore = useBoardStore()
const { columns } = boardStore

const pomodoroModalStore = usePomodoroModalStore()
</script>
