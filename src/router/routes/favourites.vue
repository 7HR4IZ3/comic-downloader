<template>
  <v-container>
    <v-row dense id="comics">
      <comic-list
        v-if="comics.length"
        :comics="comics"
        @reload="reloadComics"
        :hideDelete="true"
      ></comic-list>

      <template v-else>
        <v-col cols="12" style="margin-top: 6rem;">
          <v-icon>mdi-archive-alert</v-icon>
        </v-col>
        <v-col> No bookmark available </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
i.v-icon {
  font-size: calc(var(--v-icon-size-multiplier) * 5em);
}

div.v-row {
  margin-top: 3rem;
}

div.v-col {
  display: flex;
  justify-content: center;
}
</style>

<script setup>
  import { ref } from "vue";
  
  import { useState } from "../../stores/state";
  import { useAppStore } from "../../stores/app";
  import { useSettings } from "../../stores/settings";

  import ComicList from "../../components/comics/list.vue";

  const state = useState();
  const settings = useSettings();

  const comics = ref(state.bookmarks.filter(item => {
    return item.type === "chapter";
  }));

  const app = useAppStore();
  app.setHeader("Favourites");

  const revert = app.setFab({
    icon: "mdi-content-save",
    shown: false, action() {}
  });

  function reloadComics() {}
</script>
