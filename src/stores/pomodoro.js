import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import TIMER_CONFIG from '@/config/PomodoroTimerConfig';
import { useBoardStore } from '@/stores/board';

export const usePomodoroStore = defineStore('pomodoro', () => {
  const currentMode = ref('work');
  const minutes = ref(TIMER_CONFIG.work.duration);
  const seconds = ref(0);
  const isRunning = ref(false);
  const sessionsCompleted = ref(0);

  const boardStore = useBoardStore();

  let timerInterval = null;

  // Computed properties
  const formattedTime = computed(() => {
    // Ensure values are treated as numbers for padStart
    const min = Number(minutes.value);
    const sec = Number(seconds.value);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  const modeLabel = computed(() => {
    return TIMER_CONFIG[currentMode.value].label || 'Work'; // Add fallback;
  });

  const modeColor = computed(() => {
    return TIMER_CONFIG[currentMode.value].color || 'bg-blue-500'; // Add fallback;
  });

  // Watch for mode changes to update the timer
  watch(currentMode, (newMode) => {
    // Ensure newMode exists in config
    if (TIMER_CONFIG[newMode]) {
      minutes.value = TIMER_CONFIG[newMode].duration;
      seconds.value = 0;
      // If the timer was running, stop it before changing mode duration
      if (isRunning.value) {
        stopTimer(); // This calls pauseTimer and resetTimer
        // Optionally restart timer in new mode if desired, or leave it stopped.
        startTimer();
      } else {
        resetTimer(); // Reset to the new mode's time
      }
    } else {
      console.warn(`Invalid Pomodoro mode attempted: ${newMode}`);
      // Reset to a default mode like 'work'
      currentMode.value = 'work';
    }
  });

  //Timer functions
  function startTimer() {
    console.log('Starting timer on pomodoro store'); // Log store start
    // if (isRunning.value) {
    //   console.log('Timer already running');
    //   return; // Don't start if already running
    // }
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    isRunning.value = true;

    timerInterval = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--;
      } else if (minutes.value > 0) {
        minutes.value--;
        seconds.value = 59;
      } else {
        // Timer completed
        completeTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning.value = false;
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function toggleTimer() {
    if (isRunning.value) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function resetTimerToBase() {
    minutes.value = TIMER_CONFIG[currentMode.value]?.duration || TIMER_CONFIG.work.duration;
    seconds.value = 0;
  }

  function resetTimer() {
    stopTimer();

    // Optionally reset sessionsCompleted if needed
    // sessionsCompleted.value = 0;

    startTimer();
  }

  function completeTimer() {
   console.log('Completing timer on pomodoro store');
    pauseTimer(); // Stop the interval first

    // Update sessions completed & determine next mode
    if (currentMode.value === 'work') {
      sessionsCompleted.value++;
      playSound('/audio/start-break.wav');

      if (sessionsCompleted.value > 0 && sessionsCompleted.value % 4 === 0) {
        currentMode.value = 'longBreak';
      } else {
        currentMode.value = 'shortBreak';
      }
    } else { // If it was a break ('shortBreak' or 'longBreak')
      playSound('/audio/start-work.wav');
      currentMode.value = 'work';
    }
    resetTimerToBase(); // Reset to the new mode's time
    startTimer(); // Auto-start the next timer
  }

  function stopTimer() {
    console.log('Stopping timer on pomodoro store'); // Log store stop
    pauseTimer();
    resetTimerToBase(); // Reset time values for the current mode
  }

  function stopSession() {
    stopTimer();
    sessionsCompleted.value = 0; // Reset completed sessions
    currentMode.value = 'work'; // Reset to work mode

    boardStore.stopPomodoro(); // Stop the Pomodoro session in the board store
  }

  function changeMode(mode) {
    if (mode === currentMode.value) return;
    currentMode.value = mode;
  }

  function playSound(filePath) {
    try {
      const audio = new Audio(filePath);

      audio
        .play()
        // Add catch for play promise
        .catch(error => console.error('Audio play failed:', error));
    } catch (error) {
      console.error('Could not play notification sound', error);
    }
  }

  // Initialize timer state based on the initial mode
  resetTimerToBase(); // Set initial time without pausing/logging

  return {
    currentMode,
    minutes,
    seconds,
    isRunning,
    sessionsCompleted,
    formattedTime,
    modeLabel,
    modeColor,
    startTimer,
    pauseTimer,
    toggleTimer,
    resetTimerToBase,
    resetTimer,
    stopTimer,
    stopSession,
    completeTimer,
    changeMode,
  };
});
