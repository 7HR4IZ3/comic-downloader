<template>
  <div class="text-center pa-4">
    <v-dialog v-model="active" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="active = false"></v-btn>

          <v-toolbar-title>Save As</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn
              v-if="!downloading"
              text="Save"
              variant="text"
              @click="downloadImages"
            ></v-btn>
            <v-btn
              v-else
              text="Cancel"
              variant="text"
              @click="downloadImages"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <form>
            <v-text-field
              v-model="chapterTitle"
              label="Chapter Name"
              variant="outlined"
              :disabled="downloading"
              required
            ></v-text-field>

            <v-text-field
              v-model="folder"
              label="Folder"
              variant="outlined"
              :disabled="downloading"
              required
            ></v-text-field>
          </form>

          <download-progress
            v-if="downloading"
            v-model:count="downloadCount"
            v-model:percentage="percentage"
          ></download-progress>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DownloadProgress from "./progress.vue";
import { Filesystem, Directory } from "@capacitor/filesystem";

const active = defineModel("active");
const config = defineModel("config");
const scraper = defineModel("scraper");
const download = defineModel("download");

const folder = ref("");
const percentage = ref(1);
const downloaded = ref([]);
const downloadCount = ref(1);
const downloading = ref(false);

const chapterTitle = ref(
  scraper.value.select(
    config.value.titleSelector
  ).text
);

async function downloadImages() {
  downloading.value = true;

  for (const url of download.value) {
    const file = await Filesystem.downloadFile({
      url, recursive: true, progress: true,
      directory: Directory.ExternalStorage,
      path: (
        `Manga/${folder.value}` +
        `/${chapterTitle.value}/${downloadCount.value}.jpg`
      ),
    });

    downloaded.value = [...downloaded.value, file];
    downloadCount.value++;

    percentage.value = (
      downloaded.value.length / download.value.length
    ) * 100;
  }

  downloading.value = false;
  active.value = false;
}
</script>
