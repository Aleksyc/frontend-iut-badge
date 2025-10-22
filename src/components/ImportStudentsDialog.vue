<template>
  <div v-if="isDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
      <h4 class="text-lg font-semibold mb-4">Importer des etudiants</h4>
      <div class="space-y-5">
        <div class="p-4 rounded border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-600">
          <p class="font-medium text-gray-700 mb-2">Format attendu :</p>
          <p>
            Le fichier CSV doit contenir les colonnes suivantes : prenom, nom, (optionnel) annee, td, tp, id_carte.
          </p>
          <p class="mt-1">Les delimiters virgule ou point-virgule sont acceptes.</p>
        </div>
        <div>
          <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="onFileSelected" />
          <button
            type="button"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            @click="triggerFileSelect"
            :disabled="isProcessing"
          >
            Choisir un fichier CSV
          </button>
          <div v-if="fileName" class="mt-2 text-sm text-gray-600">
            Fichier selectionne : {{ fileName }}
          </div>
        </div>
        <div v-if="totalValid > 0" class="space-y-3">
          <div class="text-sm text-gray-600">
            {{ totalValid }} ligne(s) valide(s) prete(s) a etre importee(s).
            <span v-if="totalInvalid"> {{ totalInvalid }} ligne(s) ignoree(s) apres validation.</span>
          </div>
          <div class="border border-gray-200 rounded overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50 text-gray-700">
                <tr>
                  <th class="px-4 py-2 text-left font-medium">Prenom</th>
                  <th class="px-4 py-2 text-left font-medium">Nom</th>
                  <th class="px-4 py-2 text-left font-medium">Annee</th>
                  <th class="px-4 py-2 text-left font-medium">TD</th>
                  <th class="px-4 py-2 text-left font-medium">TP</th>
                  <th class="px-4 py-2 text-left font-medium">Carte</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(row, index) in previewRows" :key="index" class="bg-white">
                  <td class="px-4 py-2 text-gray-900">{{ row.prenom_etu }}</td>
                  <td class="px-4 py-2 text-gray-900">{{ row.nom_etu }}</td>
                  <td class="px-4 py-2 text-gray-600">{{ row.anne_etu }}</td>
                  <td class="px-4 py-2 text-gray-600">{{ row.td_etu }}</td>
                  <td class="px-4 py-2 text-gray-600">{{ row.tp_etu }}</td>
                  <td class="px-4 py-2 text-gray-600">{{ row.id_carte_etu }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="hasMorePreview" class="text-xs text-gray-500">
            Apercu limite aux 5 premieres lignes du fichier.
          </div>
        </div>
        <p v-else-if="fileName && !activeError" class="text-sm text-gray-500">
          Aucune ligne valide detectee dans ce fichier.
        </p>
        <p v-if="activeError" class="text-sm text-red-600">{{ activeError }}</p>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-70"
          @click="handleCancel"
          :disabled="isProcessing"
        >
          Annuler
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          @click="handleImport"
          :disabled="!isReady || isProcessing"
        >
          <span v-if="!isProcessing">Importer</span>
          <span v-else>Import en cours...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Student } from './StudentsTable.vue'

type NewStudent = Omit<Student, 'id_etu'>

