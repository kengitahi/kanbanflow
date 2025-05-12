<template>
  <button
    @click="onClick"
    :class="[
      'px-4 py-2 rounded-lg font-medium mr-2 mb-2 focus:outline-none transition-colors hover:shadow-lg hover:cursor-pointer duration-300',
      variant === 'primary'
        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
        : variant === 'secondary'
          ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
          : variant === 'danger'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : '',
    ]"
  >
    {{ label }}
  </button>
</template>

<script setup>
  // eslint-disable-next-line no-unused-vars
  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger'].includes(value),
    },
    onClick: {
      type: Function,
      required: true,
    },
  });
</script>
