<template>
  <div class="card-wrapper">
    <v-img :src="thumbnail" height="200" cover></v-img>
  
    <v-card-text @click="viewer()">
      <v-list-item>
        <template v-if="chapter.folder">
          <v-list-item-title>
            {{ chapter.folder.name }}
          </v-list-item-title>
    
          <v-list-item-subtitle>
            {{ chapter.name }}
          </v-list-item-subtitle>
        </template>

        <template v-else>
          <v-list-item-title>
            {{ chapter.name }}
          </v-list-item-title>
        </template>
      </v-list-item>

      <v-card-actions>
        <v-btn
          color="medium-emphasis" size="small"
          :icon="bookmarked ?
            'mdi-star-minus' : 'mdi-star-plus'
          "
          @click.stop="$bookmark()"
        ></v-btn>

        <v-btn
          color="medium-emphasis"
          icon="mdi-share-variant"
          size="small" @click.stop="emit('share')"
        ></v-btn>

        <v-btn
          color="medium-emphasis"
          icon="mdi-delete" size="small"
          @click.stop="emit('delete')"
        ></v-btn>
      </v-card-actions>
    </v-card-text>
  </div>
</template>

<style scoped>
  div.card-wrapper {
    display: flex;
    height: 150px !important;
    flex-wrap: nowrap;
    justify-content: center;
  }

  div.card-wrapper .v-list-item {
    margin: 0;
    display: flex;
    align-items: center;
  }

  div.v-card-text {
    width: 0%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>

<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  import { cache } from "../../stores/cache";
  import { useState } from "../../stores/state";
  import { fs } from "../../workers/filesystem";

  const state = useState();
  const router = useRouter();

  const thumbnail = ref("");
  const bookmarked = ref(false);

  const { chapter } = defineProps(['chapter']);
  const emit = defineEmits(['delete', 'share', 'bookmark']);

  function viewer() {
    cache.set("active-comic", chapter);
    return router.push({ name: "viewer" });
  }

  const bookmark = {
    thumbnail: { uri: chapter.uri },
    uri: chapter.uri, name: chapter.name,
    type: "chapter", folder: chapter.folder
  };

  if (state.bookmarkExists(bookmark)) {
    bookmarked.value = true;
  }

  const $bookmark = function() {
    if (bookmarked.value) {
      state.removeBookmark(bookmark);
      bookmarked.value = false;
    } else {
      state.addBookmark(bookmark);
      bookmarked.value = true;
    }
  }

  fs.readFileAsURL({
    path: chapter.thumbnail.uri
  }).then(url => (thumbnail.value = url));
</script>
