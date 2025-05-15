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

    <StartPomodoroModal
      :isVisible="pomodoroModalStore.showModal"
      :taskName="pomodoroModalStore.taskName"
      @option-selected="pomodoroModalStore.handleSelectedOption"
      @close="pomodoroModalStore.showModal = false"
    />
  </div>
</template>

<script setup>
  import { useBoardStore } from '@/stores/board';
  import { usePomodoroModalStore } from '@/stores/pomodoroModal';

  import Column from '@/components/kanban/SingleColumn.vue';
  import AddColumnForm from '@/components/kanban/AddColumnForm.vue';
  import StartPomodoroModal from '../Modals/StartPomodoroModal.vue';

  const boardStore = useBoardStore();
  const { columns } = boardStore;

  const pomodoroModalStore = usePomodoroModalStore();
</script>
