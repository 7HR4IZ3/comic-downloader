<template>
  <v-fade-transition>
    <v-app-bar v-show="app.showAppBar" prominent height="70">
      <template v-if="app.actionStack.length <= 0">
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="app.toggleDrawer(false)"
        ></v-app-bar-nav-icon>
      </template>
      <template v-else>
        <v-app-bar-nav-icon
          variant="text"
          icon="mdi-arrow-left"
          @click.stop="goBack()"
        ></v-app-bar-nav-icon>
      </template>
      <v-toolbar-title>{{ app.header }}</v-toolbar-title>
  
      <v-spacer></v-spacer>
  
      <v-btn
        variant="text" :icon="app.menu.icon"
        @click.stop="app.menu.onclick"
        v-if="app.menu.shown"
      ></v-btn>
    </v-app-bar>
  </v-fade-transition>

  <side-bar
    v-model="app.showSidebar"
    v-if="app.actionStack.length <= 0"
  ></side-bar>

  <bottom-bar
    v-model="app.showBottom"
    v-if="app.menu.shown"
  ></bottom-bar>
</template>

<style scoped>
  div.v-toolbar-title {
    flex-basis: 50%;
  }
</style>

<script setup>
  import { App } from '@capacitor/app';
  import { useRouter } from "vue-router";

  import SideBar from "./side.vue"
  import BottomBar from "./bottom.vue"
  
  import { useAppStore } from '../../stores/app.ts'
  const app = useAppStore();
  const router = useRouter();

  const goBack = (canGoBack) => {
    const action = app.actionStack.pop();
    if (action !== undefined) {
      action.execute();
    } else {
      canGoBack && router.back();
    }
  }

  App.addListener('backButton', ({ canGoBack }) => {
    goBack(canGoBack);
  });
</script>
