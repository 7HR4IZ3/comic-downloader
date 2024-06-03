<template>
  <div class="progress">
    <v-progress-linear v-model="percentage" striped height="25">
      <strong :style="'color: ' + (percentage <= 50 ? 'white' : 'black')"
        >{{ Math.ceil(percentage) }}%</strong
      >
    </v-progress-linear>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";

const color = ref("white");
const count = defineModel("count");
const percentage = defineModel("percentage");
</script>
