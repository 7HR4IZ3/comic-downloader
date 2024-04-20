<template>
  <v-layout>
    <top-bar></top-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup>
  import TopBar from './components/shared/appbar/topbar.vue';
</script>
