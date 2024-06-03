<template>
  <v-layout>
    <v-sheet class="mx-auto">
      <v-form validate-on="input lazy" @submit.prevent="submit">
        <v-text-field
          clearable
          label="Comic URL"
          variant="outlined"
          v-model="comicURL"
          :disabled="downloading"
          prepend-icon="mdi-web"
          :error="!validComicURL"
        ></v-text-field>

        <v-text-field
          clearable
          variant="outlined"
          label="Download Path"
          v-model="downloadPath"
          prepend-icon="mdi-folder"
          :error="downloadPathExists"
          :disabled="!loadedImages || downloading"
        ></v-text-field>
      </v-form>

      <download-progress
        v-if="downloading"
        v-model:count="downloadCount"
        v-model:percentage="percentage"
      ></download-progress>
    </v-sheet>
    <v-sheet id="configurations">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template v-slot:default="{}">
              <v-row no-gutters>
                <v-col class="d-flex justify-start" cols="4">Images</v-col>
                <v-col class="text-grey" cols="8">
                  <v-fade-transition leave-absolute>
                    <span key="0" v-if="images.length">
                      Image to download ({{ selections.length }} of
                      {{ images.length }})
                    </span>
                    <span v-else>No images found</span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </template>
            <template v-slot:actions="{ expanded }">
              <v-icon icon="mdi-image"></v-icon>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card flat>
              <v-card-text>
                <image-select
                  v-model:images="images"
                  v-model:selection="selections"
                ></image-select>
              </v-card-text>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel eager>
          <v-expansion-panel-title>
            <template v-slot:actions="{ expanded }">
              <v-icon :icon="expanded ? 'mdi-wrench' : 'mdi-cog'"></v-icon>
            </template>
            <template v-slot:default="{ expanded }">
              <v-row no-gutters>
                <v-col class="d-flex justify-start" cols="4">Config </v-col>
                <v-col class="text-grey" cols="8">
                  <v-fade-transition leave-absolute>
                    <span v-if="expanded" key="0">
                      HTML selector for images to download
                    </span>
                  </v-fade-transition>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-row>
                      <v-col>
                        <v-select
                          v-model="configName"
                          variant="outlined"
                          :items="Object.keys(settings.configs)"
                          label="Scraper Config"
                          @update:modelValue="updateConfig"
                        ></v-select>
                      </v-col>
                      <v-col v-if="isConfigUpdated()" cols="3" class="ave-btn">
                        <v-btn
                          icon="mdi-content-save"
                          @click.stop="saveConfig()"
                        ></v-btn>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="scraperConfig.titleSelector"
                      label="Chaper Title"
                      hide-details
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="scraperConfig.imageSelector"
                      label="Image Selector"
                      hide-details
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="scraperConfig.imageAttribute"
                      label="Image Attribute"
                      hide-details
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template v-slot:default="{}">
              <v-row no-gutters>
                <v-col class="d-flex justify-start" cols="4">Preview</v-col>
              </v-row>
            </template>
            <template v-slot:actions="{ expanded }">
              <v-icon icon="mdi-web"></v-icon>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <iframe ref="iframe" :src="comicURL"></iframe>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-sheet>
  </v-layout>
</template>

<style scoped>
  div.v-card,
  iframe {
    width: 100%;
  }

  iframe {
    height: 100vh;
  }

  .save-btn {
    padding: 1rem 2rem;
  }

  div.v-layout {
    height: 100%;
    display: flex;
    flex-grow: 1;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  div.v-sheet {
    margin: 0;
    width: 100%;
    padding: 1.7rem 3rem;
  }

  div#configurations {
    padding: 1.7rem 0.5rem;
  }
</style>

