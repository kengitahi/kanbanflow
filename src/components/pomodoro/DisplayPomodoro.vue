<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <h1 class="text-3xl font-bold text-center mb-6">Pomodoro Timer</h1>

      <PomodoroTimer
        :formattedTime="formattedTime"
        :modeLabel="modeLabel"
        :modeColor="modeColor"
      />

      <ModeSelector
        :modes="TIMER_CONFIG"
        :currentMode="currentMode"
        :onModeSelect="changeMode"
      />

      <div class="flex flex-wrap justify-center mt-6">
        <ControlButton
          :label="isRunning ? 'Pause Session' : 'Start Session'"
          :onClick="toggleTimer"
          variant="primary"
        />

        <ControlButton
          label="Reset Timer"
          :onClick="resetTimer"
          variant="secondary"
        />

        <ControlButton
          label="Stop Session"
          :onClick="stopTimer"
          variant="danger"
        />
      </div>

      <div class="mt-6 text-center">
        <p class="text-gray-600">Sessions Completed: {{ sessionsCompleted }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { usePomodoro } from '@/stores/pomodoro';
  import TIMER_CONFIG from '@/config/PomodoroTimerConfig';
  import PomodoroTimer from '@/components/pomodoro/PomodoroTimer.vue';
  import ControlButton from '@/components/buttons/ControlButton.vue';
  import ModeSelector from '@/components/pomodoro/ModeSelector.vue';

  // Use the timer composable
  const {
    currentMode,
    isRunning,
    sessionsCompleted,
    formattedTime,
    modeLabel,
    modeColor,
    toggleTimer,
    resetTimer,
    stopTimer,
    changeMode,
  } = usePomodoro();
</script>
