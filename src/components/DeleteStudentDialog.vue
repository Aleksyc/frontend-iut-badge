<template>
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-40">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h4 class="text-lg font-semibold mb-2">Confirmer la suppression</h4>
        <p class="mb-4">Voulez-vous vraiment supprimer l'étudiant <span class="font-bold">{{ studentToDelete?.prenom_etu }} {{ studentToDelete?.nom_etu }}</span> ?</p>
        <div class="flex justify-end gap-2">
          <button @click="cancelDelete" class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Annuler</button>
          <button @click="confirmDelete" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Supprimer</button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Student } from './StudentsTable.vue'

interface Props {
  showDeleteDialog: boolean
  studentToDelete: Student | null
  cancelDelete: () => void
  confirmDelete: () => void
}

defineProps<Props>()

</script>