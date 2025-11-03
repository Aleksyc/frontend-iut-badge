<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">Tableau de bord</h1>
      <p class="text-blue-100">Suivi des pointages des étudiants en télétravail</p>
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

    <!-- Statistiques du jour -->
    <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Étudiants actifs aujourd'hui" :value=countEtudiantsActifs
        :subtitle="`sur ${countEtudiants} étudiants`" :icon="UsersIcon" icon-class="text-blue-600"
        icon-bg-class="bg-blue-100" />

      <DashboardCard title="Badges aujourd'hui" :value=countDay subtitle="Entrées et sorties" :icon="CreditCardIcon"
        icon-class="text-green-600" icon-bg-class="bg-green-100" />

      <DashboardCard title="Badges cette semaine" :value=countWeek subtitle="7 derniers jours" :icon="CalendarDaysIcon"
        icon-class="text-orange-600" icon-bg-class="bg-orange-100" />

      <DashboardCard title="Total étudiants" :value=countEtudiants subtitle="En stage télétravail"
        :icon="AcademicCapIcon" icon-class="text-purple-600" icon-bg-class="bg-purple-100" />
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