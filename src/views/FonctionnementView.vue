<template>
    <div class="space-y-6">
        <!-- En-tête -->
        <div class="bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg shadow-lg p-6 text-white">
            <h1 class="text-3xl font-bold mb-2">Fonctionnement de l'application</h1>
            <p class="text-blue-100">Description du fonctionnement de l'application</p>
        </div>

        <!-- FAQ -->
        <section class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-900">FAQ</h2>
                <p class="text-sm text-gray-500">Questions fréquentes sur l'utilisation de l'application</p>
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

interface FaqItem {
    question: string
    answer: string
    points?: string[]
}

const faqs = ref<FaqItem[]>([
    {
        question: "Question 0 ?",
        answer: "question 0 réponse",
        points: [
            "point 1",
            "point 2",
            "point 3"
        ]
    },
    {
        question: "Question 1 ?",
        answer: "Question 1 réponse", 
    },
    {
        question: "Question 2 ?",
        answer: "Question 2 réponse"
    },
    {
        question: "Question 3 ?",
        answer: "Question 3 réponse"
    }
])

const openFaqs = ref(new Set<number>([0]))

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
