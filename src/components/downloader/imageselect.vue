<template>
  <v-card class="mx-auto">
    <v-container class="pa-1">
      <v-item-group v-model="selection" multiple>
        <v-virtual-scroll :height="images.length ? '400' : ''" :items="images">
          <template v-slot:default="{ item, index }">
            <v-item :key="index" v-slot="{ isSelected, toggle }">
              <v-img
                :src="item.src" cover class="text-right pa-2"
                :style="isSelected ? '' : 'filter: blur(3px)'"
                @click.stop="toggleItem(index, isSelected, toggle)"
              >
                <v-btn
                  :icon="isSelected ? 'mdi-image-minus' : 'mdi-image-plus'"
                ></v-btn>
              </v-img>
            </v-item>
          </template>
        </v-virtual-scroll>
      </v-item-group>
    </v-container>
  </v-card>
</template>

<style scoped>
  div.v-virtual-scroll {
    padding-bottom: 3rem;
  }

  div.image-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .v-img { margin-bottom: 1rem; }

  v-btn {
    filter: none !important;
  }
</style>

<script setup>
  const images = defineModel("images");
  const selection = defineModel("selection");
  
  const toggleItem = (index, isSelected, toggle) => {
    toggle();

    if (isSelected) {
      selection.value = selection.value
        .filter(i => (i !== index))
    } else {
      selection.value = [...selection.value, index];
    }
  }
</script>
