import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import { usePomodoroStore } from '@/stores/pomodoro';
import { usePomodoroModalStore } from '@/stores/pomodoroModal';

import confetti from 'canvas-confetti';

const Kanban_STORAGE_KEY = 'kanban-board';

export const useBoardStore = defineStore('board', () => {
  const pomodoroStore = usePomodoroStore();
  const pomodoroModalStore = usePomodoroModalStore();

  const defaultColumns = [
    { id: 'todo', name: 'To Do', color: 'bg-blue-200', isDefault: true },
    { id: 'doing', name: 'Doing', color: 'bg-yellow-200', isDefault: true },
    { id: 'done', name: 'Done', color: 'bg-green-200', isDefault: true },
  ];

  const columns = ref([]);
  const tasks = ref([]);
  // Initialize activePomodoro with null
  const activePomodoro = ref(null);

  // --- Load from localStorage before setting up the watcher ---
  function loadBoard() {
    const savedBoard = localStorage.getItem(Kanban_STORAGE_KEY);

    if (savedBoard) {
      try {
        const parsed = JSON.parse(savedBoard);
        columns.value = parsed.columns || [...defaultColumns];
        tasks.value = parsed.tasks || [];

        // Also load activePomodoro if it exists
        if (parsed.activePomodoro) {
          activePomodoro.value = parsed.activePomodoro;
        }
      } catch (error) {
        console.error('Error parsing saved board:', error);
        // Reset to defaults if parsing fails
        columns.value = [...defaultColumns];
        tasks.value = [];
        activePomodoro.value = null;
      }
    } else {
      // Load defaults if no saved board
      columns.value = [...defaultColumns];
      tasks.value = [];
      activePomodoro.value = null;
    }
  }

  loadBoard(); // Load the board first before watching for changes

  // --- Persistence: Watch only after loading
  watch([columns, tasks, activePomodoro], () => {
    const data = {
      columns: columns.value,
      tasks: tasks.value,
      activePomodoro: activePomodoro.value
    };
    localStorage.setItem(Kanban_STORAGE_KEY, JSON.stringify(data));
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
    const columnName = columns.value.find(col => col.id === id).name;

    //Find the number of tasks in the column
    const tasksInColumn = tasks.value.filter(task => task.columnId === id);
    const numTasks = tasksInColumn.length;

    if (confirm(`Are you sure you want to delete column "${columnName}"?`)) {

      if (numTasks > 0) {
        if (confirm(`There are ${numTasks} tasks in column "${columnName}. Would you like to mark all of them as done?`)) {
          //Mark all tasks in the deleted column as done and move them to 'done' column
          tasks.value.forEach(task => {
            if (task.columnId === id) {
              task.completed = true;
              moveTask(task.id, 'done');
            }
          });
        } else {
          //Move all tasks in the deleted column to 'todo' column
          tasks.value.forEach(task => {
            if (task.columnId === id) {
              task.completed = false;
              moveTask(task.id, 'todo');
            }
          });
        };
      }

      const index = columns.value.findIndex(col => col.id === id);
      if (index !== -1 && !columns.value[index].isDefault) {
        columns.value.splice(index, 1);
        tasks.value = tasks.value.filter(task => task.columnId !== id);
      }
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
    if (confirm(`Are you sure you want to delete task "${tasks.value.find(t => t.id === taskId).title}"?`)) {
      tasks.value = tasks.value.filter(task => task.id !== taskId);
    }

    if (activePomodoro.value && activePomodoro.value.taskId === taskId) {
      pomodoroStore.stopSession();
    }
  }

  function moveTask(taskId, targetColumnId) {
    const task = tasks.value.find(t => t.id === taskId);

    if (task) {
      // const oldColumnId = task.columnId;
      task.columnId = targetColumnId;

      if (targetColumnId !== 'done' && targetColumnId !== 'todo') {
        promptPomodoro(task);
      }

      if (targetColumnId == 'done' || targetColumnId == 'todo') {
        if (activePomodoro.value && activePomodoro.value.taskId === taskId) {

          stopPomodoro();
          pomodoroStore.stopTimer();
        }
      }

      if (targetColumnId === 'done') {
        markTaskComplete(taskId);
        triggerConfetti();
        pomodoroStore.changeMode('work');
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
    // Open the Pomodoro modal
    pomodoroModalStore.openModal();
    pomodoroModalStore.handleSelectedOption = (option) => {
      switch (option) {
        case 'start':
          startPomodoro(task);
          break;
        case 'continue':
          continuePomodoro(task);
          break;
      }
    }
  }

    function startPomodoro(task) {
      pomodoroStore.stopSession();
      pomodoroStore.changeMode('work');

      activePomodoro.value = {
        taskId: task.id,
        taskName: task.title,
        startTime: Date.now()
      };
      pomodoroStore.startTimer();
    }

    function continuePomodoro(task) {
      activePomodoro.value = {
        taskId: task.id,
        taskName: task.title,
        startTime: activePomodoro.value.startTime
      };
    }

    function stopPomodoro() {
      activePomodoro.value = null;
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
    };
  }
);
