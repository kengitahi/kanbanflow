<template>
  <div
    class="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-xl shadow-lg p-4 max-w-xs flex flex-col gap-2"
  >

    <h2 class="text-lg font-semibold capitalize">
      {{ modeLabel }} Session
    </h2>

    <p class="text-sm text-gray-500">
      Completed Work Sessions: {{ sessionCount }}
    </p>

    <p
      v-if="isSessionOver"
      class="text-green-600 mt-2"
    >
      Session Complete!
    </p>

    <div
      v-if="!isSessionOver"
      class="space-y-1"
    >
      <p class="text-md font-semibold capitalize">
        ⏱️ Working on: <span class="capitalize underline font-medium">{{ store.activePomodoro.taskName
        }}</span>
      </p>

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
  </div>
</template>

<script setup>

  import { useBoardStore } from '@/stores/board';
  import { computed, ref, onMounted, onUnmounted, watchEffect } from 'vue';

  const store = useBoardStore();

  const mode = computed(() => store.mode);
  const endTime = computed(() => store.endTime);
  const running = computed(() => store.running);

  const sessionCount = ref(0);

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

  // Handle automatic transitions
  watchEffect(() => {
    if (!running.value || !endTime.value) return;

    if (currentTime.value >= endTime.value) {
      running.value = false;

      if (mode.value === 'work') {
        sessionCount.value++;
        const nextMode = sessionCount.value % 4 === 0 ? 'longBreak' : 'shortBreak';
        store.startSession(nextMode);
      } else {
        store.startSession('work');
      }
    }
  });

  // Calculate remaining time
  const timeRemaining = computed(() => {
    if (!endTime.value) return '00:00';

    const diff = endTime.value - currentTime.value;
    const remaining = Math.max(diff, 0);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // Calculate time since the pomodoro started
  const timeSinceStart = computed(() => {
    if (!store.activePomodoro) return '00:00';

    const diff = currentTime.value - store.activePomodoro.startTime;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // Show session is complete
  const isSessionOver = computed(() => {
    return endTime.value && currentTime.value >= endTime.value;
  });

  // Display label
  const modeLabel = computed(() => {
    return {
      work: 'Work',
      shortBreak: 'Short Break',
      longBreak: 'Long Break'
    }[mode.value];
  })

</script>
