<template>
  <v-app>
    <v-app-bar color="rgb(60, 60, 60)" class="myBar">
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

<style scoped lang="scss">
 ::v-deep .v-application__wrap {  //уменьшаем высоту v-app для AppBar-а
    min-height: 64px;
  }

  .myTitle{
    font-size: 30px !important;
    padding-left: 65px;
  }

  .myIcon{
    padding-right: 50px;
  }

  .myBar{
    border-bottom: 0.5px solid white;
  }
</style>
