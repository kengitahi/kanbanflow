import { ref, computed, watch } from 'vue';

import TIMER_CONFIG from '@/config/PomodoroTimerConfig';


export function usePomodoro() {
  const currentMode = ref('work');
  const minutes = ref(TIMER_CONFIG.work.duration);
  const seconds = ref(0);
  const isRunning = ref(false);
  const sessionsCompleted = ref(0);

  let timerInterval = null;

  // Computed properties
  const formattedTime = computed(() => {
    return `${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}`;
  });

  const modeLabel = computed(() => {
    return TIMER_CONFIG[currentMode.value].label;
  });

  const modeColor = computed(() => {
    return TIMER_CONFIG[currentMode.value].color;
  });

  // Watch for mode changes to update the timer
  watch(currentMode, (newMode) => {
    minutes.value = TIMER_CONFIG[newMode].duration;
    seconds.value = 0;
    stopTimer();

    //Start timer with the next mode
    startTimer();
  });

  //Timer functions
  function startTimer() {
    console.log('Starting timer on pomodoro.js');
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
  }

  function toggleTimer() {
    if (isRunning.value) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function resetTimer() {
    pauseTimer();

    minutes.value = TIMER_CONFIG[currentMode.value].duration;
    seconds.value = 0;
    // sessionsCompleted.value = 0;
  }

  function stopTimer() {
    pauseTimer();
    resetTimer();
  }

  function completeTimer() {
    pauseTimer();

    // Update sessions completed
    if (currentMode.value === 'work') {
      sessionsCompleted.value++;

      // Play notification sound if the ended session is a work session
      playSound('./audio/start-break.wav');

      // After 4 work sessions, switch to long break instead of short break
      if (sessionsCompleted.value % 4 === 0) {
        currentMode.value = 'longBreak';
      } else {
        currentMode.value = 'shortBreak';
      }
    } else {
      currentMode.value = 'work';
      playSound('./audio/start-work.wav');
    }
  }

  function changeMode(mode) {
    if (mode === currentMode.value) return;
    currentMode.value = mode;
  }

  function playSound(filePath) {
    try {
      const audio = new Audio(filePath);
      console.log('Playing notification sound', filePath);
      audio.play();
    } catch (error) {
      console.error('Could not play notification sound', error);
    }
  }

  // TODO: Remove this, for testing only
  function testFunction() {
    console.log('pomodoro board imported');
  }

  // Reset timer to the new mode's time
  resetTimer();

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
    resetTimer,
    stopTimer,
    completeTimer,
    changeMode,
    testFunction //For testing
  };

}
