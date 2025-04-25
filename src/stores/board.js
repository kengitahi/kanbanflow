import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoardStore = defineStore('board', () => {
  const defaultColumns = [
    { id: 'todo', name: 'To Do', color: 'bg-blue-200', isDefault: true },
    { id: 'doing', name: 'Doing', color: 'bg-yellow-200', isDefault: true },
    { id: 'done', name: 'Done', color: 'bg-green-200', isDefault: true },
  ]

  const columns = ref([...defaultColumns])
  const tasks = ref([])

  function addColumn(name) {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    columns.value.push({
      id,
      name,
      color: 'bg-gray-200',
      isDefault: false
    })
  }

  function removeColumn(id) {
    const index = columns.value.findIndex(col => col.id === id)
    if (index !== -1 && !columns.value[index].isDefault) {
      columns.value.splice(index, 1)
      // Remove tasks in this column
      tasks.value = tasks.value.filter(task => task.columnId !== id)
    }
  }

  function renameColumn(id, newName) {
    const column = columns.value.find(col => col.id === id)
    if (column) column.name = newName
  }

  function addTask(columnId, title) {
    tasks.value.push({
      id: Date.now().toString(),
      title,
      columnId,
      done: false
    })
  }

  function removeTask(taskId) {
    tasks.value = tasks.value.filter(task => task.id !== taskId)
  }

  function moveTask(taskId, targetColumnId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) task.columnId = targetColumnId
  }

  return {
    columns,
    tasks,
    addColumn,
    removeColumn,
    renameColumn,
    addTask,
    removeTask,
    moveTask
  }
})
