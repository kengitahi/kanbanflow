<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <PomodoroTimer
        :formattedTime="pomodoroStore.formattedTime"
        :modeLabel="pomodoroStore.modeLabel"
        :modeColor="pomodoroStore.modeColor"
      />

      <ModeSelector
        :modes="TIMER_CONFIG"
        :currentMode="pomodoroStore.currentMode"
        :onModeSelect="pomodoroStore.changeMode"
      />

      <div class="flex flex-wrap justify-center mt-6">
        <ControlButton
          :disabled="!boardStore.activePomodoro"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
          :label="pomodoroStore.isRunning ? 'Pause Session' : 'Resume Session'"
          :onClick="pomodoroStore.toggleTimer"
          variant="primary"
          :title="boardStore.activePomodoro? 'Click to pause or resume the pomodoro session' : 'Please start a pomodoro session first' "
        />

        <ControlButton
          :disabled="!boardStore.activePomodoro"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
          label="Reset Timer"
          :onClick="pomodoroStore.resetTimer"
          variant="secondary"
          :title="boardStore.activePomodoro ? 'Click to reset the ongoing pomodoro session' : 'Please start a pomodoro session first'"
        />

        <ControlButton
          :disabled="!boardStore.activePomodoro"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
          label="Stop Session"
          :onClick="pomodoroStore.stopSession"
          variant="danger"
          :title="boardStore.activePomodoro ? 'Click to stop the ongoing pomodoro session' : 'Please start a pomodoro session first'"
        />
      </div>

      <div class="mt-6 text-center">
        <p class="text-gray-600">Sessions Completed: {{ pomodoroStore.sessionsCompleted }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { usePomodoroStore } from '@/stores/pomodoro';
  import { useBoardStore } from '@/stores/board';
  import TIMER_CONFIG from '@/config/PomodoroTimerConfig';
  import PomodoroTimer from '@/components/pomodoro/PomodoroTimer.vue';
  import ControlButton from '@/components/buttons/ControlButton.vue';
  import ModeSelector from '@/components/pomodoro/ModeSelector.vue';

  const pomodoroStore = usePomodoroStore();
  const boardStore = useBoardStore();
</script>
