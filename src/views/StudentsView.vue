<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">Étudiants</h1>
      <p class="text-blue-100">Liste des étudiants en stage en télétravail</p>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular color="primary" size="50" width="5" indeterminate></v-progress-circular>
    </div>

    <!-- Tableau des étudiants -->
    <div v-if="!isLoading">
      <StudentsTable :records="allStudents" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StudentsTable from '../components/StudentsTable.vue';
import { ref, onMounted } from 'vue'
import { Student } from '../components/StudentsTable.vue'
import api from '../services/api.service'

const isLoading = ref(true)
const allStudents = ref<Student[]>([])

onMounted(() => {
  loadData()
})

async function loadData() {
  const [studentsRes] = await Promise.all([
    api.getEtudiantsDB(),
  ])
  allStudents.value = studentsRes.data as Student[]
  isLoading.value = false
}

</script>