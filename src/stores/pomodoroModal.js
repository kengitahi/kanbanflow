import { defineStore } from 'pinia';


export const usePomodoroModalStore = defineStore('pomodoroModal', {
  // State: holds the reactive data for the store
  state: () => ({
    showModal: false,
    selectedOption: null
  }),


  actions: {
    /**
     * Opens the modal by setting showModal to true.
     */
    openModal() {
      this.showModal = true;
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
