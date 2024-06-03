import { Directory, Filesystem } from "@capacitor/filesystem/dist/esm";

import { useSettings } from "../stores/settings";
import { fs } from "../workers/filesystem";

window["Filesystem"] = Filesystem;

export default async function () {
  const settings = useSettings();
  await settings.loadConfig();

  if (
    (await Filesystem.checkPermissions())
      .publicStorage !== "granted"
  ) {
    await Filesystem.requestPermissions();
  }

  await fs.setup({
    path: settings.directory,
    directory: Directory.ExternalStorage
  });
}
