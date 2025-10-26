<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h4 class="text-lg font-semibold text-gray-900">Historique des présences</h4>
        <p class="text-sm text-gray-500">
          {{ totalCount }} enregistrement{{ totalCount > 1 ? 's' : '' }}
        </p>
      </div>
    </div>
    <ul class="divide-y divide-gray-200">
      <li
        v-for="(record, index) in sortedRecords"
        :key="recordKey(record, index)"
        class="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="space-y-1">
          <p class="text-sm font-medium text-gray-900">
            {{ formatDate(record.datetime_pres) }}
            <span v-if="record.datetime_pres" class="ml-2 text-xs text-gray-500">
              {{ formatTime(record.datetime_pres) }}
            </span>
          </p>
        </div>
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
        >
          {{ 'Présent' }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
}

const props = defineProps<Props>()

const sortedRecords = computed(() => {
  const cloned = props.records ? [...props.records] : []
  return cloned.sort((a, b) => toTimestamp(b.datetime_pres) - toTimestamp(a.datetime_pres))
})

const totalCount = computed(() => props.records.length)

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
