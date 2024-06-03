import { createVuetify } from "vuetify";

import { VPullToRefresh } from 'vuetify/labs/VPullToRefresh'
import { md3 as blueprint } from "vuetify/blueprints";

import dark from "../themes/dark.ts";
import light from "../themes/light.ts";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default function useVuetify(app) {
  const vuetify = createVuetify({
    blueprint, directives,
    components: {
      ...components,
      VPullToRefresh
    },
    theme: { themes: { dark, light } }
  });
  app.use(vuetify);
  return vuetify;
}