import { defineStore } from "pinia";

type FabActions = {
  icon: string;
  location?: string;
  onclick?: () => void;
};

type FabOptions = {
  icon?: string;
  shown?: boolean;
  loading?: boolean;
  location?: string;
  action?: () => void;
  actions?: FabActions[]
}

type StackAction = {
  execute(): void;
}

type Menu = {
  icon: string,
  shown: boolean;
  items: Object[];
  images: Object[];
  onclick: (app: any) => void;
};

type AppState = {
  header: string;
  showFab: boolean;
  showAppBar: boolean;
  showFooter: boolean;
  showBottom: boolean;
  showSidebar: boolean;

  menuStack: Menu[];
  fabStack: FabOptions[];
  actionStack: StackAction[];

  layout?: {
    marginTop?: string;
  }
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    header: "Comic Downloader",
    
    fabStack: [{
      action() {}, shown: true, loading: false,
      icon: "mdi-plus", location: "bottom right"
    }],
    actionStack: [],
    
    menuStack: [{
      shown: false, items: [],
      icon: "mdi-dots-vertical", images: [],
      onclick: (app) => app.toggleDrawer(true)
    }],
    
    showFab: true, showAppBar: true,
    showFooter: true, showBottom: false,
    showSidebar: false, layout: { marginTop: "70px" }
  }),

  actions: {
    setFab(options: FabOptions) {
      this.fabStack = [ ...this.fabStack, options ];
      return () => {
        // Ensure there is at least one item in stack.
        if (this.fabStack.length >= 2) {
          // Using .pop dosen't force UI update.
          this.fabStack = this.fabStack.slice(0, -1);
        }
      }
    },

    setMenu(options: Menu) {
      this.menuStack = [ ...this.menuStack, options ];
      return () => {
        if (this.menuStack.length >= 2) {
          this.menuStack = this.menuStack.slice(0, -1);
        }
      }
    },

    setHeader(header: string) {
      this.header = header;
    },

    toggleDrawer(bottom: boolean = true) {
      if (bottom) {
        this.showBottom = !this.showBottom;
      } else {
        this.showSidebar = !this.showSidebar;
      }
    },

    pushAction(action: StackAction) {
      this.actionStack = [ ...this.actionStack, action ];
    }
  },
  getters: {
    fab() {
      return this.fabStack.at(-1);
    },
    menu() {
      return this.menuStack.at(-1);
    }
  }
});
