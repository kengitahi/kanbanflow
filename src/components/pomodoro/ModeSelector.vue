<template>
  <div class="flex flex-wrap justify-center my-4">
    <button
      v-for="(config, mode) in modes"
      :key="mode"
      @click="onModeSelect(mode)"
      :class="[
        'px-3 py-1 rounded-md mr-2 mb-2 focus:outline-none transition-colors hover:shadow-lg hover:cursor-pointer duration-300',
        currentMode === mode
          ? config.color + ' text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700',
      ]"
    >
      {{ config.label }}
    </button>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';

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
