<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Liste des étudiants</h3>
        <div class="text-sm text-gray-500">Total : {{ records.length }} étudiants</div>
      </div>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 text-base"
        @click="onAddStudent">
        <span>Ajouter</span>
        <PlusIcon class="w-5 h-5" />
      </button>
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
              Numéro carte étudiante
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="record in paginatedRecords" :key="record.id_etu" class="hover:bg-gray-50 transition-colors">
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ record.id_carte_etu }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
              <PencilIcon class="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700" @click="onEdit(record)" />
              <TrashIcon class="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700" @click="onDelete(record)" />
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
export interface Student {
  id_etu: number
  nom_etu: string
  prenom_etu: string
  anne_etu: string
  td_etu: string
  tp_etu: string
  id_carte_etu: string
}

import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

interface Props {
  records: Array<Student>
}

const props = defineProps<Props>()
const records = props.records

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

function onEdit(student: Student) {
  console.log('Modifier', student)
  console.log(student.id_etu)
}

function onDelete(student: Student) {
  console.log('Supprimer', student)
  console.log(student.id_etu)
}

function onAddStudent() {
  // Action à définir (ouvrir un dialogue, etc.)
  console.log('Ajouter un étudiant')
}
</script>