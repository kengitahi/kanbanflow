<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
      <div class="flex justify-between items-center mb-4">
        <!-- TODO: Add the task name to the modal -->
        <h3 class="text-lg font-semibold text-gray-900">Choose an Option for the task</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 focus:outline-none">&times;</button>
      </div>

      <div class="space-y-4">
        <button
          @click="handleOptionClick('start')"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Start a New Pomodoro (New task name)
        </button>

        <button
        v-if = "boardStore.activePomodoro"
          @click="handleOptionClick('continue')"
          class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Continue Previous Pomodoro (existing task name)
        </button>

        <button
          @click="closeModal"
          class="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Cancel
        </button>
      </div>

      </div>
  </div>
</template>

<script setup>
import {useBoardStore} from '@/stores/board';

const boardStore = useBoardStore();

  defineProps({
    // isVisible prop controls whether the modal is displayed. It's a Boolean and defaults to false.
    isVisible: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['option-selected', 'close']);

  /**
   * @param {string} option - The identifier for the clicked option (e.g., 'option1').
   */
  const handleOptionClick = (option) => {
    console.log(`Option clicked: ${option}`);
    emit('option-selected', option);
    closeModal();
  };

  /**
   * closeModal: Method to close the modal.
   * It emits a 'close' event to the parent component to signal that the modal should be hidden.
   */
  const closeModal = () => {
    emit('close');
  };
</script>
