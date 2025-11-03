<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <router-link :to="{ name: 'students' }" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
        ← Retour à la liste
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor" />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill" />
      </svg>
    </div>

    <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {{ errorMessage }}
    </div>

    <div v-else-if="student" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ student.prenom_etu }} {{ student.nom_etu.toUpperCase() }}
            </h2>
            <p class="text-sm text-gray-500">Identifiant : #{{ student.id_etu }}</p>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-4 gap-4 text-sm">
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p class="text-gray-500">Année</p>
            <p class="font-medium text-gray-900">{{ student.anne_etu || 'Non renseigné' }}</p>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p class="text-gray-500">TD</p>
            <p class="font-medium text-gray-900">{{ student.td_etu || 'Non renseigné' }}</p>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p class="text-gray-500">TP</p>
            <p class="font-medium text-gray-900">{{ student.tp_etu || 'Non renseigné' }}</p>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p class="text-gray-500">Numéro de carte</p>
            <p class="font-medium text-gray-900">{{ student.id_carte_etu || 'Non renseigné' }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <StudentHistoryList v-if="historyRecords.length" :records="historyRecords" />
        <div v-else class="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-500">
          Aucun enregistrement de présence pour cet étudiant.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Student } from '../components/StudentsTable.vue'
import StudentHistoryList, { StudentHistoryRecord } from '../components/StudentHistoryList.vue'
import api from '../services/api.service'

interface Props {
  id: string
}

const props = defineProps<Props>()

const student = ref<Student | null>(null)
const historyRecords = ref<StudentHistoryRecord[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

async function loadData(studentIdRaw: string) {
  const numericId = Number(studentIdRaw)
  if (!Number.isFinite(numericId) || numericId <= 0) {
    errorMessage.value = 'Identifiant d\'étudiant invalide.'
    student.value = null
    historyRecords.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    const [studentRes, historyRes] = await Promise.all([
      api.getEtudiantDetailsDB(numericId),
      api.getEtudiantHistoryDB(numericId)
    ])

    const studentData = studentRes?.data as Student | undefined
    if (!studentData) {
      throw new Error('Étudiant introuvable')
    }

    student.value = studentData

    const rawHistory = historyRes?.data
    historyRecords.value = Array.isArray(rawHistory)
      ? (rawHistory as StudentHistoryRecord[])
      : []
  } catch (error) {
    console.error('Erreur lors du chargement du détail étudiant', error)
    errorMessage.value = 'Impossible de charger les informations de cet étudiant.'
    student.value = null
    historyRecords.value = []
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  loadData(props.id)
})

watch(
  () => props.id,
  newId => {
    if (newId) {
      loadData(newId)
    }
  }
)
</script>
