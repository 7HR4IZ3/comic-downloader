import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'

import { router } from "./router/index.ts"
import { md3 as blueprint } from 'vuetify/blueprints'

import App from './App.vue'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { VFab } from 'vuetify/labs/VFab'

import 'vuetify/styles';
import './css/style.css';
import '@mdi/font/css/materialdesignicons.css';


const pinia = createPinia();
const vuetify = createVuetify({
  blueprint, directives,
  components: { ...components, VFab }
});

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app');
