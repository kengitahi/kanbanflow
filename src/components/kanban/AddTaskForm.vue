<template>
  <form
    @submit.prevent="submit"
    class="mt-2"
  >
    <input
      v-model="title"
      :placeholder='`Add a new task to "${column.name}"`'
      class="w-full px-2 py-1 border rounded text-sm"
    />
  </form>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    column: Object,
  });
  const emit = defineEmits(['add']);

  const title = ref('');

  function submit() {
    if (title.value.trim()) {
      emit('add', { title: title.value.trim(), columnId: props.column.id });
      title.value = '';
    }
  }
</script>
