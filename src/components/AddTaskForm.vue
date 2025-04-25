<template>
  <form @submit.prevent="submit" class="mt-2">
    <input
      v-model="title"
      placeholder="Add a task..."
      class="w-full px-2 py-1 border rounded text-sm"
    />
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ columnId: String })
const emit = defineEmits(['add'])

const title = ref('')

function submit() {
  if (title.value.trim()) {
    emit('add', { title: title.value.trim(), columnId: props.columnId })
    title.value = ''
  }
}
</script>
