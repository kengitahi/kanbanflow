<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <div class="border-b-2 border-gray-300 p-3 gap-1 flex flex-col">
        <template v-if="boardStore.activePomodoro">

          <div class="space-x-2">
            <span class="font-semibold">Working on:</span>
            <span class="text-gray-500">{{ boardStore.activePomodoro.taskName }}</span>
          </div>

          <div class="space-x-2">
            <span class="font-semibold">Sessions Completed:</span>
            <span class="text-gray-500">{{ pomodoroStore.sessionsCompleted }}</span>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center text-center">
            <span class="font-semibold">You don't have an active pomodoro session.</span>
            <span class="text-sm text-gray-500">Start one by dragging a task to the "Doing" column or clicking the
              "clock" icon on a task.</span>
          </div>
        </template>

      </div>

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

      <div class="flex flex-wrap justify-center p-3">
        <ControlButton
          :disabled="!boardStore.activePomodoro"
          class="disabled:opacity-50 disabled:cursor-not-allowed"
          :label="pomodoroStore.isRunning ? 'Pause' : boardStore.activePomodoro ? 'Resume' : 'Start'"
          :onClick="pomodoroStore.toggleTimer"
          variant="primary"
          :title="boardStore.activePomodoro ? 'Click to pause or resume the pomodoro session' : 'Please start a pomodoro session first'"
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
          label="Stop Timer"
          :onClick="pomodoroStore.stopSession"
          variant="danger"
          :title="boardStore.activePomodoro ? 'Click to stop the ongoing pomodoro session' : 'Please start a pomodoro session first'"
        />
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
