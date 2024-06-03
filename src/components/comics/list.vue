<template>
  <v-pull-to-refresh
    :pull-down-threshold="100"
    @load="ev => emit('reload', ev)"
  >
    <v-card v-for="item in comics" class="mb-2" rounded="lg" border>
      <comic-list-item
        :chapter="item"
        @delete="$delete(item)"
      ></comic-list-item>
    </v-card>
  </v-pull-to-refresh>
</template>

<style>
.v-pull-to-refresh__scroll-container {
  gap: 1rem;
  display: flex;
  flex-wrap: wrap;
}
</style>

<style scoped>
  div.v-pull-to-refresh {
    width: 100%;
    height: 100%;
  }

  div.v-card {
    width: 100%;
    flex-grow: 1;
  }
</style>

<script setup>
  import { Dialog } from '@capacitor/dialog';

  import { useState } from '../../stores/state';
  import { fs } from "../../workers/filesystem";

  import ComicListItem from "./list-item.vue";

  const state = useState();
  const { comics } = defineProps(['comics']);
  const emit = defineEmits(["reload", "bookmark"]);

  const $delete = async (comic) => {
    const folder = comic.folder ? `${comic.folder.name} ` : "";
    const { value: confirmed } = await Dialog.confirm({
      title: 'Confirm', message:
        `Delete "${folder}${comic.name}"?`
    });

    if (confirmed) {
      await fs.rmdir({
        path: comic.uri,
        recursive: true
      });
      emit("reload");
    }
  };
</script>
