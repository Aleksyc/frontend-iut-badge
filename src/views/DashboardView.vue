<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">Tableau de bord</h1>
      <p class="text-blue-100">Suivi des pointages des étudiants en télétravail</p>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular color="primary" size="50" width="5" indeterminate></v-progress-circular>
    </div>

    <!-- Statistiques du jour -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Étudiants actifs aujourd'hui" :value=countEtudiantsActifs
        :subtitle="`sur ${countEtudiants} étudiants`" :icon="UsersIcon" icon-class="text-blue-600"
        icon-bg-class="bg-blue-100" />

      <DashboardCard title="Badges aujourd'hui" :value=countDay subtitle="Entrées et sorties" :icon="CreditCardIcon"
        icon-class="text-green-600" icon-bg-class="bg-green-100" />

      <DashboardCard title="Badges cette semaine" :value=countWeek subtitle="7 derniers jours" :icon="CalendarDaysIcon"
        icon-class="text-orange-600" icon-bg-class="bg-orange-100" />

      <DashboardCard title="Total étudiants" :value=countEtudiants subtitle="En stage télétravail" :icon="AcademicCapIcon"
        icon-class="text-purple-600" icon-bg-class="bg-purple-100" />
    </div>

  </div>
</template>

<script setup lang="ts">

import {
  UsersIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  AcademicCapIcon,

} from '@heroicons/vue/24/outline'
import DashboardCard from '../components/DashboardCard.vue'
import { ref, onMounted } from 'vue'
import api from '../services/api.service'

const isLoading = ref(true)
const countEtudiants = ref(0); const countDay = ref(0); const countWeek = ref(0); const countEtudiantsActifs = ref(0)

onMounted(() => {
  loadData()
})

async function loadData() {
  const [countRes, countDayRes, countWeekRes, countActifsRes] = await Promise.all([
    api.getCountEtudiantsDB(),
    api.getCountDayDB(),
    api.getCountWeekDB(),
    api.getCountEtudiantsActifsDB(),
  ])
  countEtudiants.value = (countRes.data as { [key: string]: any })["count-etudiants"]
  countDay.value = (countDayRes.data as { [key: string]: any })["count-day"]
  countWeek.value = (countWeekRes.data as { [key: string]: any })["count-week"]
  countEtudiantsActifs.value = (countActifsRes.data as { [key: string]: any })["count-etudiants-actifs"]
  isLoading.value = false
}


</script>