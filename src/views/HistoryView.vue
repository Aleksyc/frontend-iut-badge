<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">Historique des badges</h1>
      <p class="text-blue-100">Consultation de tous les enregistrements de pointage</p>
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

    <!-- Statistiques filtrées -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title="Total enregistrements" :value="isSearching ? totalRecords : '-'"
        :value-class="!isSearching ? 'text-gray-400' : ''" subtitle="Avec filtres appliqués" :icon="CreditCardIcon"
        icon-class="text-blue-600" icon-bg-class="bg-blue-100" />

      <DashboardCard title="Présences" :value="isSearching ? presenceCount : '-'"
        :value-class="!isSearching ? 'text-gray-400' : ''"
        :subtitle="isSearching ? `${presencePercentage}% du total` : '-'" :icon="CheckIcon" icon-class="text-green-600"
        icon-bg-class="bg-green-100" />

      <DashboardCard title="Absences" :value="isSearching ? absenceCount : '-'"
        :value-class="!isSearching ? 'text-gray-400' : ''"
        :subtitle="isSearching ? `${absencePercentage}% du total` : '-'" :icon="XMarkIcon" icon-class="text-orange-600"
        icon-bg-class="bg-orange-100" />
    </div>

    <!-- Filtres et recherche -->
    <div v-if="!isLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">

        <!-- Combobox pour les filtres -->
        <div class="flex items-center">
          <label for="filter" class="mr-2 text-sm text-gray-700">Année :</label>
          <select id="filter" v-model="selectedYears"
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option v-for="option in years" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="filter" class="mr-2 text-sm text-gray-700">TD :</label>
          <select id="filter" v-model="selectedTDs"
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option v-for="option in tds" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="filter" class="mr-2 text-sm text-gray-700">TP :</label>
          <select id="filter" v-model="selectedTPs"
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option v-for="option in tps" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <!-- inputs de date -->
        <div class="flex items-center">
          <label for="dateStart" class="mr-2 text-sm text-gray-700">Du :</label>
          <input id="dateStart" type="date" v-model="dateStart"
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div class="flex items-center">
          <label for="dateEnd" class="mr-2 text-sm text-gray-700">Au :</label>
          <input id="dateEnd" type="date" v-model="dateEnd"
            class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div class="flex gap-2">
          <button @click="search" :disabled="!dateStart || !dateEnd"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': !dateStart || !dateEnd }">
            Rechercher
          </button>

          <!-- Séparateur vertical -->
          <div class="hidden sm:block h-8 border-l border-gray-300 mx-2"></div>
          <button @click="downloadCSV"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <ArrowDownTrayIcon class="w-5 h-5 inline-block mr-1" />
            Exporter CSV

          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des présences -->
    <div v-if="!isLoading && isSearching && allStudentsPresence.length !== 0">
      <HistoryTable :records="allStudentsPresence" />
    </div>

    <div v-if="!isLoading && isSearching && allStudentsPresence.length === 0" class="text-center py-12">
      <p class="text-gray-500">Aucun enregistrement trouvé pour les critères de recherche sélectionnés.</p>
    </div>
  </div>

</template>

<script setup lang="ts">
import HistoryTable from '../components/HistoryTable.vue';
import { HistoryRecord } from '../components/HistoryTable.vue'
import DashboardCard from '../components/DashboardCard.vue'
import { ref, computed } from 'vue'
import { ArrowDownTrayIcon, CreditCardIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import api from '../services/api.service'

const isLoading = ref(false)
const isSearching = ref(false)
const allStudentsPresence = ref<HistoryRecord[]>([])

// =================== Statistiques ===================

const totalRecords = computed(() => allStudentsPresence.value.length)
const presenceCount = computed(() => allStudentsPresence.value.filter(record => record.statut_presence === 'Présent').length)
const absenceCount = computed(() => Math.max(totalRecords.value - presenceCount.value, 0))
const presencePercentage = computed(() => totalRecords.value === 0 ? 0 : Math.round((presenceCount.value / totalRecords.value) * 100))
const absencePercentage = computed(() => totalRecords.value === 0 ? 0 : Math.round((absenceCount.value / totalRecords.value) * 100))

// =================== Filtres de recherche ===================

const years = ref(["", "BUT1", "BUT2", "BUT3"])
const tds = ref(["", "TD1", "TD2", "TD3"])
const tps = ref(["", "TP1", "TP2", "TP3", "TP4"])

const selectedYears = ref(years.value[0])
const selectedTDs = ref(tds.value[0])
const selectedTPs = ref(tps.value[0])
const dateStart = ref("")
const dateEnd = ref("")

function getAllSearchParams(): Record<string, string | any> {
  return {
    'anne_etu': selectedYears.value,
    'td_etu': selectedTDs.value,
    'tp_etu': selectedTPs.value,
    'datetime_pres_start': dateStart.value,
    'datetime_pres_end': dateEnd.value
  }
}

async function search() {
  isLoading.value = true
  const params = getAllSearchParams()
  console.log("Params de recherche :", params)
  const response = await api.postSearchEtudiantDB(params)
  allStudentsPresence.value = response.data as HistoryRecord[]
  isLoading.value = false
  isSearching.value = true
}


// =================== Téléchargement CSV ===================

function downloadCSV() {
  const headers = ["Nom", "Prénom", "Année", "TD", "TP", "Statut", "Date et heure"]
  const rows = allStudentsPresence.value.map(student => [
    student.nom_etu.toUpperCase(),
    student.prenom_etu,
    student.anne_etu,
    student.td_etu,
    student.tp_etu,
    student.statut_presence,
    student.datetime_pres ? new Date(student.datetime_pres).toLocaleString() : ''
  ])

  let csvContent = "data:text/csv;charset=utf-8,"
  csvContent += headers.join(",") + "\n"
  rows.forEach(row => {
    csvContent += row.join(",") + "\n"
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "historique_badges.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>
