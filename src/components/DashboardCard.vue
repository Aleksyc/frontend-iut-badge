<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-3xl font-bold" :class="valueClass">{{ value }}</p>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="p-3 rounded-full" :class="iconBgClass">
        <component :is="icon" :class="iconClass" class="h-6 w-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: Component
  iconClass?: string
  iconBgClass?: string
  valueClass?: string
}

withDefaults(defineProps<Props>(), {
  iconClass: 'text-blue-600',
  iconBgClass: 'bg-blue-100',
  valueClass: 'text-gray-900'
})
</script>