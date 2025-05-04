<template>
  <div class="flex gap-4 overflow-x-auto flex-col">
    <div class="gap-4 flex">
      <Column
        v-for="col in columns"
        :key="col.id"
        :column="col"
      />
    </div>
    <AddColumnForm />
  </div>

  <!-- Pomodoro Active Session UI -->
  <PomodoroTimer />
</template>

<script setup>
  import { useBoardStore } from '@/stores/board';

  import Column from './SingleColumn.vue';
  import AddColumnForm from './AddColumnForm.vue';
  import PomodoroTimer from './PomodoroTimer.vue';

  const store = useBoardStore();
  const { columns } = store;
</script>
