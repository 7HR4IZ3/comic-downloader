import { reactive } from "vue";

export const cache = window['cache'] = reactive(new Map());
export const fsCache = window['fsCache'] = new Map();
