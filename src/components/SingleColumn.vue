<template>
  <div :class="['rounded-lg p-4 min-w-[250px]', column.color]">
    <div class="flex justify-between items-center mb-2">
      <input
        v-model="name"
        @blur="rename"
        class="bg-transparent font-bold text-lg focus:outline-1 focus:rounded-sm p-1"
        title="Click to Rename column"
      />
      <button
        v-if="!column.isDefault"
        @click="remove"
        class="text-red-500 hover:text-red-700 text-sm cursor-pointer"
        title="Click to Remove column"
      >
        ✕
      </button>
    </div>

    <draggable
      :list="columnTasks"
      group="tasks"
      item-key="id"
      @change="onTaskMoved"
      class="flex-1 min-h-[50px] hover:cursor-grab"
      ghost-class="dragging"
    >
      <template #item='{ element }'>
        <TaskCard
          :task="element"
          @remove="handleRemoveTask"
        />
      </template>
    </draggable>

    <AddTaskForm
      v-if="column.id !== 'done'"
      :columnId="column.id"
      @add="handleAddTask"
    />
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { useBoardStore } from '../stores/board';
  import TaskCard from './TaskCard.vue';
  import AddTaskForm from './AddTaskForm.vue';
  import draggable from 'vuedraggable';

  const props = defineProps({
    column: Object
  });
  const store = useBoardStore();

  const name = ref(props.column.name);
  watch(() => props.column.name, (val) => {
    name.value = val;
  });

  function rename() {
    store.renameColumn(props.column.id, name.value);
  }

  function remove() {
    store.removeColumn(props.column.id);
  }


  function handleAddTask({ columnId, title }) {
    store.addTask(columnId, title);
  }

  function handleRemoveTask(taskId) {
    store.removeTask(taskId);
  }

  const columnTasks = computed(() =>
    store.tasks.filter(task => task.columnId === props.column.id)
  );

  function onTaskMoved(evt) {
    const movedTask = evt.added?.element;

    // const prevColumn = movedTask.columnId;
    const newColumn = props.column.id;

    if (movedTask) {
      store.moveTask(movedTask.id, newColumn);
    }
  }

</script>
