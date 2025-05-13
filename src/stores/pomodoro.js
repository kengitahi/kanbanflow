import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import TIMER_CONFIG from '@/config/PomodoroTimerConfig';

import { useBoardStore } from '@/stores/board';

const POMODORO_STORAGE_KEY = 'pomodoro-timer';

export const usePomodoroStore = defineStore('pomodoro', () => {
  const currentMode = ref('work');
  const minutes = ref(TIMER_CONFIG.work.duration);
  const seconds = ref(0);
  const isRunning = ref(false);
  const sessionsCompleted = ref(0);

  const boardStore = useBoardStore();

  let timerInterval = null;
  //Track times on load
  let savedTimeStamp = null;

  // Computed properties
  const formattedTime = computed(() => {
    // Ensure values are treated as numbers for padStart
    const min = Number(minutes.value);
    const sec = Number(seconds.value);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  const modeConfig = computed(() => TIMER_CONFIG[currentMode.value] || TIMER_CONFIG.work);

  const modeLabel = computed(() => modeConfig.value.label || 'Work');

  const modeColor = computed(() => modeConfig.value.color || 'bg-blue-500');

  // --- Internal Functions ---
  function saveState() {
    try {
      const stateToSave = {
        currentMode: currentMode.value,
        minutes: minutes.value,
        seconds: seconds.value,
        isRunning: isRunning.value,
        sessionsCompleted: sessionsCompleted.value,
        // If currently running, save the exact time to calculate elapsed time on reload
        savedTimestamp: isRunning.value ? Date.now() : null,
      };
      localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(stateToSave));
      console.log('Pomodoro state saved:', stateToSave);
    } catch (error) {
      console.error('Error saving Pomodoro state to localStorage:', error);
    }
  }

  function loadState() {
    try {
      const savedPomodoro = localStorage.getItem(POMODORO_STORAGE_KEY);

      if (savedPomodoro) {
        const localTimerState = JSON.parse(savedPomodoro);

        currentMode.value = localTimerState.currentMode || TIMER_CONFIG.work.id;
        sessionsCompleted.value = localTimerState.sessionsCompleted || 0;

        if (localTimerState.isRunning && localTimerState.savedTimestamp) {
          const elapsedMilliseconds = Date.now() - localTimerState.savedTimestamp;
          const elapsedSecondsTotal = Math.floor(elapsedMilliseconds / 1000);

          const totalSecondsRemainingAtSave = (localTimerState.minutes * 60) + localTimerState.seconds;
          let newTotalSecondsRemaining = totalSecondsRemainingAtSave - elapsedSecondsTotal;

          if (newTotalSecondsRemaining <= 0) {
            // Timer would have completed while page was closed
            minutes.value = 0;
            seconds.value = 0;
            isRunning.value = false; // Mark as not running before completing
            clearTimerInterval(); // Ensure no old interval lingers
            completeTimer(true); // Pass flag to indicate it's a load-time completion
          } else {
            minutes.value = Math.floor(newTotalSecondsRemaining / 60);
            seconds.value = newTotalSecondsRemaining % 60;
            startTimer(true); // Pass flag to indicate it's a resume
          }
        } else {
          // Not running, or no valid timestamp to resume from
          minutes.value = localTimerState.minutes !== undefined ? localTimerState.minutes : modeConfig.value.duration;
          seconds.value = localTimerState.seconds !== undefined ? localTimerState.seconds : 0;
          isRunning.value = false;
        }
      } else {
        // No saved state, initialize with current mode's default duration
        resetTimerToBase();
      }
    } catch (error) {
      console.error('Error loading Pomodoro state from localStorage:', error);
      // Fallback to default if loading fails
      resetTimerToBase();
    }
  }

  // --- Initialization ---
  loadState(); // Load saved state when store is initialized and before watching

  // --- Watchers ---
  // Watch for mode changes to update the timer duration and reset
  watch(currentMode, (newModeId, oldModeId) => {
    if (newModeId === oldModeId) return; // No change

    console.log(`Mode changed from ${oldModeId} to ${newModeId}. Resetting timer.`);

    resetTimerToBase();

    const previousModeConfig = TIMER_CONFIG[oldModeId] || TIMER_CONFIG.work;
    const newModeConfig = TIMER_CONFIG[newModeId] || TIMER_CONFIG.work;

    // If the old timer was a work timer or a break timer that should auto-transition
    if (previousModeConfig.autoStartNext !== false && newModeConfig.autoStart !== false) {
      // we want the next one to auto-start, we  call startTimer() here.
      if (!isRunning.value) { //If it's not already running (e.g. due to resume)
        startTimer();
      }
    } else {
      // If no auto-start, just save the new reset state
      saveState();
    }
  }, { immediate: false }); // `immediate: false` to avoid running on initial load before _loadState

  // --- Timer functions ----
  function startTimer(isResuming = false) {
    if (isRunning.value && !isResuming) { // Prevent multiple starts unless resuming
      console.log('Timer already running');
      return;
    }
    clearTimerInterval(); // Clear any existing interval

    isRunning.value = true;

    if (!isResuming) { // Only log "Starting new" if not resuming
      console.log('Starting new timer session for mode:', currentMode.value);
    } else {
      console.log('Resuming timer for mode:', currentMode.value);
    }

    saveState(); // Save state when timer starts or resumes

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
        return; // Exit the interval to prevent further execution
      }
      saveState(); // Save state on each tick
    }, 1000);
  }

  function pauseTimer() {
    if (!isRunning.value) return; // Do nothing if not running

    console.log('Pausing timer');

    isRunning.value = false;
    clearTimerInterval();
    saveState(); // Save state when paused
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
    saveState(); // Save state after stopping

    // Optionally reset sessionsCompleted if needed
    // sessionsCompleted.value = 0;

    startTimer();
  }

  function completeTimer() {
    pauseTimer(); // Stop the interval first
    isRunning.value = false; // Mark as not running

    // Play sound and update sessions ONLY if it was a work session that just actively completed
    // Or if it's a break session (to switch back to work)
    const wasWorkSession = currentMode.value === (TIMER_CONFIG.work.id || 'work');

    if (wasWorkSession) {
      sessionsCompleted.value++;
      playSound('/audio/start-break.wav');
    } else { // It was a break session
      playSound('/audio/start-work.wav');
    }

    // Determine next mode
    let nextModeId = TIMER_CONFIG.work.id || 'work'; // Default to work
    if (wasWorkSession) {
      if (sessionsCompleted.value > 0 && sessionsCompleted.value % (TIMER_CONFIG.longBreak?.interval || 4) === 0) {
        nextModeId = TIMER_CONFIG.longBreak.id || 'longBreak';
      } else {
        nextModeId = TIMER_CONFIG.shortBreak.id || 'shortBreak';
      }
    }

    currentMode.value = nextModeId; // This will trigger the watcher

    resetTimerToBase(); // Set time for the new mode
    saveState(); // Save the new state
    //startTimer(); // Auto-start the next timer  or let watcher hanbdle it on mode change
  }

  function stopTimer() {
    pauseTimer();
    resetTimerToBase(); // Reset time values for the current mode
  }

  function stopSession() {
    stopTimer();
    sessionsCompleted.value = 0;
    currentMode.value = 'work';

    boardStore.stopPomodoro();
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

  function clearTimerInterval() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

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
