<template>
  <v-app>
    <v-app-bar :elevation="5" rounded color="rgb(60, 60, 60)">
      <v-row justify="center">
        <v-col cols="2">
          <v-app-bar-title class="myTitle">Поиск Кино</v-app-bar-title>
        </v-col>
        <v-col cols="1">
          <v-icon icon="mdi-movie-search-outline" size="x-large" class="myIcon"></v-icon>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-app>
</template>

<script setup>
  //
</script>

<style lang="scss">
  .myTitle{
    font-size: 30px !important;
    padding-left: 65px;
  }

  .myIcon{
    padding-right: 50px;
  }
</style>
