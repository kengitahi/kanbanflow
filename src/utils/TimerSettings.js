import { reactive } from 'vue';

export const timerSettings = reactive({
  workDuration: 25 * 60 * 1000,      // 25 minutes
  shortBreakDuration: 5 * 60 * 1000, // 5 minutes
  longBreakDuration: 15 * 60 * 1000  // 15 minutes
});
