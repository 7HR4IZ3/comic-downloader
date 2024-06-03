<template>
  <images-bar
    v-if="showImagesBar"
    v-model:drawer="showImagesBar"
    v-model:images="app.menu.images"
  ></images-bar>

  <v-bottom-sheet v-model="drawer">
    <v-list id="bottom-bar">
      <v-list-item
        v-for="item in app.menu.items"
        :prepend-icon="item.icon"
        :append-icon="item.aicon"
        @click.stop="handleClick(item)"
      >
        <v-divider v-if="item.divider"></v-divider>
        <v-list-item-title v-if="item.title">
          {{ item.title }}
        </v-list-item-title>
        <v-row v-if="item.items">
          <v-col v-for="subitem in item.items">
            <v-list-item
              :prepend-icon="subitem.icon"
              :append-icon="subitem.aicon"
              @click.stop="handleClick(subitem)"
            >
              <v-list-item-title v-if="subitem.title">
                {{ subitem.title }}
              </v-list-item-title>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<style scoped>
  #bottom-bar {
    padding: 2rem;
  }
</style>

<script setup>
  import { ref, watch } from "vue";
  import { useAppStore } from '../../stores/app';
  import { useSettings } from '../../stores/settings';

  import ImagesBar from "../comics/images.vue";
  import { cache } from "../../stores/cache";

  const app = useAppStore();
  const drawer = defineModel();
  const settings = useSettings();

  const showImagesBar = ref(false);
  cache.set("navigator", showImagesBar)

  function handleClick({ id, onclick }) {
    if (onclick) { return onclick() }

    drawer.value = false;
    if (id === "navigator") {
      showImagesBar.value = !showImagesBar.value;
    }
    
  }
  
  watch(drawer, () => {
    if (drawer.value) {
      showImagesBar.value = false;
    }
  })
</script>
