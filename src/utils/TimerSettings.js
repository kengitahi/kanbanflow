import { reactive } from 'vue';

//Values in milliseconds
export const timerSettings = reactive({
  // workDuration: 25 * 60 * 1000,      // 25 minutes
  workDuration: 5 * 1000,        // 5 seconds for testing
  shortBreakDuration: 5 * 60 * 1000, // 5 minutes
  longBreakDuration: 15 * 60 * 1000  // 15 minutes
});
