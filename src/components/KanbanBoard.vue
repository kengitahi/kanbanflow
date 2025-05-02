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
  <div
    v-if="store.activePomodoro"
    class="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-xl shadow-lg p-4 max-w-xs flex flex-col gap-2"
  >
    <p class="font-semibold text-sm text-gray-700">
      ⏱️ Focused on: <span class="text-blue-600">{{ store.activePomodoro.taskName }}</span>
    </p>

    <!-- Optional: show when session started -->
    <p class="text-xs text-gray-500">
      Started: {{ timeSinceStart }}
    </p>

    <button
      @click="store.stopPomodoro()"
      class="text-sm bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
    >
      Stop Session
    </button>
  </div>

</template>

<script setup>
  import { useBoardStore } from '../stores/board';
  import { computed } from 'vue';

  import Column from './SingleColumn.vue';
  import AddColumnForm from './AddColumnForm.vue';

  const store = useBoardStore();
  const { columns } = store;

  const timeSinceStart = computed(() => {
    const diff = Date.now() - store.activePomodoro.startTime;
    return new Date(diff).toISOString().slice(14, 19);
  });

</script>
