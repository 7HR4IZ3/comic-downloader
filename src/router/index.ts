import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './routes/homepage.vue'
import RecentView from "./routes/recents.vue"
import DownloadView from "./routes/downloads.vue"
import FavouriteView from "./routes/favourites.vue"
import SettingsView from "./routes/settings.vue"

const routes = [
  { path: '/', component: HomeView, name: "homepage" },
  { path: '/recents', component: RecentView, name: "recents" },
  { path: '/downloads', component: DownloadView, name: "downloads" },
  { path: '/favourites', component: FavouriteView, name: "favourites" },
  { path: '/settings', component: SettingsView, name: "settings" },
]

export const router = createRouter({
  routes, history: createMemoryHistory(),
})