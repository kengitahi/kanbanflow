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
    <p
      v-if="isSessionOver"
      class="text-green-600 mt-2"
    >
      Session Complete!
    </p>

    <p class="font-bold text-lg text-gray-700">
      ⏱️ Working on: <span class="text-green-600 capitalize font-semibold underline">{{ store.activePomodoro.taskName
      }}</span>
    </p>

    <!-- Show when session started -->
    <p class="text-sm">
      Time Spent Focusing: <span class="text-green-500">{{ timeSinceStart }}</span>
    </p>

    <p class="text-sm">
      Remaining Time: <span class="text-red-500">{{ timeRemaining }}</span>
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
  import { useBoardStore } from '@/stores/board';
  import { computed, ref, onMounted, onUnmounted } from 'vue';

  import Column from './SingleColumn.vue';
  import AddColumnForm from './AddColumnForm.vue';

  import { timerSettings } from '@/utils/TimerSettings';

  const store = useBoardStore();
  const { columns } = store;

  // Make sure the timer updates regularly
  const currentTime = ref(Date.now());

  // Update the timer every second
  let timerInterval = null;

  onMounted(() => {
    timerInterval = setInterval(() => {
      currentTime.value = Date.now();
    }, 1000);
  });

  // Clean up the interval when component unmounts
  onUnmounted(() => {
    clearInterval(timerInterval);
  });

  // Set end time when Pomodoro starts
  const endTime = computed(() => {
    if (!store.activePomodoro) return null;

    return store.activePomodoro.startTime + timerSettings.workDuration;
  });

  const timeRemaining = computed(() => {
    if (!endTime.value) return '00:00';

    const diff = endTime.value - currentTime.value;
    const remaining = Math.max(diff, 0);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // Optional: Show session is complete
  const isSessionOver = computed(() => {
    return endTime.value && currentTime.value >= endTime.value;
  });

  // Calculate time since the pomodoro started
  const timeSinceStart = computed(() => {
    if (!store.activePomodoro) return '00:00';

    const diff = currentTime.value - store.activePomodoro.startTime;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
</script>
