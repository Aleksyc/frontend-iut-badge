<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <router-link :to="{ name: 'students' }" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
        ← Retour à la liste
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular color="primary" size="50" width="5" indeterminate></v-progress-circular>
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