interface Props {
  showImportDialog: boolean
  isProcessing: boolean
  errorMessage: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'import', value: NewStudent[]): void
  (e: 'reset-error'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')
const parsedStudents = ref<NewStudent[]>([])
const invalidCount = ref(0)
const localError = ref<string | null>(null)

const isDialogVisible = computed(() => props.showImportDialog)
const isProcessing = computed(() => props.isProcessing)
const externalError = computed(() => props.errorMessage)
const activeError = computed(() => localError.value || externalError.value || null)

const totalValid = computed(() => parsedStudents.value.length)
const totalInvalid = computed(() => invalidCount.value)
const previewRows = computed(() => parsedStudents.value.slice(0, 5))
const hasMorePreview = computed(() => totalValid.value > previewRows.value.length)
const isReady = computed(() => totalValid.value > 0)

watch(isDialogVisible, visible => {
  if (visible) {
    resetState()
    emit('reset-error')
  }
})

function resetState() {
  fileName.value = ''
  parsedStudents.value = []
  invalidCount.value = 0
  localError.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function triggerFileSelect() {
  if (isProcessing.value) {
    return
  }
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) {
    return
  }

  emit('reset-error')
  localError.value = null
  parsedStudents.value = []
  invalidCount.value = 0

  if (!file.name.toLowerCase().endsWith('.csv')) {
    localError.value = 'Format invalide. Selectionnez un fichier .csv.'
    fileInput.value && (fileInput.value.value = '')
    return
  }

  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = e => {
    const text = (e.target?.result as string) ?? ''
    parseCsv(text)
  }
  reader.onerror = () => {
    localError.value = 'Lecture du fichier impossible.'
    parsedStudents.value = []
    invalidCount.value = 0
  }
  reader.readAsText(file)
}

function parseCsv(content: string) {
  parsedStudents.value = []
  invalidCount.value = 0
  localError.value = null

  let lines = content.split(/\r?\n/)
  lines = lines.map(line => line).filter((line, index) => {
    if (index === 0) {
      return true
    }
    return line.trim().length > 0
  })

  while (lines.length && lines[0].trim().length === 0) {
    lines.shift()
  }

  if (!lines.length) {
    localError.value = 'Le fichier ne contient aucune donnee.'
    return
  }

  const headerLine = lines.shift()?.replace(/^\uFEFF/, '') ?? ''
  const delimiter = detectDelimiter(headerLine)
  const headers = splitCsvLine(headerLine, delimiter).map(normalizeHeader)
  const columnIndex: Partial<Record<keyof NewStudent, number>> = {}

  headers.forEach((header, index) => {
    const mapped = mapHeader(header)
    if (mapped && columnIndex[mapped] === undefined) {
      columnIndex[mapped] = index
    }
  })

  const requiredColumns: Array<keyof NewStudent> = ['prenom_etu', 'nom_etu']
  const missing = requiredColumns.filter(key => columnIndex[key] === undefined)
  if (missing.length) {
    localError.value = `Colonnes obligatoires manquantes : ${missing.join(', ')}`
    return
  }

  for (const rawLine of lines) {
    if (!rawLine.trim()) {
      continue
    }
    const columns = splitCsvLine(rawLine, delimiter)
    const student: NewStudent = {
      prenom_etu: extractValue(columns, columnIndex.prenom_etu),
      nom_etu: extractValue(columns, columnIndex.nom_etu),
      anne_etu: extractValue(columns, columnIndex.anne_etu),
      td_etu: extractValue(columns, columnIndex.td_etu),
      tp_etu: extractValue(columns, columnIndex.tp_etu),
      id_carte_etu: extractValue(columns, columnIndex.id_carte_etu)
    }

    if (!student.prenom_etu || !student.nom_etu) {
      invalidCount.value += 1
      continue
    }

    parsedStudents.value.push(student)
  }

  if (!parsedStudents.value.length) {
    localError.value = 'Aucune ligne valide detectee dans ce fichier.'
  }
}

function detectDelimiter(header: string): string {
  const commaCount = (header.match(/,/g) ?? []).length
  const semicolonCount = (header.match(/;/g) ?? []).length
  if (semicolonCount > commaCount) {
    return ';'
  }
  if (commaCount > 0) {
    return ','
  }
  return ';'
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let insideQuotes = false

  for (let index = 0; index < line.length; index++) {
    const char = line[index]

    if (char === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        insideQuotes = !insideQuotes
      }
      continue
    }

    if (char === delimiter && !insideQuotes) {
      result.push(current.replace(/\r$/, '').trim())
      current = ''
      continue
    }

    current += char
  }

  result.push(current.replace(/\r$/, '').trim())
  return result
}

function normalizeHeader(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
}

function mapHeader(header: string): keyof NewStudent | undefined {
  const headerAliases: Record<string, keyof NewStudent> = {
    prenom: 'prenom_etu',
    prenom_etu: 'prenom_etu',
    nom: 'nom_etu',
    nom_etu: 'nom_etu',
    annee: 'anne_etu',
    anne_etu: 'anne_etu',
    td: 'td_etu',
    td_etu: 'td_etu',
    tp: 'tp_etu',
    tp_etu: 'tp_etu',
    id_carte: 'id_carte_etu',
    id_carte_etu: 'id_carte_etu',
    carte: 'id_carte_etu',
    carte_etudiante: 'id_carte_etu',
    numero_carte: 'id_carte_etu',
    numero_carte_etudiante: 'id_carte_etu'
  }

  return headerAliases[header]
}

function extractValue(columns: string[], index: number | undefined): string {
  if (index === undefined) {
    return ''
  }
  const value = columns[index] ?? ''
  return value.trim()
}

function handleCancel() {
  resetState()
  emit('reset-error')
  emit('cancel')
}

function handleImport() {
  if (!parsedStudents.value.length || isProcessing.value) {
    if (!parsedStudents.value.length) {
      localError.value = 'Selectionnez un fichier CSV valide avant d\'importer.'
    }
    return
  }

  emit('import', parsedStudents.value.map(student => ({ ...student })))
}
</script>
