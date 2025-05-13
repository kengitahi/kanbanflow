import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define the modal store
export const usePomodoroModalStore = defineStore('pomodoroModal', () => {
  const showModal = ref(false);
  const selectedOption = ref(null);

    function openModal() {
      showModal.value = true;
      console.log('Modal opened via Pinia store.');
    }

    function closeModal() {
      showModal.value = false;
      selectedOption.value = null; // Reset selected option on close
      console.log('Modal closed via Pinia store.');
    }

    function handleSelectedOption(option) {
      selectedOption.value = option; // Store the selected option
      console.log('Option selected via Pinia store:', option);
      // Add more complex logic here based on the option
      // For this example, we'll just close the modal after selection
      closeModal();
    }

  return {
    showModal,
    selectedOption,
    openModal,
    closeModal,
    handleSelectedOption,
  };
});
