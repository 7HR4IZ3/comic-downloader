import {
  // createMemoryHistory,
  // createWebHashHistory,
  createWebHistory,
  createRouter
} from "vue-router";
import CreateView from "./subroutes/create.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "homepage",
      component: () => import("./routes/homepage.vue")
    },
    {
      path: "/downloads",
      name: "downloads",
      component: () => import("./routes/downloads.vue")
    },
    {
      path: "/favourites",
      name: "favourites",
      component: () => import("./routes/favourites.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("./routes/settings.vue")
    },

    {
      meta: { subroute: true },
      path: "/viewer", name: "viewer",
      component: () => import("./subroutes/viewer.vue")
    },
    {
      path: "/create",
      name: "create",
      meta: { subroute: true },
      component: CreateView
    }
  ]
});
