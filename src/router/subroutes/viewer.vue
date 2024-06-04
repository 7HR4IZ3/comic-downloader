<template>
  <span id="topRef"></span>
  <v-container v-if="loading" style="height: 400px">
    <v-row
      align-content="center"
      class="fill-height text-secondary"
      justify="center"
    >
      <v-col class="text-center" cols="12"> Loading Images </v-col>
      <v-col cols="6">
        <v-progress-linear height="6" indeterminate rounded></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row v-if="!images.length">
      <v-col cols="12" style="margin-top: 6rem">
        <v-icon>mdi-archive-alert</v-icon>
      </v-col>
      <v-col> No comic specified </v-col>
    </v-row>

    <v-row v-else v-for="image in images">
      <v-img
        class="lazy" v-if="image.src"
        :filename="image.title" :src="image.src"
        @click="toggleNavigator"
        @contextmenu.prevent="showDialog(image)"
      ></v-img>
    </v-row>
  </v-container>

  <v-bottom-sheet v-model="showContext">
    <v-list class="bottom-bar">
      <v-list-item
        v-for="item in contextMenu"
        
        :prepend-icon="item.icon"
      >
        <v-divider v-if="item.divider"></v-divider>
        <v-list-item-title v-if="item.title">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<style scoped>
.v-img {
  margin-bottom: v-bind(imageMargin);
}

.bottom-bar {
  padding: 2rem;
}

div.v-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

<script>
import { computed, ref } from "vue";
import { sort } from "../../utils";
import { cache } from "../../stores/cache";
import { fs } from "../../workers/filesystem";
import { useAppStore } from "../../stores/app";
import { useState } from "../../stores/state";

const state = useState();
const app = useAppStore();

