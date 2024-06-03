<template>
  <v-list lines="three">
    <v-list-subheader>General</v-list-subheader>

    <v-list-item value="notifications">
      <v-select
        :items="themeOptions"
        v-model="settings.theme"
        hint="Select application theme"
        label="Theme" item-value="light"
        prepend-icon="mdi-theme-light-dark"
        @update:modelValue="toggleTheme"
      ></v-select>
    </v-list-item>
  </v-list>
</template>

<script>
import { useAppStore } from "../../stores/app";
import { useSettings } from "../../stores/settings";

export default {
  data: () => {
    const app = useAppStore();
    const settings = useSettings();

    const themeOptions = [
      { title: "light" },
      { title: "dark" },
      { title: "system" },
    ];

    const sidebarOptions = [
      { title: "left" },
      { title: "right" },
      { title: "bottom" },
    ];

    return {
      revert: null,
      app, settings,
      themeOptions,
      sidebarOptions
    };
  },
  created() {
    this.app.setHeader("Settings");

    this.revert = this.app.setFab({
      icon: "mdi-content-save",
      shown: true, action() {}
    });
  },
  
  unmounted() {
    this.revert?.();
  },

  methods: {
    toggleTheme() {
      if (window.matchMedia && this.settings.theme === "system") {
        this.$vuetify.theme.global.name = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches ? "dark" : "light";
      } else {
        this.$vuetify.theme.global.name =
          this.settings.theme === "dark" ? "dark" : "light";
      }

      this.settings.saveConfig();
    },
  },
};
</script>
