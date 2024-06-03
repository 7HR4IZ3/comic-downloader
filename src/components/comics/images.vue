<template>
  <v-navigation-drawer v-model="drawer" location="right" width="300">
    <v-list id="images-bar">
      <v-list-item
        v-for="item in images"
        @click="item.onclick"
      >
        <v-list-item-title v-if="item.img.title">
          {{ item.img.title }}
        </v-list-item-title>
        <v-img
          v-if="item.img.src"
          :src="item.img.src"
          cover position="top"
        ></v-img>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style>
  #images-bar .v-list-item__content {
    gap: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<style scoped>
  .v-img {
    width: 200px;
    height: 150px;
  }

  .v-list-item {
    display: flex;
    flex-direction: column;
  }

  .v-list-item-title {
    display: flex;
    padding-right: .5rem;
    align-items: center;
    justify-content: center;
  }
</style>

<script setup>
  const drawer = defineModel("drawer");
  const images = defineModel("images");
</script>
