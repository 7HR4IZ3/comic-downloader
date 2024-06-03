export type {
  ReaddirOptions, StatOptions,
  ReadFileOptions, WriteFileOptions,
  RmdirOptions
} from "@capacitor/filesystem/dist/esm";

export type WorkerMessage = {
  messageID: Number
  message: {
    action: string
    data: { [index: string]: any }
  };
};

