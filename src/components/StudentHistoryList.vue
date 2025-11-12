<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h4 class="text-lg font-semibold text-gray-900">{{ props.title }}</h4>
        <p class="text-sm text-gray-500">
          {{ totalCount }} enregistrement{{ totalCount > 1 ? 's' : '' }}
        </p>
      </div>
    </div>
    <ul class="divide-y divide-gray-200">
      <li v-for="(record, index) in paginatedRecords" :key="recordKey(record, index)"
        class="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="text-sm font-medium text-gray-900">
            {{ formatDate(record.datetime_pres) }}
            <span v-if="record.datetime_pres" class="ml-2 text-xs text-gray-500">
              {{ record.statut_presence === 'Présent' ? formatTime(record.datetime_pres) : '' }}
            </span>
          </p>
        </div>
        <span v-if="record.statut_presence === 'Présent'"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 max-w-max"
          style="font-size: 14px;">
          Présent
        </span>
        <span v-else
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 max-w-max"
          style="font-size: 14px;">
          Absent
        </span>
      </li>
    </ul>
  </div>
  <div>
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="goToPreviousPage" :disabled="currentPage === 1">
        Précédent
      </button>
      <div class="flex items-center gap-1">
        <button v-for="page in pageNumbers" :key="page" @click="goToPage(page)" :class="[
          'w-8 h-8 flex items-center justify-center rounded border text-sm transition-colors',
          page === currentPage ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
        ]">
          {{ page }}
        </button>
      </div>
      <button
        class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="goToNextPage" :disabled="currentPage === totalPages">
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

export interface StudentHistoryRecord {
  id_etu: number
  nom_etu: string
  prenom_etu: string
  anne_etu: string
  td_etu: string
  tp_etu: string
  datetime_pres: string | null
  statut_presence: string
}

interface Props {
  records: StudentHistoryRecord[]
  title?: string
  statusLabel?: string
  statusVariant?: 'success' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Historique des présences',
  statusLabel: 'Présent',
  statusVariant: 'success'
})

const sortedRecords = computed(() => {
  const cloned = props.records ? [...props.records] : []
  return cloned.sort((a, b) => toTimestamp(b.datetime_pres) - toTimestamp(a.datetime_pres))
})

const totalCount = computed(() => props.records.length)

const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() => (sortedRecords.value.length ? Math.ceil(sortedRecords.value.length / pageSize) : 0))

const paginatedRecords = computed(() => {
  if (!sortedRecords.value.length) {
    return []
  }
  const clampedPage = Math.min(currentPage.value, totalPages.value || 1)
  const start = (clampedPage - 1) * pageSize
  return sortedRecords.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  if (total === 0) {
    return []
  }
  return Array.from({ length: total }, (_, index) => index + 1)
})

watch(
  () => totalPages.value,
  newTotal => {
    if (newTotal === 0) {
      currentPage.value = 1
      return
    }
    if (currentPage.value > newTotal) {
      currentPage.value = newTotal
    }
  }
)

watch(
  () => props.records,
  () => {
    currentPage.value = 1
  },
  { deep: true }
)

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return
  }
  currentPage.value = page
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

function recordKey(record: StudentHistoryRecord, index: number) {
  return record.datetime_pres ? `${record.id_etu}-${record.datetime_pres}` : `${record.id_etu}-${index}`
}

function toTimestamp(value: string | null): number {
  if (!value) {
    return 0
  }
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed.getTime() : 0
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Date inconnue'
  }
  const parsed = parseISO(value)
  if (!isValid(parsed)) {
    return 'Date inconnue'
  }
  return format(parsed, 'dd MMMM yyyy', { locale: fr })
}

function formatTime(value: string | null): string {
  if (!value) {
    return ''
  }
  const parsed = parseISO(value)
  if (!isValid(parsed)) {
    return ''
  }
  return format(parsed, 'HH:mm', { locale: fr })
}
</script>
