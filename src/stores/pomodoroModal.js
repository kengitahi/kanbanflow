import { defineStore } from 'pinia';


export const usePomodoroModalStore = defineStore('pomodoroModal', {
  // State: holds the reactive data for the store
  state: () => ({
    showModal: false,
    selectedOption: null,
    taskName: '', // Store the task name or any other relevant data
  }),


  actions: {
    /**
     * Opens the modal by setting showModal to true.
     */
    openModal(task) {
      this.showModal = true;
      this.taskName = task.name; // Store the task name or any other relevant data
    },

    /**
     * Closes the modal by setting showModal to false.
     */
    closeModal() {
      this.showModal = false;
      this.selectedOption = null; // Reset selected option on close
    },

    /**
     * Handles the logic when an option is selected in the modal.
     *
     * @param {string} option - The identifier of the selected option.
     */
    handleSelectedOption(option) {
      this.selectedOption = option; // Store the selected option

      // You can add more complex logic here based on the option
      // For this example, we'll just close the modal after selection
      this.closeModal();
    }
  },
});
