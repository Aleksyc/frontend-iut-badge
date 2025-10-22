<template>
  <transition name="toast-fade">
    <div
      v-if="visible"
      class="fixed bottom-6 right-6 z-50 max-w-sm w-full"
    >
      <div
        :class="[
          'px-4 py-3 rounded shadow-lg border flex items-start gap-3 text-sm',
          typeClass
        ]"
      >
        <div class="flex-1">
          <p class="font-medium">{{ message }}</p>
        </div>
        <button
          type="button"
          class="text-xs uppercase tracking-wide text-gray-500 hover:text-gray-700"
          @click="$emit('close')"
        >
          Fermer
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message: string
  type: 'success' | 'error'
  visible: boolean
}

const props = defineProps<Props>()

const typeClass = computed(() => {
  if (props.type === 'success') {
    return 'bg-green-50 border-green-200 text-green-800'
  }
  return 'bg-red-50 border-red-200 text-red-800'
})
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
