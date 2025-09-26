<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">Historique des badges</h1>
      <p class="text-blue-100">Consultation de tous les enregistrements de pointage</p>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
        <!-- Séparateur vertical -->
        <div class="hidden sm:block h-8 border-l border-gray-300 mx-2"></div>
        <!-- Ajout des inputs de date -->
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
          <button @click="search"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
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

    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular color="primary" size="50" width="5" indeterminate></v-progress-circular>
    </div>

    <!-- Tableau des présences -->
    <div v-if="!isLoading">
      <HistoryTable :records="allStudentsPresence" />
    </div>
  </div>

</template>

<script setup lang="ts">
import HistoryTable from '../components/HistoryTable.vue';
import { HistoryRecord } from '../components/HistoryTable.vue'
import { ref, onMounted } from 'vue'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import api from '../services/api.service'

const isLoading = ref(true)
const allStudentsPresence = ref<HistoryRecord[]>([])

onMounted(() => {
  loadData()
})

async function search() {
  isLoading.value = true
  isLoading.value = false
}

async function loadData() {
  const [studentsPresRes] = await Promise.all([
    api.getEtudiantsPresencesDB(),
  ])
  allStudentsPresence.value = studentsPresRes.data as HistoryRecord[]
  isLoading.value = false
}

// =================== Filtres de recherche ===================

const years = ref(["", "BUT1", "BUT2", "BUT3"])
const tds = ref(["", "TD1", "TD2", "TD3"])
const tps = ref(["", "TP1", "TP2", "TP3"])

const selectedYears = ref(years.value[0])
const selectedTDs = ref(tds.value[0])
const selectedTPs = ref(tps.value[0])

// Ajout des variables pour les dates
const dateStart = ref("")
const dateEnd = ref("")

// =================== Téléchargement CSV ===================

function downloadCSV() {
  const headers = ["ID Étudiant", "Nom", "Prénom", "Année", "TD", "TP", "Numéro carte étudiante"]
  const rows = allStudentsPresence.value.map(student => [
    student.id_etu,
    student.nom_etu,
    student.prenom_etu,
    student.anne_etu,
    student.td_etu,
    student.tp_etu,
    student.id_carte_etu
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
