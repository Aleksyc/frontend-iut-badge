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
                    <router-link
                      :to="{ name: 'student-detail', params: { id: record.id_etu } }"
                      class="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      #{{ record.id_etu }}
                    </router-link>
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
  <div class="px-6 py-4 border-t border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="text-sm text-gray-500">
      <template v-if="records.length">
        Affichage de {{ startItem }} à {{ endItem }} sur {{ records.length }} étudiants
      </template>
      <template v-else>
        Aucun étudiant à afficher
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

  <!-- Dialogs -->
  <ImportStudentsDialog
    :showImportDialog="showImportDialog"
    :isProcessing="isImportingCsv"
    :errorMessage="importError"
    @cancel="cancelImport"
    @import="confirmImport"
    @reset-error="resetImportError"
  />
  <AddStudentDialog
    :showAddDialog="showAddDialog"
    :isSaving="isSavingAdd"
    :errorMessage="addError"
    @cancel="cancelAdd"
    @save="confirmAdd"
  />
  <DeleteStudentDialog :showDeleteDialog="showDeleteDialog" :studentToDelete="studentToDelete"
    :cancelDelete="cancelDelete" :confirmDelete="confirmDelete" />

  <EditStudentDialog
    :showEditDialog="showEditDialog"
    :studentToEdit="studentToEdit"
    :isSaving="isSavingEdit"
    :errorMessage="editError"
    @cancel="cancelEdit"
    @save="confirmEdit"
  />

  <NotificationToast
    :message="toastMessage"
    :type="toastType"
    :visible="isToastVisible"
    @close="hideToast"
  />

</template>

<script setup lang="ts">

import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import AddStudentDialog from './AddStudentDialog.vue'
import ImportStudentsDialog from './ImportStudentsDialog.vue'
import DeleteStudentDialog from './DeleteStudentDialog.vue'
import EditStudentDialog from './EditStudentDialog.vue'
import NotificationToast from './NotificationToast.vue'
import api from '../services/api.service'
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export interface Student {
  id_etu: number
  nom_etu: string
  prenom_etu: string
  anne_etu: string
  td_etu: string
  tp_etu: string
  id_carte_etu: string
}

type NewStudent = Omit<Student, 'id_etu'>

interface Props {
  records: Array<Student>
}

const props = defineProps<Props>()
const records = props.records

// =================== Notifications ===================

const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const isToastVisible = ref(false)
let toastTimeout: ReturnType<typeof setTimeout> | null = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  isToastVisible.value = true

  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }

  toastTimeout = setTimeout(() => {
    isToastVisible.value = false
    toastTimeout = null
  }, 4000)
}

function hideToast() {
  isToastVisible.value = false
  if (toastTimeout) {
    clearTimeout(toastTimeout)
    toastTimeout = null
  }
}

onBeforeUnmount(() => {
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
})

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

// =================== Modification ===================

const showEditDialog = ref(false)
const studentToEdit = ref<Student | null>(null)
const isSavingEdit = ref(false)
const editError = ref<string | null>(null)

function onEdit(student: Student) {
  studentToEdit.value = { ...student }
  editError.value = null
  showEditDialog.value = true
}

function cancelEdit() {
  showEditDialog.value = false
  studentToEdit.value = null
  editError.value = null
}

async function confirmEdit(updatedStudent: Student) {
  if (!studentToEdit.value) {
    return
  }

  isSavingEdit.value = true
  editError.value = null

  try {
    await api.updateEtudiantDB(updatedStudent.id_etu, {
      nom_etu: updatedStudent.nom_etu,
      prenom_etu: updatedStudent.prenom_etu,
      anne_etu: updatedStudent.anne_etu,
      td_etu: updatedStudent.td_etu,
      tp_etu: updatedStudent.tp_etu,
      id_carte_etu: updatedStudent.id_carte_etu
    })

    const index = records.findIndex(item => item.id_etu === updatedStudent.id_etu)
    if (index !== -1) {
      Object.assign(records[index], updatedStudent)
    }

    showToast('Étudiant mis à jour avec succès', 'success')
    showEditDialog.value = false
    studentToEdit.value = null
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étudiant', error)
    editError.value = 'La mise à jour a échoué. Veuillez réessayer.'
    showToast('La mise à jour a échoué. Veuillez réessayer.', 'error')
  } finally {
    isSavingEdit.value = false
  }
}

// =================== Suppression ===================

const showDeleteDialog = ref(false)
const studentToDelete = ref<Student | null>(null)

function onDelete(student: Student) {
  studentToDelete.value = student
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!studentToDelete.value) {
    return
  }

  const targetId = studentToDelete.value.id_etu

  try {
    await api.deleteEtudiantDB(targetId)

    const index = records.findIndex(item => item.id_etu === targetId)
    if (index !== -1) {
      records.splice(index, 1)
    }

    const newTotalPages = Math.ceil(records.length / pageSize)
    if (newTotalPages === 0) {
      currentPage.value = 1
    } else if (currentPage.value > newTotalPages) {
      currentPage.value = newTotalPages
    }

    showToast('Étudiant supprimé avec succès', 'success')
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant', error)
    showToast('La suppression a échoué. Veuillez réessayer.', 'error')
  } finally {
    showDeleteDialog.value = false
    studentToDelete.value = null
  }
}

