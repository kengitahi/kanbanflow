<template>
  <div class="flex flex-col items-center">
    <div class="text-6xl font-bold mb-4">{{ formattedTime }}</div>
    <div :class="['px-4 py-2 rounded-lg text-white font-medium', modeColor]">{{ modeLabel }}</div>
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
