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
  import { useBoardStore } from '@/stores/board';
  import Column from '@/components/kanban/SingleColumn.vue';
  import AddColumnForm from '@/components/kanban/AddColumnForm.vue';
import { onMounted } from 'vue';

  const boardStore = useBoardStore();
  const { columns } = boardStore;

  onMounted(() => {
   console.log(boardStore);
  });
</script>
