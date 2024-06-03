import { CapacitorHttp } from "@capacitor/core";

const windowFetch = window.fetch;

export const ALLOWED_PROTOCOLS = [
  "http:", "https:"
];

export function base64ToSrc(data) {
  if (data instanceof Blob) {
    return URL.createObjectURL(data);
  }
  return `data:image/png;base64,${data}`;
}

export function debounce(callback, delay = 250) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      callback(...args);
    }, delay);
  };
}

export async function fetch(url) {
  if (location.origin === "http://localhost:5173") {
    const response = await windowFetch(
      "http://localhost:8080/" + encodeURI(url)
    );
    return await response.text();
  }
  return (await CapacitorHttp.get({ url })).data;
}

export function sort(items) {
  return items.sort((a, b) => {
    try {
      if (
        Number(a.title.split(".")[0]) >
        Number(b.title.split(".")[0])
      ) { return 1 };
      return -1;
    } catch { return 0 }
  });
}