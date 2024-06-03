<template>
  <v-card class="mx-auto mt-2">
    <v-tabs v-model="activeTab" color="primary" grow>
      <v-tab value="config">
        <v-icon>mdi-wrench</v-icon>
      </v-tab>

      <v-tab value="preview">
        <v-icon>mdi-web</v-icon>
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab" class="tabs-window">
      <v-window-item key="config" value="config">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot:default="{}">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start" cols="4">Images</v-col>
                  <v-col class="text-grey" cols="8">
                    <v-fade-transition leave-absolute>
                      <span key="0">
                        Image to download ({{ selections.length }} /
                        {{ images.length }})
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:actions="{ expanded }">
                <v-icon :icon="expanded ? 'mdi-pencil' : 'mdi-image'"></v-icon>
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

          <v-expansion-panel :eager="true">
            <v-expansion-panel-title>
              <template v-slot:actions="{ expanded }">
                <v-icon :icon="expanded ? 'mdi-wrench' : 'mdi-cog'"></v-icon>
              </template>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-col class="d-flex justify-start" cols="4">Download Config </v-col>
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
                    <v-col cols="12" md="4">
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
                        <v-col
                          cols="3"
                          class="ave-btn"
                          v-if="isConfigUpdated()"
                        >
                          <v-btn icon="mdi-content-save"></v-btn>
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
        </v-expansion-panels>
      </v-window-item>

      <v-window-item key="preview" value="preview">
        <iframe ref="iframe" :src="comicURL"></iframe>
      </v-window-item>
    </v-window>

    <Dialog
      v-if="showDialog"
      v-model:scraper="scraper"
      v-model:active="showDialog"
      v-model:download="toDownload"
      v-model:config="scraperConfig"
    ></Dialog>
  </v-card>
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
</style>

<script setup>
import { ref, watch, defineModel } from "vue";
import { CapacitorHttp } from "@capacitor/core";

import Scraper from "../../scraper";
import { useAppStore } from "../../stores/app";
import { useSettings } from "../../stores/settings";

import Dialog from "./dialog.vue";

const app = useAppStore();
const settings = useSettings();

const comicURL = defineModel("url");
const started = defineModel("started");

const configName = ref("*");
const scraperConfig = ref({
  imageAttribute: "",
  imageSelector: "",
  titleSelector: "",
});

const scraper = new Scraper({
  ...scraperConfig.value,

  fetch: async (url) => {
    const options = { url };
    const response = await CapacitorHttp.get(options);
    return response.data;
  },
});

const images = ref([]);
const selections = ref([]);
const toDownload = ref([]);
const showDialog = ref(false);

const updateConfig = () => {
  scraperConfig.value = {
    ...(settings.configs[configName.value] || {}),
  };
};

const isConfigUpdated = () => {
  if (configName.value === "*") return true;

  let config = settings.configs[configName.value];
  if (!config)
    config = {
      imageAttribute: "",
      imageSelector: "",
      titleSelector: "",
    };

  return (
    config.titleSelector !== scraperConfig.value.titleSelector ||
    config.imageSelector !== scraperConfig.value.imageSelector ||
    config.imageAttribute !== scraperConfig.value.imageAttribute
  );
};

watch(comicURL, () => {
  try {
    const url = new URL(comicURL.value);

    if (settings.configs[url.origin]) {
      configName.value = url.origin;
    } else {
      configName.value = "*";
    }
  } catch {
    configName.value = "*";
  }

  updateConfig();
  scraper.updateConfig(scraperConfig.value);
});

watch(started, async () => {
  if (started.value) {
    const parsed = new URL(comicURL.value);
    const conf = scraperConfig.value;

    scraper.updateConfig(conf);
    scraper.config.url = parsed.href;

    await scraper.parse();

    images.value = scraper
      .selectAll(conf.imageSelector)
      .map((img) => img.getAttribute(conf.imageAttribute))
      .map((url) => {
        url = new URL(url, parsed.origin);
        return { src: url.href };
      });

    selections.value = images.value.map((_, idx) => idx);

    app.setFab({
      shown: true,
      icon: "mdi-tray-arrow-down",
      action: () => {
        toDownload.value = selections.value.map(
          (idx) => images.value[idx].src
        );
        showDialog.value = true;
      },
    });
  } else {
    images.value = [];
    selections.value = [];
    app.setFab({ shown: false });
  }
});
</script>

<script>
import ImageSelect from "./imageselect.vue";

export default {
  components: { ImageSelect },
  data(vm) {
    return {
      comicURL: "",
      scraper: null,

      configTab: "images",
      activeTab: "config",

      valid: false,
      firstname: "",
      lastname: "",
      nameRules: [
        (value) => {
          if (value) return true;

          return "Name is required.";
        },
        (value) => {
          if (value?.length <= 10) return true;

          return "Name must be less than 10 characters.";
        },
      ],
      email: "",
      emailRules: [
        (value) => {
          if (value) return true;

          return "E-mail is requred.";
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;

          return "E-mail must be valid.";
        },
      ],
    };
  },
};
</script>
