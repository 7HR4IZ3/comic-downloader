<template>
  <v-list lines="two" style="width: 100%">
    <template v-for="(list, i) in items" :key="i">
      <v-list-subheader inset>
        {{ list.title }}
      </v-list-subheader>
      <v-list-item
        v-for="item in list.list"
        :key="item.title"
        :title="item.title"
        :subtitle="item.subtitle"
      >
        <template v-slot:prepend v-if="item.icon">
          <v-avatar :color="item.color">
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-avatar>
        </template>
  
        <template v-slot:append>
          <v-btn
            color="grey-lighten-1"
            icon="mdi-information"
            variant="text"
          ></v-btn>
        </template>
      </v-list-item>
      
      <v-divider
        inset v-if="i !== items.length - 1"
      ></v-divider>
    </template>
  </v-list>
</template>

<script>
  export default {
    props: ["items"],
    data: () => ({})
  }
  </script>