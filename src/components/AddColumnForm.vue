<template>
  <div class="max-w-[500px] bg-white p-4 rounded-lg shadow">
    <h2 class="text-lg font-bold mb-2">Add a New Column</h2>
    <form @submit.prevent="handleAdd">
      <input
        v-model="newColumn"
        placeholder="Enter a name for the the new column"
        class="w-full border border-gray-300 rounded px-2 py-1 mb-2"
      />
      <button
        type="submit"
        class="w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Add Column
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();
  const newColumn = ref('');

  function handleAdd() {
    if (newColumn.value.trim()) {
      store.addColumn(newColumn.value.trim());
      newColumn.value = '';
    }
  }
</script>
