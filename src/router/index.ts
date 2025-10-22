import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import StudentsView from '../views/StudentsView.vue'
import HistoryView from '../views/HistoryView.vue'
import FonctionnementView from '../views/FonctionnementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/etudiants',
      name: 'students',
      component: StudentsView
    },
    {
      path: '/etudiants/:id',
      name: 'student-detail',
      component: () => import('../views/StudentDetailView.vue'),
      props: true
    },
    {
      path: '/historique',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/fonctionnement',
      name: 'fonctionnement',
      component: FonctionnementView
    }
  ]
})

export default router