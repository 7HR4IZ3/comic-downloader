<template>
  <v-layout>
    <top-bar></top-bar>

    <v-main>
      <RouterView />
      <v-fab
        class="me-4"
        :app="true"
        :icon="app.fab.icon"
        :active="app.fab.shown"
        :location="app.fab.location"
        @click.stop="app.fab.action"
      ></v-fab>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { useAppStore } from './stores/app';
  import TopBar from './components/shared/appbar/topbar.vue';

  const app = useAppStore();
</script>
