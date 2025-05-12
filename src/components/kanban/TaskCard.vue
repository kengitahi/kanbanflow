<template>
  <div
    class="bg-white p-2 rounded shadow mb-2 flex justify-between items-center gap-4"
    :class="{ 'border-2 border-green-500': store.activePomodoro && task.id === store.activePomodoro.taskId }"
  >
    <div class="flex items-center gap-2">
      <input
        v-if="showCheckbox"
        type="checkbox"
        @change="completeTask"
        class="mt-1 cursor-pointer"
        title="Mark task as completed"
      />
      <span :class="{ 'line-through text-gray-500': task.completed }">
        {{ task.title }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <button
        v-if="task.columnId !== 'done'"
        @click="startPomodoro"
        class="text-md px-1 bg-red-100 text-red-600 rounded hover:bg-red-200 cursor-pointer"
        title="Start Pomodoro"
        aria-label="Start Pomodoro for this task"
      >
        ⏱️
      </button>
      <button
        @click="remove"
        class="text-sm text-red-500 cursor-pointer hover:border-red-700 border rounded-full p-2.5 h-0.5 w-0.5 flex items-center justify-center"
        title="Click to Remove task"
      >
        <span class="-mt-0.5">
          ✕
        </span>
      </button>
    </div>
  </div>

</template>

<script setup>
  import { computed } from 'vue';
  import { useBoardStore } from '@/stores/board';

  const store = useBoardStore();

  const emit = defineEmits(['remove']);

  const props = defineProps(
    {
      task: Object,
      columnId: String,
      columnColor: String,
    }
  );

  const showCheckbox = computed(() => {
    // Only show the checkbox if the task is not in the done column
    // Optionally, also remove checkboxes from the todo column with
    // `&& props.task.columnId !== 'todo'`
    return props.task.columnId !== 'done';
  });

  function startPomodoro() {
    if (props.task.columnId == 'todo') {
      store.moveTask(props.task.id, 'doing');
    } else {
      store.promptPomodoro(props.task);
    }
  }

  function completeTask() {
    store.markTaskComplete(props.task.id);
    store.triggerConfetti();
  }

  function remove() {
    emit('remove', props.task.id);
  }
</script>
