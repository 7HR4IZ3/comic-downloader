<template>
  <v-layout>
    <top-bar></top-bar>

    <v-main class="main text-secondary">
      <router-view v-slot="{ Component, route }">
        <v-expand-transition v-if="!route.meta.subroute">
          <component :is="Component" />
        </v-expand-transition>

        <component v-else :is="Component" />
      </router-view>

    </v-main>
    
    <v-expand-transition>
      <div v-show="app.showFab">
        <v-fab
          icon="mdi-plus"
          v-if="app.fab.loading"
          class="me-4" app active
          @click.stop="app.fab.action"
          :location="app.fab.location || 'bottom right'"
        >
          <v-progress-circular
            indeterminate
          ></v-progress-circular>
        </v-fab>
        
        <v-speed-dial
          v-else-if="app.fab.actions"
          :location="app.fab.location || 'bottom right'"
          :transition="app.fab.transition || 'fade-transition'"
        >
          <template v-slot:activator="{ props }">
            <v-fab
              app v-bind="props"
              :size="app.fab.size"
              :active="app.fab.shown"
              :icon="app.fab.icon || 'mdi-plus'"
            ></v-fab>
          </template>

          <v-btn
            v-for="(action, index) in app.fab.actions"
            :icon="action.icon" :key="index"
            @click="action.onclick"
          ></v-btn>
        </v-speed-dial>
  
        <v-fab
          class="me-4" app v-else
          @click.stop="app.fab.action"
          :icon="app.fab.icon || 'mdi-plus'"
          :active="!app.fab.loading && app.fab.shown"
          :location="app.fab.location || 'bottom right'"
        ></v-fab>
      </div>

    </v-expand-transition>

    <v-expand-transition>
      <v-footer border v-show="app.showFooter">
        Made with ❤ by Thraize
      </v-footer>
    </v-expand-transition>
  </v-layout>
</template>

<style>
main.v-main {
  --v-layout-top: v-bind(app.layout.marginTop) !important;
}
</style>

<style scoped>
v-layout {
  margin: 0;
  height: 100%;
}

.main {
  --v-layout-bottom: 3vh !important;
}

footer.v-footer {
  bottom: 0;
  height: 3vh;
  width: 100%;
  z-index: 1000;
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
}
</style>

<script>
import { useAppStore } from "./stores/app";
import { useSettings } from "./stores/settings";
import TopBar from "./components/appbar/top.vue";

export default {
  components: { TopBar },
  data: () => {
    const app = useAppStore();
    const settings = useSettings();

    return { app, settings };
  },
  created() {
    if (window.matchMedia && this.settings.theme === "system") {
      this.$vuetify.theme.global.name = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches ? "dark" : "light";

      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
          this.$vuetify.theme.global.name = event.matches ? "dark" : "light";
        });
    } else {
      this.$vuetify.theme.global.name =
        this.settings.theme === "dark" ? "dark" : "light";
    }
  },
};
</script>
