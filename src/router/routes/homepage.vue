<template>
  <v-container>
    <v-row dense>
      <comic-list :items="listItems"></comic-list>
    </v-row>
  </v-container>
</template>

<script>
  import ComicList from "../../components/shared/comics/list.vue"
  import {
    useAppStore
  } from "../../stores/app";

  export default {
    components: { ComicList },
    data: () => ({
      listItems: [
        {
          title: "Downloads",
          list: [
            {
              color: 'blue',
              icon: 'mdi-clipboard-text',
              subtitle: 'Jan 20, 2014',
              title: 'Vacation itinerary',
            },
            {
              color: 'amber',
              icon: 'mdi-gesture-tap-button',
              subtitle: 'Jan 10, 2014',
              title: 'Kitchen remodel',
            },
          ]
        }
      ]
    }),
    mounted() {
      const app = useAppStore();
      app.setHeader("Comic Downloader");

      app.setFab({ icon: "mdi-plus", shown: true });
    }
  }
  </script>