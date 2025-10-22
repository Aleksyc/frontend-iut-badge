<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Liste des présences</h3>
                <div class="text-sm text-gray-500">Total : {{ records.length }} enregistrements</div>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Étudiant
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Année
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TD
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TP
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="record in paginatedRecords" :key="record.id_etu"
                        class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div>
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ record.prenom_etu + ' ' + (record.nom_etu).toUpperCase() }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        #{{ record.id_etu }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ record.anne_etu }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ record.td_etu }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ record.tp_etu }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div>
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ record.datetime_pres ? formatDate(record.datetime_pres) : '' }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ record.datetime_pres ? formatTime(record.datetime_pres)  : '' }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                                v-if="record.statut_presence === 'Présent'"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                style="font-size: 14px;">
                                Présent
                            </span>
                            <span
                                v-else
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                style="font-size: 14px;">
                                Absent
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="px-6 py-4 border-t border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-gray-500">
            <template v-if="records.length">
                Affichage de {{ startItem }} à {{ endItem }} sur {{ records.length }} enregistrements
            </template>
            <template v-else>
                Aucun enregistrement à afficher
            </template>
        </div>
        <div v-if="records.length" class="flex items-center gap-2">
            <button
                class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="goToPreviousPage"
                :disabled="currentPage === 1"
            >
                Précédent
            </button>
            <div class="flex items-center gap-1">
                <button
                    v-for="page in pageNumbers"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                        'w-8 h-8 flex items-center justify-center rounded border text-sm transition-colors',
                        page === currentPage ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    ]"
                >
                    {{ page }}
                </button>
            </div>
            <button
                class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="goToNextPage"
                :disabled="currentPage === totalPages"
            >
                Suivant
            </button>
        </div>
    </div>

</template>
<script setup lang="ts">

import { ref, computed, watch } from 'vue'

export interface HistoryRecord {
    id_etu: number
    nom_etu: string
    prenom_etu: string
    anne_etu: string
    td_etu: string
    tp_etu: string
    datetime_pres: string|null
    statut_presence: string
}

interface Props {
    records: Array<HistoryRecord>
}

const props = defineProps<Props>()
const records = props.records

// =================== Pagination ===================

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => (records.length ? Math.ceil(records.length / pageSize) : 0))

watch(totalPages, newTotal => {
    if (newTotal === 0) {
        currentPage.value = 1
        return
    }
    if (currentPage.value > newTotal) {
        currentPage.value = newTotal
    }
})

const paginatedRecords = computed(() => {
    if (!records.length) {
        return []
    }
    const clampedPage = Math.min(currentPage.value, totalPages.value || 1)
    const start = (clampedPage - 1) * pageSize
    return records.slice(start, start + pageSize)
})

const startItem = computed(() => {
    if (!records.length) {
        return 0
    }
    return (currentPage.value - 1) * pageSize + 1
})

const endItem = computed(() => {
    if (!records.length) {
        return 0
    }
    return Math.min(currentPage.value * pageSize, records.length)
})

const pageNumbers = computed(() => {
    const total = totalPages.value
    if (total === 0) {
        return []
    }
    return Array.from({ length: total }, (_, index) => index + 1)
})

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

// =================== Format ===================

import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

function formatDate(timestamp: string): string {
  return format(parseISO(timestamp), 'dd/MM/yyyy', { locale: fr })
}

function formatTime(timestamp: string): string {
  return format(parseISO(timestamp), 'HH:mm', { locale: fr })
}

</script>
