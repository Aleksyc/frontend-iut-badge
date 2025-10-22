<template>
  <div v-if="isDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <h4 class="text-lg font-semibold mb-4">Ajouter un étudiant</h4>
      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              id="prenom"
              v-model="form.prenom_etu"
              type="text"
              class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="nom"
              v-model="form.nom_etu"
              type="text"
              class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label for="annee" class="block text-sm font-medium text-gray-700">Année</label>
            <input
              id="annee"
              v-model="form.anne_etu"
              type="text"
              class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="td" class="block text-sm font-medium text-gray-700">TD</label>
            <input
              id="td"
              v-model="form.td_etu"
              type="text"
              class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="tp" class="block text-sm font-medium text-gray-700">TP</label>
            <input
              id="tp"
              v-model="form.tp_etu"
              type="text"
              class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label for="carte" class="block text-sm font-medium text-gray-700">Numéro de carte</label>
            <input
              id="carte"
              v-model="form.id_carte_etu"
              type="text"
              class="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        </div>
        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            @click="handleCancel"
            :disabled="isSaving"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            :disabled="!isValid || isSaving"
          >
            <span v-if="!isSaving">Créer</span>
            <span v-else>Création...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { Student } from './StudentsTable.vue'

type NewStudent = Omit<Student, 'id_etu'>

interface Props {
  showAddDialog: boolean
  isSaving: boolean
  errorMessage: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', value: NewStudent): void
}>()

const emptyForm: NewStudent = {
  nom_etu: '',
  prenom_etu: '',
  anne_etu: '',
  td_etu: '',
  tp_etu: '',
  id_carte_etu: ''
}

const form = reactive<NewStudent>({ ...emptyForm })

function resetForm() {
  Object.assign(form, emptyForm)
}

watch(
  () => props.showAddDialog,
  visible => {
    if (visible) {
      resetForm()
    }
  }
)

const isDialogVisible = computed(() => props.showAddDialog)
const isSaving = computed(() => props.isSaving)
const errorMessage = computed(() => props.errorMessage)

const isValid = computed(() => {
  return (
    form.prenom_etu.trim().length > 0 &&
    form.nom_etu.trim().length > 0
  )
})

function handleCancel() {
  resetForm()
  emit('cancel')
}

function handleSave() {
  if (!isValid.value) {
    return
  }
  emit('save', { ...form })
}
</script>
