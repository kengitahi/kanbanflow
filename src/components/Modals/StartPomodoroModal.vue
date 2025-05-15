<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Choose an Option</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >&times;</button>
      </div>

      <div class="space-y-4">
        <button
          @click="handleOptionClick('start')"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Start New Pomodoro
        </button>

        <button
          @click="handleOptionClick('continue')"
          class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Continue Ongoing Pomodoro With New Task
        </button>

        <button
          @click="closeModal"
          class="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition ease-in-out duration-150"
        >
          Do Nothing
        </button>
      </div>

    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'StartPomodoro',

    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },

    setup(props, { emit }) {

      /**
       * handleOptionClick: Method to handle clicks on the option buttons.
       * It emits a custom event 'option-selected' to the parent component with the selected option.
       * 
       * @param {string} option
       */
      const handleOptionClick = (option) => {
        emit('option-selected', option);
        closeModal();
      };

      /**
       * closeModal: Method to close the modal.
       * It emits a 'close' event to the parent component
       */
      const closeModal = () => {
        emit('close');
      };

      return {
        handleOptionClick,
        closeModal
      };
    }
  });
</script>
