<template>
  <div
    class="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs flex flex-col gap-2"
  >
    <h2 class="text-lg font-bold capitalize mb-1">{{ modeLabel }} Session</h2>

    <p class="text-sm text-gray-500">✅ Completed Work Sessions: {{ sessionCount }}</p>

    <p v-if="isSessionOver" class="text-green-600 mt-2">Session Complete!</p>

    <p class="font-bold text-md text-gray-700">
      🕛 Working on:
      <span class="text-green-600 capitalize font-semibold underline">{{
        store.activePomodoro.taskName
      }}</span>
    </p>

    <!-- Show when session started -->
    <p class="text-sm text-gray-500">
      🕓 Time Spent Focusing: <span class="text-green-500">{{ timeSinceStart }}</span>
    </p>

    <p class="text-sm text-gray-500">
      ⌛ Remaining Time: <span class="text-red-500">{{ timeRemaining }}</span>
    </p>

    <hr class="my-2 border-gray-300" />

    <div class="flex justify-center gap-2">
      <button
        class="px-3 py-1 rounded bg-yellow-500 text-white text-sm hover:bg-yellow-600"
        @click="pauseTimer"
        v-if="running && !paused"
      >
        Pause Session
      </button>
      <button
        class="px-3 py-1 rounded bg-yellow-700 text-white text-sm hover:bg-yellow-800"
        @click="resumeTimer"
        v-if="paused"
      >
        Resume Session
      </button>
    </div>

    <hr class="my-2 border-gray-300" />

    <div class="flex gap-2">
      <button
        class="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600 transition hover:shadow-md hover:cursor-pointer"
        @click="startSession('work')"
      >
        Start Work
      </button>
      <button
        class="px-3 py-1 rounded bg-green-500 text-white text-sm hover:bg-green-600 transition hover:shadow-md hover:cursor-pointer"
        @click="startSession('shortBreak')"
      >
        Short Break
      </button>
      <button
        class="px-3 py-1 rounded bg-purple-500 text-white text-sm hover:bg-purple-600 transition hover:shadow-md hover:cursor-pointer"
        @click="startSession('longBreak')"
      >
        Long Break
      </button>
    </div>

    <hr class="my-2 border-gray-300" />

    <div class="flex gap-2">
      <button
        @click="resetTimer()"
        class="text-sm bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition hover:shadow-md hover:cursor-pointer"
      >
        Reset Session
      </button>
      <button
        @click="store.stopPomodoro()"
        class="text-sm bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition hover:shadow-md hover:cursor-pointer"
      >
        Stop Session
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useBoardStore } from '@/stores/board'
import { timerSettings } from '@/utils/TimerSettings'

const store = useBoardStore()

// Reactive states
const mode = ref('work') // 'work' | 'shortBreak' | 'longBreak'
const sessionCount = ref(0)

const startedAt = ref(null)
const endTime = ref(null)

const running = ref(false)
const paused = ref(false)
const remainingTime = ref(0)

// Make sure the timer updates regularly
const currentTime = ref(Date.now())

// Update the timer every second
let timerInterval = null

function startTicking() {
  timerInterval = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
}

function stopTicking() {
  clearInterval(timerInterval)
}

// Set up the interval when component mounts
onMounted(() => {
  startTicking()

  // Kick off first session on mount
  startSession('work')
})

// Clean up the interval when component unmounts
onUnmounted(() => {
  stopTicking()
})

// Start session
function startSession(newMode) {
  const duration = {
    work: timerSettings.workDuration,
    shortBreak: timerSettings.shortBreakDuration,
    longBreak: timerSettings.longBreakDuration,
  }[newMode]

  // const time = remainingTime.value || duration;

  mode.value = newMode

  startedAt.value = Date.now()
  endTime.value = startedAt.value + duration

  running.value = true
  paused.value = false
  remainingTime.value = 0
}

function pauseTimer() {
  if (!running.value || paused.value) return
  paused.value = true
  remainingTime.value = Math.max(0, endTime.value - Date.now())

  console.log('remaining time', remainingTime.value)
  stopTicking()
}

function resumeTimer() {
  if (!paused.value || !remainingTime.value) return
  // Calculate the new end time based on the current time and the stored remaining time
  startedAt.value =
    Date.now() -
    ({
      work: timerSettings.workDuration,
      shortBreak: timerSettings.shortBreakDuration,
      longBreak: timerSettings.longBreakDuration,
    }[mode.value] -
      remainingTime.value) // Estimate the effective start time
  endTime.value = Date.now() + remainingTime.value
  running.value = true
  paused.value = false
  remainingTime.value = 0 // Reset remainingTime after resuming
  startTicking()
}

// Reset the current timer session
// function resetTimer() {
//   sessionCount.value = 0;

//   //destructure current task
//   const { taskId } = store.activePomodoro;
//   //Find the task with that id
//   const task = store.tasks.find(task => task.id === taskId);

//   if(confirm(`Are you sure you want to reset the timer for "${task.title}"?`)) {
//     store.startPomodoro(task);
//   }else{
//     store.promptPomodoro(task);
// }
// }

function resetTimer() {
  running.value = false
  paused.value = false
  startedAt.value = null
  endTime.value = null
  remainingTime.value = 0
}

// Handle automatic transitions
watch(currentTime, (newCurrentTime) => {
  if (!running.value || paused.value || !endTime.value) return

  if (newCurrentTime >= endTime.value) {
    running.value = false

    if (mode.value === 'work') {
      sessionCount.value++
      const nextMode = sessionCount.value % 4 === 0 ? 'longBreak' : 'shortBreak'
      startSession(nextMode)
    } else {
      startSession('work')
    }
  }
})

// Calculate remaining time
const timeRemaining = computed(() => {
  if (!endTime.value || !running.value) return '00:00'

  const diff = Math.floor((endTime.value - currentTime.value) / 1000)

  const remaining = Math.max(diff, 0)

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// // Calculate time since the pomodoro started
// const timeSinceStart = computed(() => {
//   if (!store.activePomodoro) return '00:00'

//   const diff = currentTime.value - store.activePomodoro.startTime
//   const minutes = Math.floor(diff / 60000)
//   // const seconds = Math.floor((diff % 60000) / 1000);

//   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
// })

// Calculate time since the current session started
const timeSinceStart = computed(() => {
  //if (!startedAt.value || paused.value) {
  // Also show 00:00 if not started or paused
  // if running but paused, calculate time spent in the current *segment*
  if (running.value && paused.value && endTime.value && remainingTime.value) {
    const diff = Math.floor(endTime.value - remainingTime.value - startedAt.value)
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor(minutes % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  //return '00:00'
  //}

  const diff = currentTime.value - startedAt.value
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000) // Uncommented and corrected

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` // Corrected formatting
})

// Decide if session is complete
const isSessionOver = computed(() => {
  return endTime.value && currentTime.value >= endTime.value
})

// Display label
const modeLabel = computed(() => {
  return {
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  }[mode.value]
})
</script>


