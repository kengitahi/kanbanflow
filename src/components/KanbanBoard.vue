<template>
  <div class="flex gap-4 overflow-x-auto flex-col">
    <!-- Debug info -->
    <div class="bg-gray-100 p-2 mb-4 rounded text-xs">
      <p>Debug: activePomodoro exists: {{ store.activePomodoro !== null }}</p>
      <p v-if="store.activePomodoro">Task name: {{ store.activePomodoro.taskName }}</p>
      <p v-if="store.activePomodoro">Start time: {{ store.activePomodoro.startTime }}</p>
      <button
        @click="testPomodoro"
        class="bg-blue-500 text-white px-2 py-1 rounded mt-1"
      >
        Test Pomodoro
      </button>
    </div>

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

    <!-- Show when session started -->
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
  import { computed, ref, onMounted, onUnmounted } from 'vue';

  import Column from './SingleColumn.vue';
  import AddColumnForm from './AddColumnForm.vue';

  const store = useBoardStore();
  const { columns } = store;

  // Make sure the timer updates regularly
  const currentTime = ref(Date.now());

  // Update the timer every second
  let timerInterval;

  onMounted(() => {
    console.log("Component mounted, activePomodoro:", store.activePomodoro);
    timerInterval = setInterval(() => {
      currentTime.value = Date.now();
    }, 1000);
  });

  // Clean up the interval when component unmounts
  onUnmounted(() => {
    clearInterval(timerInterval);
  });

  // For testing - creates a test pomodoro session
  function testPomodoro() {
    console.log("Creating test pomodoro");
    // Directly call the store method instead of trying to modify the ref
    const testTask = {
      id: "test-task",
      title: "Test Task"
    };
    store.startPomodoro(testTask);
    console.log("After setting:", store.activePomodoro);
  }

  // Calculate time since the pomodoro started
  const timeSinceStart = computed(() => {
    if (!store.activePomodoro) return '00:00';

    const diff = currentTime.value - store.activePomodoro.startTime;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
</script>
