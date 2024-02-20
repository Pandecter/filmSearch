<template>
  <v-app>
    <v-app-bar app color="rgb(60, 60, 60)" style="border-bottom: 0.5px solid white;">
      <div class="w-100 d-flex justify-center">
        <p class="pr-2 text-h5">Поиск Кино</p>
        <v-icon icon="mdi-movie-search-outline" size="x-large" class="myIcon"></v-icon>
      </div>
    </v-app-bar>
  </v-app>
</template>

<script setup>
  //padding-right: 50px;
  //padding-left: 65px;
  //font-size: 30px !important;
</script>

<style scoped lang="scss">
 :deep(.v-application__wrap) {  //уменьшаем высоту v-app для AppBar-а
    min-height: 64px;
  }
</style>
