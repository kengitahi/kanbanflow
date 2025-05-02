import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import confetti from 'canvas-confetti';

const STORAGE_KEY = 'kanban-board';

export const useBoardStore = defineStore('board', () => {
  const defaultColumns = [
    { id: 'todo', name: 'To Do', color: 'bg-blue-200', isDefault: true },
    { id: 'doing', name: 'Doing', color: 'bg-yellow-200', isDefault: true },
    { id: 'done', name: 'Done', color: 'bg-green-200', isDefault: true },
  ];

  const columns = ref([]);
  const tasks = ref([]);
  // Initialize activePomodoro with null
  const activePomodoro = ref(null);

  console.log("Store initialized");

  // --- Load from localStorage before setting up the watcher ---
  function loadBoard() {
    console.log("Loading board from localStorage");
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        columns.value = parsed.columns || [...defaultColumns];
        tasks.value = parsed.tasks || [];

        // Also load activePomodoro if it exists
        if (parsed.activePomodoro) {
          console.log("Found activePomodoro in localStorage:", parsed.activePomodoro);
          activePomodoro.value = parsed.activePomodoro;
        } else {
          console.log("No activePomodoro in localStorage");
        }
      } catch (e) {
        console.error('Failed to parse stored data:', e);
        // Reset to defaults if parsing fails
        columns.value = [...defaultColumns];
        tasks.value = [];
        activePomodoro.value = null;
      }
    } else {
      console.log("No saved board found, using defaults");
      columns.value = [...defaultColumns];
      tasks.value = [];
      activePomodoro.value = null;
    }

    console.log("Board loaded, activePomodoro:", activePomodoro.value);
  }

  loadBoard(); // Load the board first before watching for changes

  // --- Persistence: Watch only after loading
  watch([columns, tasks, activePomodoro], () => {
    console.log("Store changed, saving to localStorage", {
      columnsCount: columns.value.length,
      tasksCount: tasks.value.length,
      activePomodoro: activePomodoro.value
    });

    const data = {
      columns: columns.value,
      tasks: tasks.value,
      activePomodoro: activePomodoro.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, { deep: true });

  // --- Column Management ---
  function addColumn(name) {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    columns.value.push({
      id,
      name,
      color: 'bg-gray-200',
      isDefault: false
    });
  }

  function removeColumn(id) {
    const index = columns.value.findIndex(col => col.id === id);
    if (index !== -1 && !columns.value[index].isDefault) {
      columns.value.splice(index, 1);
      tasks.value = tasks.value.filter(task => task.columnId !== id);
    }
  }

  function renameColumn(id, newName) {
    const column = columns.value.find(col => col.id === id);
    if (column) column.name = newName;
  }

  // --- Task Management ---
  function addTask(columnId, title) {
    tasks.value.push({
      id: Date.now().toString(),
      title,
      columnId,
      done: false
    });
  }

  function removeTask(taskId) {
    tasks.value = tasks.value.filter(task => task.id !== taskId);
  }

  function moveTask(taskId, targetColumnId) {
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      const oldColumnId = task.columnId;
      task.columnId = targetColumnId;

      console.log(`Task ${taskId} moved from ${oldColumnId} to ${targetColumnId}`);

      // If moving to 'doing' column, prompt for pomodoro
      if (targetColumnId === 'doing') {
        console.log("Task moved to doing column, prompting pomodoro");
        promptPomodoro(task);
      }

      if (targetColumnId === 'done') {
        markTaskComplete(taskId);
        triggerConfetti();
      } else {
        task.completed = false;
      }
    }
  }

  function getTasksByColumnId(columnId) {
    return tasks.value.filter(task => task.columnId === columnId);
  }

  function markTaskComplete(id) {
    const task = tasks.value.find(t => t.id === id);
    if (task && !task.completed) {
      task.completed = true;
      task.columnId = 'done';
    }
  }

  // --- Basic confetti (we'll improve this later);
  function triggerConfetti() {
    const duration = 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        particleCount: 10,
        spread: 60,
        origin: { y: 0.7 }
      });
    }, 100);
  }

  // --- Pomodoro
  function promptPomodoro(task) {
    console.log("Prompting pomodoro for task:", task);
    const wantsTimer = confirm(`Start a Pomodoro session for "${task.title}"?`);
    if (wantsTimer) {
      startPomodoro(task);
    }
  }

  function startPomodoro(task) {
    console.log("Starting pomodoro for task:", task);
    activePomodoro.value = {
      taskId: task.id,
      taskName: task.title,
      startTime: Date.now() // Changed from startedAt to startTime to match component
    };
    console.log("Active pomodoro state after setting:", activePomodoro.value);
  }

  function stopPomodoro() {
    console.log("Stopping pomodoro");
    activePomodoro.value = null;
  }

  // Force set a pomodoro (for testing)
  function forcePomodoro() {
    console.log("Force setting pomodoro");
    activePomodoro.value = {
      taskId: "test-task",
      taskName: "Test Task",
      startTime: Date.now()
    };
    console.log("Pomodoro set:", activePomodoro.value);
  }

  return {
    columns,
    tasks,
    activePomodoro,
    addColumn,
    removeColumn,
    renameColumn,
    addTask,
    removeTask,
    moveTask,
    getTasksByColumnId,
    markTaskComplete,
    triggerConfetti,
    promptPomodoro,
    startPomodoro,
    stopPomodoro,
    forcePomodoro // Added for testing
  };
});
