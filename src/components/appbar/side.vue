<template>
  <v-navigation-drawer temporary v-model="drawer">
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        v-for="(item, i) in items"
        :key="i" :value="item"
        color="primary"
        @click="setLocation(item.location)"
        :active="isActiveRoute(item)"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-navigation-drawer .v-list-item {
  color: inherit !important;
}
</style>

<script>
  export default {
    data: () => ({
      items: [
        { text: 'Comics', icon: 'mdi-folder', location: "homepage" },
        { text: 'Downloads', icon: 'mdi-check-circle', location: "downloads" },
        { text: 'Favourites', icon: 'mdi-star', location: "favourites" },
        { text: 'Settings', icon: 'mdi-cog', location: "settings" }
      ],
    }),

    methods: {
      isActiveRoute({ location }) {
        const route = this.$router.currentRoute._value;
        return route.name === location;
      },
      setLocation(location) {
        if (location) {
          this.$router.push({ name: location });
        }
      }
    }
  }
</script>

<script setup>
const drawer = defineModel();
</script>
