<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="app.toggleDrawer(false)"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>{{ app.header }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn
      variant="text"
      icon="mdi-dots-vertical"
      @click.stop="app.toggleDrawer(true)"
    ></v-btn>
  </v-app-bar>

  <side-bar v-model="app.showSidebar"></side-bar>
  <bottom-bar v-model="app.showBottom"></bottom-bar>
</template>

<script>
import SideBar from "./sidebar.vue"
import BottomBar from "./bottombar.vue"

import { useAppStore } from '../../../stores/app.ts'

export default {
  components: { SideBar, BottomBar },
  data: () => ({
    app: useAppStore(),
  }),
};
</script>
