<template>
  <div class="flex flex-wrap p-3 justify-center items-center border-b-2 border-gray-300">
      <button
        v-for="(config, mode) in modes"
        :key="mode"
        @click="onModeSelect(mode)"
        :class="[
        'px-3 py-1 rounded-md mr-2 focus:outline-none transition-colors hover:shadow-lg hover:cursor-pointer duration-300',
        currentMode === mode
          ? config.color + ' text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
      ]"
        :disabled="!boardStore.activePomodoro"
        class="disabled:opacity-50 disabled:cursor-not-allowed"
        :title="boardStore.activePomodoro ? 'Click to start ' + config.label : 'Please start a pomodoro session first'"
      >
        {{ config.label }}
      </button>
    </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  import { useBoardStore } from '@/stores/board';

  const boardStore = useBoardStore();

  // Define props
  defineProps({
    modes: {
      type: Object,
      required: true,
    },
    currentMode: {
      type: String,
      required: true,
    },
    onModeSelect: {
      type: Function,
      required: true,
    },
  });
</script>
