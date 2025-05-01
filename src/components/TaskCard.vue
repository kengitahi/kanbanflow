<template>
  <div class="bg-white p-2 rounded shadow mb-2 flex justify-between items-center">
    <input
      v-if="showCheckbox"
      type="checkbox"
      @change="completeTask"
      class="mt-1"
    />
    <span :class="{ 'line-through text-gray-500': task.completed }">
      {{ task.title }}
    </span>
    <button
      @click="remove"
      class="text-sm text-red-500 hover:text-red-700"
    >✕</button>
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

  function completeTask() {
    store.markTaskComplete(props.task.id);
    store.triggerConfetti();
  }

  function remove() {
    emit('remove', props.task.id);
  }
</script>
