<template>
  <div class="flex gap-4 overflow-x-auto flex-col">
    <div class="gap-4 flex">
      <Column
        v-for="col in columns"
        :key="col.id"
        :column="col"
      />
    </div>
    <AddColumnForm />
  </div>
</template>

<script setup>
  import { useBoardStore } from '../stores/board';
  import Column from './SingleColumn.vue';
  import AddColumnForm from './AddColumnForm.vue';

  const { columns } = useBoardStore();
</script>
