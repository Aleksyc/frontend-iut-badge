<template>
  <transition name="toast-fade">
    <div
      v-if="visible"
      class="fixed bottom-6 right-6 z-50 max-w-sm w-full"
    >
      <div
        :class="[
          'px-4 py-3 rounded shadow-lg border flex items-start gap-3 text-sm bg-white text-gray-800',
          containerClass
        ]"
        role="status"
        aria-live="polite"
      >
        <component :is="iconComponent" class="w-5 h-5 mt-0.5" :class="iconClass" aria-hidden="true" />
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ message }}</p>
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
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  message: string
  type: 'success' | 'error'
  visible: boolean
}

const props = defineProps<Props>()

const containerClass = computed(() => {
  return props.type === 'success' ? 'border-green-200' : 'border-red-200'
})

const iconComponent = computed(() => {
  return props.type === 'success' ? CheckCircleIcon : XCircleIcon
})

const iconClass = computed(() => {
  return props.type === 'success' ? 'text-green-500' : 'text-red-500'
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
