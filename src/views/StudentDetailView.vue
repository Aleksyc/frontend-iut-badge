<template>
  <div class="space-y-6">
    <!-- En-tête -->
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

    <div v-else-if="student" class="space-y-6">
      <div class="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-2">
        <h2 class="text-3xl font-bold text-gray-900">
          {{ student.prenom_etu }} {{ student.nom_etu.toUpperCase() }}
        </h2>
        <p class="text-sm text-gray-500">Identifiant : #{{ student.id_etu }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Absences cette semaine"
          :value="absencesWeek"
          subtitle="7 derniers jours"
          :icon="CalendarDaysIcon"
          icon-class="text-yellow-600"
          icon-bg-class="bg-yellow-100"
        />

        <DashboardCard
          title="Absences ce mois-ci"
          :value="absencesMonth"
          subtitle="30 derniers jours"
          :icon="CalendarIcon"
          icon-class="text-orange-600"
          icon-bg-class="bg-orange-100"
        />

        <DashboardCard
          title="Absences totales"
          :value="absencesTotal"
          subtitle="Année en cours"
          :icon="ChartBarIcon"
          icon-class="text-red-600"
          icon-bg-class="bg-red-100"
        />
      </div>

      <div class="space-y-3">
        <StudentHistoryList v-if="historyRecords.length" :records="historyRecords" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Student } from '../components/StudentsTable.vue'
import DashboardCard from '../components/DashboardCard.vue'
import StudentHistoryList from '../components/StudentHistoryList.vue'
import api from '../services/api.service'
import { StudentHistoryRecord } from '../components/StudentHistoryList.vue'
import { CalendarDaysIcon, ChartBarIcon} from '@heroicons/vue/24/outline'
import { CalendarIcon } from '@heroicons/vue/24/solid'

interface Props {
  id: string
}

const props = defineProps<Props>()

const student = ref<Student | null>(null)
const historyRecords = ref<StudentHistoryRecord[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

function isAbsent(record: StudentHistoryRecord) {
  return record.statut_presence?.toLowerCase() === 'absent'
}

function parseRecordDate(value: string | null) {
  if (!value) {
    return null
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

// Computed absence metrics for summary cards.
const absencesTotal = computed(() => {
  return historyRecords.value.filter(isAbsent).length
})

function countAbsencesWithin(days: number) {
  const now = Date.now()
  const rangeMs = days * 24 * 60 * 60 * 1000
  return historyRecords.value.reduce((count, record) => {
    if (!isAbsent(record)) {
      return count
    }

    const recordDate = parseRecordDate(record.datetime_pres)
    if (!recordDate) {
      return count
    }

    const diff = now - recordDate.getTime()
    if (diff >= 0 && diff <= rangeMs) {
      return count + 1
    }

    return count
  }, 0)
}

const absencesWeek = computed(() => countAbsencesWithin(7))
const absencesMonth = computed(() => countAbsencesWithin(30))

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
