<template>
  <v-container>
    <v-text-field
      clearable id="search"
      v-show="showSearch"
      label="Search comics"
      variant="outlined" v-model="filter"
      :error="false" :disabled="false"
      prepend-icon="mdi-magnify"
      @update:modelValue="filterComics"
    ></v-text-field>
    <v-row dense id="comics">
      <template v-if="loading">
        <v-skeleton-loader
          class="mx-auto border"
          type="card-avatar"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto border"
          type="card-avatar"
        ></v-skeleton-loader>
        <v-skeleton-loader
          class="mx-auto border"
          type="card-avatar"
        ></v-skeleton-loader>
      </template>

      <template v-else>
        <comic-list
          v-if="comics.length"
          :comics="comics"
          @reload="reloadComics"
        ></comic-list>
        <template v-else>
          <v-col cols="12" style="margin-top: 6rem;">
            <v-icon>mdi-archive-alert</v-icon>
          </v-col>
          <v-col> No comic available </v-col>
        </template>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
  i.v-icon {
    font-size: calc(var(--v-icon-size-multiplier) * 5em);
  }

  div.v-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #comics {
    gap: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  div.v-skeleton-loader {
    width: 100%;
    flex: 1 0;
  }

  div.v-input {
    top: 50;
    width: 95%;
    z-index: 100;
    margin-inline: 5%;
    position: sticky;
    position: -webkit-sticky; /* Safari */
  }
</style>

<script>
  import { ref } from "vue";
  import { Directory } from "@capacitor/filesystem/dist/esm";
  
  import { debounce } from "../../utils";
  import { cache } from "../../stores/cache";
  import { fs } from "../../workers/filesystem";
  import { useState } from "../../stores/state";
  import { useAppStore } from "../../stores/app";
  import { useSettings } from "../../stores/settings";
  
  import ComicList from "../../components/comics/list.vue";

  const subscriptions = [];
  const state = useState();
  const app = useAppStore();
  const settings = useSettings();

  export default {
    components: { ComicList },
    data: (vm) => {
      app.setHeader("Comics");
      const filterComics = debounce(() => {
        vm.applyFilters();
      });

      const revertFab = app.setFab({
        icon: "mdi-plus", shown: true,
        action: () => {
          vm.$router.push({ name: "create" });
        },
      });
      subscriptions.push(revertFab);

      const revertMenu = app.setMenu({
        icon: "mdi-magnify", shown: true,
        onclick: () => { this.showSearch = !this.showSearch }
      });
      subscriptions.push(revertMenu);

      return {
        comicCount: 0, loading: true, filter: "", showSearch: false,
        filterComics, comics: cache.get("comics") || new Array(),
      }
    },
    async created() {
      if (!this.comics.length) {
        let comics = cache.get("comics");
        if (!comics?.length) {
          comics = await this.loadComics()
        }

        cache.set("comics", comics);
        this.comics = [ ...comics ];
      }
  
      this.loading = false;
    },
    methods: {
      applyFilters() {
        const comics = cache.get("comics");
        const filter = this.filter?.trim();
        if (filter && filter !== "") {
          this.comics = comics.filter(comic => {
            return (
              comic.name.includes(filter) ||
              comic.folder?.includes(filter)
            )
          });
        } else {
          this.comics = [ ...comics ];
        }
      },
      async loadComics() {
        const comics = new Array();
        const files = await fs.readdir({
          path: settings.directory,
          directory: Directory.ExternalStorage,
        });

        for (const item of files) {
          const stat = await fs.stats({ path: item.uri });
  
          if (stat.type === "directory") {
            for (const comic of await this.loadFolder(item)) {
              comics.push(comic);
            }
          }
        };
  
        return comics;
      },
      async loadFolder(folder) {
        const entries = new Array();
        const children = await fs.readdir(
          { path: folder.uri }
        );
  
        for (const [index, child] of children.entries()) {
          const stat = await fs.stats({ path: child.uri });

          if (stat.type === "directory") {
            const images = await fs.readdir(
              { path: child.uri }
            );
            if (!images.length) continue;

            const entry = {
              index: this.comicCount++,
              thumbnail: { uri: images[0].uri },
              folder: {
                uri: folder.uri, name: folder.name
              }, uri: child.uri, name: child.name,
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWRIdwnecwYr8xUYyCUlTpJl37vwxedrOVf_ZUgr3Isw&s"
            };
            entries.push(entry);
          } else {
            const entry = {
              index: this.comicCount++,
              shown: true, thumbnail: { uri: child.uri },
              folder: null, uri: folder.uri, name: folder.name,
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWRIdwnecwYr8xUYyCUlTpJl37vwxedrOVf_ZUgr3Isw&s"
            };
            entries.push(entry);
            break;
          }
        }

        return entries;
      },
      async reloadComics({ done }) {
        // this.loading = true;

        const comics = await this.loadComics();
        cache.set("comics", comics);
        this.applyFilters();

        // this.loading = false;
        done(true);
      }
    },
    unmounted() {
      // subscriptions.map(fn => fn());
    }
  };
</script>
