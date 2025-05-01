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

  // --- Load from localStorage before setting up the watcher ---
  function loadBoard() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        columns.value = parsed.columns || [...defaultColumns];
        tasks.value = parsed.tasks || [];
      } catch (e) {
        console.error('Failed to parse stored data:', e);
        // Reset to defaults if parsing fails
        columns.value = [...defaultColumns];
        tasks.value = [];
      }
    }
  }

  loadBoard(); // Load the board first before watching for changes, otherwise you will overwrite data before hydration!

  // --- Persistence: Watch only after loading
  watch([columns, tasks], () => {
    const data = {
      columns: columns.value,
      tasks: tasks.value,
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
    if (task) task.columnId = targetColumnId;

    if (targetColumnId === 'done') {
      markTaskComplete(taskId);
      triggerConfetti();
    }

    console.log('moveTask', taskId, targetColumnId);
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


  // Basic confetti (we’ll improve this later);
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

  return {
    columns,
    tasks,
    addColumn,
    removeColumn,
    renameColumn,
    addTask,
    removeTask,
    moveTask,
    getTasksByColumnId,
    markTaskComplete,
    triggerConfetti
  };
});
