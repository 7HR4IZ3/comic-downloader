import type { App } from 'vue';
import VueLazyload from 'vue-lazyload';

export default async function(app: App) {
  app.use(VueLazyload);
}
