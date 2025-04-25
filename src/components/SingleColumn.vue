<template>
  <div :class="['rounded-lg p-4 min-w-[250px] flex flex-col', column.color]">
    <div class="flex justify-between items-center mb-2">
      <input
        v-model="name"
        @blur="rename"
        class="bg-transparent font-bold text-lg focus:outline-none"
      />
      <button
        v-if="!column.isDefault"
        @click="remove"
        class="text-red-500 hover:text-red-700 text-sm"
      >
        ✕
      </button>
    </div>

    <div class="flex-1">
      <TaskCard v-for="task in columnTasks" :key="task.id" :task="task" @remove="removeTask" />
    </div>

    <AddTaskForm v-if="column.id !== 'done'" :columnId="column.id" @add="handleAddTask" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBoardStore } from '../stores/board'
import TaskCard from './TaskCard.vue'
import AddTaskForm from './AddTaskForm.vue'

const props = defineProps({ column: Object })
const store = useBoardStore()

const name = ref(props.column.name)
watch(
  () => props.column.name,
  (val) => (name.value = val),
)

function rename() {
  store.renameColumn(props.column.id, name.value)
}

function remove() {
  store.removeColumn(props.column.id)
}

function handleAddTask({ columnId, title }) {
  store.addTask(columnId, title)
}

function removeTask(taskId) {
  store.removeTask(taskId)
}

const columnTasks = computed(() => store.tasks.filter((task) => task.columnId === props.column.id))
</script>