function cancelDelete() {
  showDeleteDialog.value = false
  studentToDelete.value = null
}

// =================== Import CSV ===================

const showImportDialog = ref(false)
const isImportingCsv = ref(false)
const importError = ref<string | null>(null)

function importCSV() {
  if (isImportingCsv.value) {
    return
  }
  importError.value = null
  showImportDialog.value = true
}

function cancelImport() {
  if (isImportingCsv.value) {
    return
  }
  showImportDialog.value = false
  importError.value = null
}

function resetImportError() {
  importError.value = null
}

async function confirmImport(students: NewStudent[]) {
  if (!students.length) {
    importError.value = 'Aucun enregistrement valide détecté dans le fichier.'
    showToast('Import impossible : aucune ligne valide détectée.', 'error')
    return
  }

  isImportingCsv.value = true
  importError.value = null

  try {
    const results = await Promise.allSettled(
      students.map(student => api.createEtudiantDB(student))
    )

    let successCount = 0
    let failureCount = 0

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const responseData = result.value?.data as Student | undefined
        if (!responseData || responseData.id_etu === undefined || responseData.id_etu === null) {
          failureCount += 1
          return
        }

        const normalized: Student = {
          id_etu: Number(responseData.id_etu),
          nom_etu: responseData.nom_etu ?? students[index].nom_etu,
          prenom_etu: responseData.prenom_etu ?? students[index].prenom_etu,
          anne_etu: responseData.anne_etu ?? students[index].anne_etu ?? '',
          td_etu: responseData.td_etu ?? students[index].td_etu ?? '',
          tp_etu: responseData.tp_etu ?? students[index].tp_etu ?? '',
          id_carte_etu: responseData.id_carte_etu ?? students[index].id_carte_etu ?? ''
        }

        if (Number.isNaN(normalized.id_etu)) {
          failureCount += 1
          return
        }

        const existingIndex = records.findIndex(item => item.id_etu === normalized.id_etu)
        if (existingIndex !== -1) {
          Object.assign(records[existingIndex], normalized)
        } else {
          records.push(normalized)
        }

        successCount += 1
      } else {
        failureCount += 1
        console.error('Echec import CSV pour la ligne', students[index], result.reason)
      }
    })

    if (successCount === 0) {
      importError.value = 'Aucun étudiant n\'a pu être importé. Vérifiez le fichier CSV.'
      showToast('Aucun étudiant n\'a pu être importé.', 'error')
      return
    }

    const newTotalPages = Math.ceil(records.length / pageSize) || 1
    currentPage.value = newTotalPages

    if (failureCount > 0) {
      const message = `${successCount} étudiant(s) importé(s), ${failureCount} échec(s).`
      importError.value = `${failureCount} enregistrement(s) n'ont pas pu être importés.`
      showToast(message, 'error')
    } else {
      const message = `${successCount} étudiant(s) importé(s) avec succès.`
      importError.value = null
      showToast(message, 'success')
    }

    showImportDialog.value = false
  } catch (error) {
    console.error('Erreur lors de l\'import CSV', error)
    importError.value = 'L\'import a échoué. Veuillez réessayer.'
    showToast('L\'import a échoué. Veuillez réessayer.', 'error')
  } finally {
    isImportingCsv.value = false
  }
}

// =================== Ajout ===================

const showAddDialog = ref(false)
const isSavingAdd = ref(false)
const addError = ref<string | null>(null)

function onAddStudent() {
  addError.value = null
  showAddDialog.value = true
}

function cancelAdd() {
  showAddDialog.value = false
  addError.value = null
}

async function confirmAdd(newStudent: NewStudent) {
  isSavingAdd.value = true
  addError.value = null

  const payload: NewStudent = {
    nom_etu: newStudent.nom_etu,
    prenom_etu: newStudent.prenom_etu,
    anne_etu: newStudent.anne_etu,
    td_etu: newStudent.td_etu,
    tp_etu: newStudent.tp_etu,
    id_carte_etu: newStudent.id_carte_etu
  }

  try {
    const response = await api.createEtudiantDB(payload)
    const createdStudent = response?.data as Student | undefined
    if (!createdStudent) {
      throw new Error('Réponse du serveur invalide')
    }
    const normalizedStudent: Student = {
      ...createdStudent,
      id_etu: Number(createdStudent.id_etu)
    }

    const existingIndex = records.findIndex(item => item.id_etu === normalizedStudent.id_etu)
    if (existingIndex !== -1) {
      Object.assign(records[existingIndex], normalizedStudent)
    } else {
      records.push(normalizedStudent)
    }

    const newTotalPages = Math.ceil(records.length / pageSize) || 1
    currentPage.value = newTotalPages

    showToast('Étudiant ajouté avec succès', 'success')
    showAddDialog.value = false
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'étudiant', error)
    addError.value = 'La création a échoué. Veuillez réessayer.'
    showToast('La création a échoué. Veuillez réessayer.', 'error')
  } finally {
    isSavingAdd.value = false
  }
}
</script>