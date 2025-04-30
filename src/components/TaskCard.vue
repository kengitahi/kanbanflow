<template>
  <div class="bg-white p-2 rounded shadow mb-2 flex justify-between items-center">
    <span>{{ task.title }}</span>
    <button
      @click="remove"
      class="text-sm text-red-500 hover:text-red-700"
    >✕</button>
  </div>
</template>

<script setup>
  const props = defineProps({ task: Object });
  const emit = defineEmits(['remove']);

  function remove() {
    emit('remove', props.task.id);
  }
</script>
