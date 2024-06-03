// import type { ReaddirOptions, StatOptions, WorkerMessage } from "./types";

// // @ts-ignore: Vite helper from web workers
// import FSWorker from "./filesystem.ts?worker";

// const fsWorker = new FSWorker();

// // const fsWorker = new Worker(
// //   new URL('./filesystem.ts', import.meta.url),
// //   { type: 'module' }
// // );

// // const fsSrc = "/assets/filesystem.js";
// // const fsWorker = new Worker(new URL(fsSrc, import.meta.url));

// const messageQueue = new Map();

// fsWorker.onmessage = function ({ data }) {
//   const { messageID, response, error } = data;
//   const responder = messageQueue.get(messageID);

//   if (responder) responder({ response, error });
// };

// function generateRandomID(length = 6) {
//   return Math.random()
//     .toString(36)
//     .substring(2, length + 2);
// }

// function sendMessage(worker: Worker, message: WorkerMessage["message"]) {
//   return new Promise((resolve, reject) => {
//     const messageID = generateRandomID();

//     messageQueue.set(messageID, ({ response, error }) => {
//       if (error) reject(error);
//       else resolve(response);

//       messageQueue.delete(messageID);
//     });
//     worker.postMessage({ messageID, message });
//   });
// }

// export const fs = {
//   setup(options: StatOptions) {
//     return sendMessage(fsWorker, { action: "setupStorage", data: options });
//   },

//   readdir(options: ReaddirOptions) {
//     return sendMessage(fsWorker, { action: "readDirectory", data: options });
//   },

//   readFile(options: ReadFileOptions) {
//     return sendMessage(fsWorker, { action: "readFile", data: options });
//   },

//   readFileAsURL(options: ReadFileOptions) {
//     return sendMessage(fsWorker, { action: "readFileAsURL", data: options });
//   },

//   stats(options: StatOptions) {
//     return sendMessage(fsWorker, { action: "getStats", data: options });
//   }
// };

// window["fs"] = fs;