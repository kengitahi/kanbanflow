import { defineStore } from 'pinia';

export const usePomodoroModalStore = defineStore('pomodoroModal', {
  state: () => ({
    showModal: false,
    selectedOption: null,
    task: '', // Store the task
  }),

  actions: {
    /**
     * Opens the modal by setting showModal to true.
     * @param {Object} task - The task object to be displayed in the modal.
     * @returns {void}
     */
    openModal(task) {
      this.showModal = true;
      this.task = task; // Store the task
    },

    /**
     * Closes the modal by setting showModal to false.
     * Resets the selected option when closing the modal.
     * @returns {void}
     */
    closeModal() {
      this.showModal = false;
      this.selectedOption = null; // Reset selected option on close
    },

    /**
     * Handles the logic when an option is selected in the modal.
     * Updates the selectedOption state and can perform additional actions based on the selection.
     * @param {string} option - The identifier of the selected option.
     */
    handleSelectedOption(option) {
      this.selectedOption = option; // Store the selected option

      // You can add more complex logic here based on the option
      // For now, we'll just close the modal after selection
      this.closeModal();
    },
  },
});
