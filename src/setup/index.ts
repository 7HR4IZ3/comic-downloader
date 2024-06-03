import type { App } from "vue";
import { useState } from "../stores/state.ts";

export default async function (app: App) {
  const { default: vuetify } = await import("./vuetify.ts");
  vuetify(app);

  const { default: components } = await import("./components.ts");
  await components(app);

  const { default: storage } = await import("./storage.ts");
  await storage();

  const state = useState();
  await state.load();
}
