// self.window = self;

import {
  Directory, Filesystem, Encoding, FileInfo
} from "@capacitor/filesystem/dist/esm";

import type {
  WorkerMessage, StatOptions, ReaddirOptions,
  ReadFileOptions, RmdirOptions
} from "./types";

import { fsCache } from "../stores/cache";

// self.onmessage = function (event: MessageEvent<WorkerMessage>) {
//   const { messageID, message } = event.data;
//   const { action, data } = message;

//   let promise: null | Promise<any> = null;

//   const resolve = (response: any) =>
//     postMessage({ messageID, response });

//   const reject = (error: any) =>
//     postMessage({ messageID, error });


//   if (action === "readFile") {
//     promise = readFile(data as ReadFileOptions);
//   } if (action === "readFileAsURL") {
//     promise = readFileAsURL(data as ReadFileOptions);
//   } if (action === "readDirectory") {
//     promise = readDirectory(data as ReaddirOptions);
//   } else if (action === "setupStorage") {
//     promise = setupStorage(data as StatOptions);
//   } else if (action === "getStats") {
//     promise = readStats(data as StatOptions);
//   }


//   if (promise !== null) {
//     promise.then(resolve).catch(reject);
//   } else {
//     reject("Invalid action");
//   }
// };

async function readFile(options: ReadFileOptions, force: boolean=false) {
  let value, key = decodeURIComponent(options.path);
  if (!force) {
    if (fsCache.has(key)) { return fsCache.get(key) }
  }

  const { data } = await Filesystem.readFile(options);
  if (data instanceof Blob) {
    value = await data.text();
  } else {
    value = data.toString();
  }
  fsCache.set(key, value);
  return value;
}

async function readFileAsURL(options: ReadFileOptions, force: boolean=false) {
  let value, key = decodeURIComponent(options.path);
  if (!force) {
    if (fsCache.has(key)) { return fsCache.get(key) }
  }

  const { data } = await Filesystem.readFile(options);
  if (data instanceof Blob) {
    value = URL.createObjectURL(data);
  } else {
    value = `data:image/png;base64,${data.toString()}`;
  }
  fsCache.set(key, value);

  return value;
}

async function readDirectory(
  { path, directory }: ReaddirOptions
): Promise<FileInfo[]> {
  const { files } = await Filesystem.readdir({
    path, directory
  });

  return files;
}

async function readStats(options: StatOptions) {
  return await Filesystem.stat(options);
}

async function setupStorage(
  { path, directory }: StatOptions
): Promise<void> {
  try {
    await Filesystem.stat({ path, directory });
  } catch {
    await Filesystem.mkdir({ path, directory });
  }
}

async function removeDirectory(options: RmdirOptions) {
  await Filesystem.rmdir(options)
}

export const fs = {
  setup: setupStorage,
  readdir: readDirectory,

  readFile,
  readFileAsURL,

  stats: readStats,
  rmdir: removeDirectory
};
