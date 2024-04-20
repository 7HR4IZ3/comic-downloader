import { defineStore } from 'pinia'

export const useAppStore = defineStore("app", {
  state: () => ({
    header: "Comic Downloader",

    showBottom: false,
    showSidebar: false
  }),

  actions: {
    setHeader(header: string) {
      this.header = header;
    },

    toggleDrawer(bottom=true) {
      if (bottom) {
        this.showBottom = !this.showBottom
      } else {
        this.showSidebar = !this.showSidebar
      }
    }
  }
})