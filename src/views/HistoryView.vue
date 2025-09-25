<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
      <h1 class="text-3xl font-bold mb-2">Historique des badges</h1>
      <p class="text-blue-100">Consultation de tous les enregistrements de pointage</p>
    </div>
  </div>

  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="firstname"
            :counter="10"
            :active="true"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="lastname"
            :counter="10"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="email"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">  
import { ref } from 'vue'

const valid = ref(false)
const firstname = ref('Alexis')
const lastname = ref('Dupont')
const email = ref('alexis.dupont@example.com')


</script>



