import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    header: "Comic Downloader",

    showBottom: false,
    showSidebar: false,

    fab: {
      action() {},
      shown: true,
      icon: "mdi-plus",
      location: "bottom right",
    },
  }),

  actions: {
    setFab({ icon, action, location, shown }) {
      icon && (this.fab.icon = icon);
      action && (this.fab.action = action);
      location && (this.fab.location = location);

      if (typeof shown === "boolean") {
        this.fab.shown = shown
      }
    },

    showFab() {  this.fab.shown = true },
    hideFab() { this.fab.shown = false },
    toggleFab() {
      this.fab.shown
        ? this.hideFab()
        : this.showFab()
    },

    setHeader(header: string) {
      this.header = header;
    },

    toggleDrawer(bottom = true) {
      if (bottom) {
        this.showBottom = !this.showBottom;
      } else {
        this.showSidebar = !this.showSidebar;
      }
    },
  }
});