export default {
  data: (vm) => ({
    images: [], app,
    bookmarked: false,
    showContext: false,
    loading: true, image: null,
    imageMargin: state.imageMargin || "1px",
    contextMenu: [
      { title: "Export", icon: "mdi-share" },
      {
        title: "Bookmark",
        icon: computed(() => (
          vm.bookmarked ?
            'mdi-star-minus': 'mdi-star-plus'
        )),
        onclick: () => vm.bookmark()
      },
      { title: "Delete", icon: "mdi-trash" },
    ],
  }),
  async created() {
    app.layout.marginTop = "0px";
    const comic = cache.get("active-comic");

    app.setFab({
      icon: "mdi-arrow-right",
      shown: computed(() => {
        return state.comics?.length >= 1
      }), action: () => {
        const comics = state.comics;
        if (comics?.length) {
          this.loadComic(comics[0]);
          this.initialize();
        }
      }
    });
    app.setHeader("Comic Viewer");

    if (comic) { await this.loadComic(comic) }
    else if (this.$route.query.uri) {
      const images = [];
      const uri = decodeURI(this.$route.query.uri);

      const splits = uri.split("/");
      const [name, folder] = [splits.at(-1), splits.at(-2)];

      const files = await fs.readdir({ path: uri });
      const promises = [];

      app.setHeader(decodeURI(`${name}${folder ? ": " + folder : ""}`));

      for (const file of files) {
        const entry = {
          title: file.name,
          src: ref(file.uri),
        };
        images.push(entry);

        promises.push(
          fs
            .readFileAsURL({ path: entry.src.value })
            .then((src) => (entry.src.value = src))
        );
      }

      this.images = sort(images);

      Promise.all(promises).then(() => {
        this.loading = false;
      });
    } else {
      this.loading = false;
      return app.pushAction({ execute: () => this.$router.back() });
    }

    this.initialize();
  },

  methods: {
    initialize() {
      app.setFab({
        icon: "mdi-menu",
        shown: true,
        actions: [
          {
            icon: "mdi-chevron-up",
            onclick: () => {
              document
                .querySelector("#topRef")
                ?.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: "mdi-share",
            onclick: () => {},
          },
          {
            icon: computed(() => (
              this.bookmarked ?
                'mdi-star-minus': 'mdi-star-plus'
            )),
            onclick: () => this.bookmark()
          },
          {
            icon: "mdi-arrow-left-bold",
            /* inactive: computed(() => {
              const comic = cache.get("active-comic");
              if (comic) return comic.index === 0;
            }), */
            onclick: () => {
              const comics = cache.get("comics") || state.comics;
              const comic = cache.get("active-comic");
              const previous = comics[comic.index - 1];
              if (previous && previous !== comic)
                this.loadComic(previous);
            },
          },
          {
            icon: "mdi-arrow-right-bold",
            /* inactive: computed(() => {
              const comics = cache.get("comics") || state.comics;
              const comic = cache.get("active-comic");
              if (comic) return comic.index >= comics.length - 1;
            }), */
            onclick: () => {
              const comics = cache.get("comics") || state.comics;
              const comic = cache.get("active-comic");
              const next = comics[comic.index + 1];
              if (next && next !== comic)
                this.loadComic(next);
            },
          },
        ],
      });
  
      const revertMenu = app.setMenu({
        onclick: () => app.toggleDrawer(true),
        shown: true, icon: "mdi-dots-vertical",
        items: [
          {
            id: "navigator",
            icon: "mdi-image",
            title: "Images Navigator",
          },
          {
            title: "Bookmark",
            icon: computed(() => (
              this.bookmarked ?
                'mdi-star-minus': 'mdi-star-plus'
            )),
            onclick: () => this.bookmark()
          },
          {
            items: [
              {
                id: "increase-margin",
                title: "Increase",
                icon: "mdi-pencil-plus",
                onclick: () => {
                  const margin = parseFloat(
                    this.imageMargin.substring(
                      0, this.imageMargin.length - 2
                    )
                  );
                  if (margin <= 20) {
                    state.imageMargin =
                      this.imageMargin = `${margin + 1}px`;
                    state.save();
                  }
                },
              },
              {
                id: "decrease-margin",
                title: "Decrease",
                aicon: "mdi-pencil-minus",
                onclick: () => {
                  const margin = parseFloat(
                    this.imageMargin.substring(
                      0, this.imageMargin.length - 2
                    )
                  );
                  if (margin >= 1) {
                    state.imageMargin =
                      this.imageMargin = `${margin - 1}px`;
                    state.save();
                  }
                },
              },
            ],
          },
          { divider: true },
          {
            items: [
              {
                id: "prev-chapter",
                title: "Previous Chapter",
                icon: "mdi-arrow-left-bold",
                /* inactive: computed(() => {
                  const comic = cache.get("active-comic");
                  if (comic) return comic.index === 0;
                }), */
                onclick: () => {
                  const comics = cache.get("comics") || state.comics;
                  const comic = cache.get("active-comic");
                  const previous = comics[comic.index - 1];
                  if (previous && previous !== comic)
                    this.loadComic(previous);
                },
              },
              {
                id: "next-chapter",
                title: "Next Chapter",
                aicon: "mdi-arrow-right-bold",
                /* inactive: computed(() => {
                  const comics = cache.get("comics") || state.comics;
                  const comic = cache.get("active-comic");
                  if (comic) return comic.index >= comics.length - 1;
                }), */
                onclick: () => {
                  const comics = cache.get("comics") || state.comics;
                  const comic = cache.get("active-comic");
                  const next = comics[comic.index + 1];
                  if (next && next !== comic)
                    this.loadComic(next);
                },
              },
            ],
          },
        ],
        images: this.images.map((img) => ({
          img,
          onclick: () => {
            const e = document.querySelector(`.v-img[filename="${img.title}"]`);
            setTimeout(() => e?.scrollIntoView({ behavior: "smooth" }));
          },
        })),
      });
  
      app.pushAction({
        execute: () => {
          app.layout.marginTop = "70px";
          revertMenu(); this.$router.back();
        },
      });
    },
    bookmark() {
      const comic = cache.get("active-comic");
      if (!comic) return;

      const bookmark = {
        thumbnail: { uri: comic.uri },
        uri: comic.uri, name: comic.name,
        type: "chapter", folder: comic.folder
      };

      if (this.bookmarked) {
        state.removeBookmark(bookmark);
      } else {
        state.addBookmark(bookmark);
      }
      this.bookmarked = !this.bookmarked;
    }, 

    showDialog(image) {
      this.image = image;
      this.showContext = true;
    },

    async loadComic(comic) {
      cache.set("active-comic", comic);

      this.loading = true;

      const images = [];
      const promises = [];
      const app = useAppStore();
      const files = await fs.readdir({ path: comic.uri });

      app.setHeader(
        decodeURI(
          `${comic.name}${
            comic.folder ?
              ": " + comic.folder.name : ""
          }`
        )
      );

      for (const file of files) {
        const entry = {
          title: file.name,
          src: ref(file.uri),
        };
        images.push(entry);

        promises.push(
          fs
            .readFileAsURL({ path: entry.src.value })
            .then((src) => (entry.src.value = src))
        );
      }

      this.images = sort(images);

      const bookmark = {
        thumbnail: { uri: comic.uri },
        uri: comic.uri, name: comic.name,
        type: "chapter", folder: comic.folder
      };

      if (state.bookmarkExists(bookmark)) {
        this.bookmarked = true;
      }

      Promise.all(promises).then(() => {
        this.loading = false;
      });
    },

    toggleNavigator() {
      const navigator = cache.get("navigator");
      if (navigator?.value) {
        navigator.value = false;
      }

      // app.showFab = !app.showFab;
      app.showAppBar = !app.showAppBar;
      app.showFooter = !app.showFooter;
    }
  },
};
</script>
