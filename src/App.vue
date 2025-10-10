<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <!-- Logo -->
            <div class="flex items-center">
              <CreditCardIcon class="h-8 w-8 text-blue-600 mr-3" />
              <h1 class="text-xl font-bold text-gray-900">Badge IUT</h1>
            </div>

            <!-- Navigation links -->
            <div class="hidden md:flex items-center space-x-4">
              <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="[
                  $route.path === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]">
                <component :is="item.icon" class="h-5 w-5 mr-2" />

                {{ item.name }}
              </router-link>
            </div>
            <div class="h-6 w-px bg-gray-300"></div>
            <div class="hidden md:flex items-center space-x-4">
              <router-link v-for="item in secondNavigation" :key="item.name" :to="item.href"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="[
                  $route.path === item.href
                    ? 'bg-gray-100 text-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]">
                <component :is="item.icon" class="h-5 w-5 mr-2" />

                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              {{ formatCurrentDate() }}
            </span>
            <div class="h-6 w-px bg-gray-300"></div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-600">Système actif</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Navigation mobile -->
    <div class="md:hidden bg-white border-b border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link v-for="item in navigation" :key="item.name" :to="item.href"
          class="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors" :class="[
            $route.path === item.href
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]">
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.name }}
        </router-link>
      </div>
    </div>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1 w-full">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <CreditCardIcon class="h-5 w-5 text-gray-400" />
            <span class="text-sm text-gray-500">Badge IUT © 2025</span>
          </div>
          <div class="text-sm text-gray-500">
            IUT - Suivi des présences en télétravail
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CreditCardIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'


const navigation = [
  { name: 'Tableau de bord', href: '/', icon: ChartBarIcon },
  { name: 'Étudiants', href: '/etudiants', icon: UsersIcon },
  { name: 'Historique', href: '/historique', icon: ClockIcon },
]

const secondNavigation = [
    { name: 'Fonctionnement', href: '/fonctionnement', icon: QuestionMarkCircleIcon }
]

function formatCurrentDate(): string {
  return format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}
</style>