<template>
  <div class="flex flex-row p-3 justify-between items-center border-b-2 border-gray-300">
    <p class="text-6xl font-bold">{{ formattedTime }}</p>
    <div class="flex flex-col items-center">
      <p class="text-sm text-gray-500 mb-1 font-semibold">Current Session</p>
      <p :class="['px-4 py-2 rounded-lg text-white font-semibold text-md', modeColor]">{{ modeLabel }}</p>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    formattedTime: {
      type: String,
      required: true,
    },
    modeLabel: {
      type: String,
      required: true,
    },
    modeColor: {
      type: String,
      required: true,
    },
  });
</script>
