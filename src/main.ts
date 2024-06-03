import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import setup from "./setup/index.ts";
import { router } from "./router/index.ts";

import "vuetify/styles";
import "./css/style.css";
import "@mdi/font/css/materialdesignicons.css";

const pinia = createPinia();

const app = createApp(App)
  .use(pinia).use(router)

setup(app).then(() => app.mount("#app"));
