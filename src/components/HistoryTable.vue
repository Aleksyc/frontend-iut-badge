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
    <div class="text-center">
        <v-pagination :length="totalPages" v-model="currentPage" size="small" @input="onPageChange"></v-pagination>
    </div>

</template>
<script setup lang="ts">

import { ref, computed } from 'vue'

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

const totalPages = computed(() => Math.ceil(records.length / pageSize))

const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return records.slice(start, start + pageSize)
})

function onPageChange(page: number) {
    currentPage.value = page
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
