<template>
    <div class="space-y-6">
        <!-- En-tête -->
        <div class="bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg shadow-lg p-6 text-white">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold mb-2">Fonctionnement de l'application</h1>
                    <p class="text-blue-100">Description du fonctionnement de l'application</p>
                </div>
                <a
                    href="https://backend-iut-badge.vercel.app/docs"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 bg-white text-gray-900 font-medium py-2 px-4 rounded shadow hover:bg-gray-100 transition"
                >
                    Documentation de l'API
                    <ArrowTopRightOnSquareIcon class="w-5 h-5" />
                </a>
            </div>
        </div>

        <!-- FAQ -->
        <section class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-900">FAQ</h2>
                <p class="text-sm text-gray-500">Questions sur l'utilisation et le fonctionnement de l'application</p>
            </div>

            <dl class="divide-y divide-gray-200">
                <div v-for="(item, index) in faqs" :key="item.question">
                    <dt>
                        <button
                            class="w-full flex items-center justify-between px-6 py-4 text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            @click="toggleFaq(index)"
                            :aria-expanded="openFaqs.has(index)">
                            <span class="text-base font-medium">{{ item.question }}</span>
                            <svg
                                :class="['w-5 h-5 transition-transform duration-200', openFaqs.has(index) ? 'transform rotate-180 text-blue-600' : 'text-gray-400']"
                                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </dt>
                    <dd v-if="openFaqs.has(index)" class="px-6 pb-4 text-sm text-gray-600">
                        <p class="leading-relaxed">{{ item.answer }}</p>
                        <ul v-if="item.points" class="mt-3 space-y-1 list-disc list-inside text-gray-500">
                            <li v-for="point in item.points" :key="point">{{ point }}</li>
                        </ul>
                    </dd>
                </div>
            </dl>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'

interface FaqItem {
    question: string
    answer: string
    points?: string[]
}

const faqs = ref<FaqItem[]>([
    {
        question: "Comment ajouter un étudiant manuellement ?",
        answer: "Depuis la page Etudiants, cliquez sur le bouton Ajouter puis remplissez le formulaire. L'identifiant est généré automatiquement par l'API et un message de confirmation apparaît en bas à droite une fois l'opération réussie.",
        points: [
            "Ouvrir la page Etudiants",
            "Cliquer sur Ajouter",
            "Compléter les champs requis puis valider"
        ]
    },
    {
        question: "Comment importer plusieurs étudiants via CSV ?",
        answer: "Utilisez le bouton Importer CSV. Le fichier doit contenir au minimum les colonnes prenom et nom. Une fois chargé, un aperçu des lignes valides est proposé avant l'envoi à l'API.",
        points: [
            "Cliquer sur Importer CSV et sélectionner le fichier",
            "Vérifier l'aperçu et corriger les lignes rejetées si besoin",
            "Valider l'import pour créer les étudiants"
        ]
    },
    {
        question: "Comment consulter la fiche détaillée d'un étudiant ?",
        answer: "Dans le tableau des étudiants, l'identifiant situé sous le nom est cliquable. Il ouvre une page dédiée affichant les informations complètes de l'étudiant ainsi que son historique de présence.",
    },
    {
        question: "Comment modifier ou supprimer un étudiant ?",
        answer: "Les icônes crayon et corbeille à droite de chaque ligne permettent respectivement d'éditer ou de supprimer un étudiant. Chaque action déclenche un appel à l'API et affiche une notification de succès ou d'erreur.",
        points: [
            "Cliquer sur l'icône crayon pour modifier",
            "Cliquer sur l'icône corbeille pour supprimer",
            "Suivre la notification de confirmation"
        ]
    },
    {
        question: "Où consulter l'historique des présences ?",
        answer: "La page Historique regroupe toutes les présences enregistrées. Elle propose une pagination ainsi que l'affichage détaillé des dates et statuts pour chaque étudiant.",
    }
])

const openFaqs = ref(new Set<number>([-1]))

function toggleFaq(index: number) {
    const next = new Set(openFaqs.value)
    if (next.has(index)) {
        next.delete(index)
    } else {
        next.add(index)
    }
    openFaqs.value = next
}
</script>