<script setup>
  import { useRouter } from "vue-router";
  import { ref, watch, defineModel } from "vue";

  import { Dialog } from '@capacitor/dialog';
  import { Filesystem, Directory } from "@capacitor/filesystem";

  import Scraper from "../../scraper";
  import { useAppStore } from "../../stores/app";
  import { useSettings } from "../../stores/settings";
  import { debounce, fetch, ALLOWED_PROTOCOLS } from "../../utils/index";

  import DownloadProgress from "../../components/downloader/progress.vue";
  import ImageSelect from "../../components/downloader/imageselect.vue";

  // http://127.0.0.1:9000
  // https://theeminenceinshadowmanga.com/manga/the-eminence-in-shadow-chapter-52

  let runTimeout;

  const app = useAppStore();
  const router = useRouter();
  const loadedImages = ref(false);

  const revertFab = app.setFab({
    shown: loadedImages,
    icon: "mdi-tray-arrow-down",
    action: () => downloadImages()
  });

  app.setHeader("Download");
  app.pushAction({
    execute: () => {
      revertFab();
      router.back();
    }
  });

  const settings = useSettings();

  const downloading = ref(false);

  const comicURL = ref("");
  const downloadPath = ref("");
  const chapterTitle = ref("");
  const validComicURL = ref(false);
  const downloadPathExists = ref(false);

  const configName = ref("*");
  const scraperConfig = ref({
    ...settings.configs["*"]
  });

  const scraper = window.scraper = new Scraper({
    ...scraperConfig.value, fetch
  });

  const images = ref([]);
  const percentage = ref(1);
  const selections = ref([]);
  const downloaded = ref([]);
  const toDownload = ref([]);
  const downloadCount = ref(1);
  const showDialog = ref(false);

  const resetAllVariables = function () {
    images.value = [];
    selections.value = [];
    downloaded.value = [];
    toDownload.value = [];

    percentage.value = 1;
    downloadCount.value = 1;

    comicURL.value = "";
    chapterTitle.value = "";
    downloadPath.value = "";

    showDialog.value = false;
    downloading.value = false;
    loadedImages.value = false;
    validComicURL.value = false;
    downloadPathExists.value = false;

    configName.value = "*";
    scraperConfig.value = {
      ...settings.configs["*"]
    };
  };

  function updateConfig() {
    const config = settings.configs[configName.value] || {
      ...settings.configs["*"]
    };
    scraperConfig.value = { ...config };
    scraper.updateConfig(scraperConfig.value);
  }

  function saveConfig() {
    if (!validComicURL.value) return;

    let newConfigName = configName.value;
    if (newConfigName === "*") {
      newConfigName = new URL(comicURL.value).origin;
    }

    const config = scraperConfig.value;
    const toSave = {
      imageAttribute: config.imageAttribute,
      imageSelector: config.imageSelector,
      titleSelector: config.titleSelector
    };

    settings.configs[newConfigName] = toSave;
    settings.saveConfig();
  }

  function isConfigUpdated() {
    if (configName.value === "*") return true;

    let config = settings.configs[configName.value];
    if (!config)
      config = { ...settings.configs["*"] };

    return (
      config.titleSelector !== scraperConfig.value.titleSelector ||
      config.imageSelector !== scraperConfig.value.imageSelector ||
      config.imageAttribute !== scraperConfig.value.imageAttribute
    );
  }

  async function runScraper() {
    try {
      const parsed = new URL(comicURL.value);
      const config = scraperConfig.value;

      const $images = new Array();
      const $toDownload = new Array();
      const $selections = new Array();

      loadedImages.value = false;

      scraper.updateConfig(config);
      scraper.config.url = parsed.href;

      await scraper.parse();

      let index = 0;
      for (const image of scraper.selectAll(config.imageSelector)) {
        let url = image.getAttribute(config.imageAttribute);
        if (url) {
          try {
            const { href } = new URL(url, parsed.origin);
            $toDownload.push(href);
            $selections.push(index++);
            $images.push({ src: href });
          } catch (err) {
            // TODO: Proper error handling !!
            console.error(err);
            break;
          }
        }
      }

      images.value = $images;
      selections.value = $selections;
      toDownload.value = $toDownload;

      chapterTitle.value = scraper
        .select(config.titleSelector).innerText;
      downloadPath.value = cleanupPath(
        `${settings.directory}/${chapterTitle.value}`
      );

      Filesystem.stat({
        path: downloadPath.value,
        directory: Directory.ExternalStorage
      })
        .then(() => {
          downloadPathExists.value = true;
        })
        .catch(() => {
          downloadPathExists.value = false;
        });

      loadedImages.value = true;
    } catch (err) {
      // TODO: Proper error handling !!
      console.error(err);
      loadedImages.value = false;
    }

    // Scraper Timeout cleanup
    runTimeout = null;
  }

  async function downloadImages() {
    downloading.value = true;

    try {
      const imagesLength = images.value.length;

      // if (downloadPathExists.value === false) {
      //   await Filesystem.mkdir({
      //     path: downloadPath.value, recusive: true,
      //     directory: Directory.ExternalStorage
      //   });
      // }

      for (const image of images.value) {
        const count = downloadCount.value;
        const folder = downloadPath.value;

        let src = image.src;

        // if (location.origin === "http://localhost:5173") {
        //   src = "http://localhost:8080/" + encodeURI(src);
        // }

        const file = await Filesystem.downloadFile({
          url: src, progress: true,
          recursive: true, path: `${folder}/${count}.jpg`,
          directory: Directory.ExternalStorage
        });

        downloaded.value = [...downloaded.value, file];
        downloadCount.value++;

        percentage.value = (downloaded.value.length / imagesLength) * 100;
      }
    } catch (err) {
      console.error(err);
    } finally {
      downloading.value = false;

      // TODO: Replace with dialog
      await Dialog.alert({
        title: 'Complete',
        message: 'Download Finished',
      });

      resetAllVariables();
    }
  }

  function cleanupPath(path) {
    return path.replaceAll(", ", "/");
  }

  const onUrlUpdate = debounce(() => {
    try {
      if (!comicURL.value) return;
      try {
        const url = new URL(comicURL.value);
        if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
          configName.value = "*";
          validComicURL.value = false;
        } else {
          validComicURL.value = true;

          if (settings.configs[url.origin]) {
            configName.value = url.origin;
          } else {
            configName.value = "*";
          }
        }
      } catch {
        configName.value = "*";
        validComicURL.value = false;
      }
    } catch {
      return;
    }

    updateConfig();
    runScraper();
  }, 500);

  if (comicURL.value) {
    configName.value = new URL(comicURL.value).origin;
    updateConfig();
  }

  watch(comicURL, onUrlUpdate);
  watch(downloadPath, () => {
    Filesystem.stat({
      path: downloadPath.value,
      directory: Directory.ExternalStorage
    })
      .then(() => {
        downloadPathExists.value = true;
      })
      .catch(() => {
        downloadPathExists.value = false;
      });
  });
</script>

<script>
  export default {
    data: vm => ({
      rules: [value => vm.checkApi(value)],
      valid: false,
      loading: false,
      timeout: null
    }),

    methods: {
      async submit(event) {
        if (this.downloading) {
          return (this.downloading = false);
        }

        this.loading = true;
        const results = await event;
        this.loading = false;

        if (results.valid) {
          this.downloading = true;
        } else {
          this.downloading = true;
        }
      },
      async checkApi(url) {
        return new Promise(resolve => {
          if (this.downloading) return resolve(true);

          try {
            const parsed = new URL(url);
            if (parsed.href === url || parsed.href === url + "/") {
              return resolve(true);
            }
          } catch {}

          return resolve("Invalid url");
        });
      }
    }
  };
</script>
