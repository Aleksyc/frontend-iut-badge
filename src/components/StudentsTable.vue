<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Liste des étudiants</h3>
        <div class="text-sm text-gray-500">Total : {{ records.length }} étudiants</div>
      </div>
      <div class="flex gap-3">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 text-base"
          @click="onAddStudent">
          <span>Ajouter</span>
          <PlusIcon class="w-5 h-5" />
        </button>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow flex items-center gap-2 text-base"
          @click="importCSV">
          <span>Importer CSV</span>
          <PlusIcon class="w-5 h-5" />
        </button>
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
              <DocumentIcon class="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="text-center">
    <v-pagination :length="totalPages" v-model="currentPage" size="small" @input="onPageChange"></v-pagination>
  </div>

  <!-- Dialog de confirmation de suppression -->
  <DeleteStudentDialog :showDeleteDialog="showDeleteDialog" :studentToDelete="studentToDelete"
    :cancelDelete="cancelDelete" :confirmDelete="confirmDelete" />

</template>

<script setup lang="ts">

import { PencilIcon, TrashIcon, PlusIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import DeleteStudentDialog from './DeleteStudentDialog.vue'
import api from '../services/api.service'
import { ref, computed } from 'vue'

export interface Student {
  id_etu: number
  nom_etu: string
  prenom_etu: string
  anne_etu: string
  td_etu: string
  tp_etu: string
  id_carte_etu: string
}

interface Props {
  records: Array<Student>
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

// =================== Modification ===================

function onEdit(student: Student) {
  console.log('Modifier', student)
  console.log(student.id_etu)
}

// =================== Suppression ===================

const showDeleteDialog = ref(false)
const studentToDelete = ref<Student | null>(null)

function onDelete(student: Student) {
  studentToDelete.value = student
  showDeleteDialog.value = true
}

function confirmDelete() {
  if (studentToDelete.value) {
    api.deleteEtudiantDB(studentToDelete.value.id_etu)
    showDeleteDialog.value = false
    studentToDelete.value = null
  }
}

function cancelDelete() {
  showDeleteDialog.value = false
  studentToDelete.value = null
}

// =================== Ajout ===================

function onAddStudent() {
  // Action à définir (ouvrir un dialogue, etc.)
  console.log('Ajouter un étudiant')
}

const fileInput = ref<HTMLInputElement | null>(null)

function importCSV() {
  if (!fileInput.value) {
    fileInput.value = document.createElement('input')
    fileInput.value.type = 'file'
    fileInput.value.accept = '.csv'
    fileInput.value.style.display = 'none'
    fileInput.value.addEventListener('change', handleFileSelect)
    document.body.appendChild(fileInput.value)
  }
  fileInput.value.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    // Lecture du fichier CSV et affichage de la première ligne
    const reader = new FileReader()
    reader.onload = function(e) {
      const text = e.target?.result as string
      if (text) {
        const firstLine = text.split(/\r?\n/)[0]
        console.log('Première ligne du CSV:', firstLine)
      }
    }
    reader.readAsText(file)
    console.log('Fichier CSV sélectionné:', file.name)
  }
  input.value = ''
}
</script>