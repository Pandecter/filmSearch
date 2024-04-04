<template>
  <v-app>
    <v-app-bar app>
      <div class="ml-16 pl-10 w-100 d-flex justify-center">
        <p class="ml-16 pl-16 pr-2 text-h5">
          Поиск Кино
        </p>
        <v-icon icon="mdi-movie-search-outline" size="x-large" class="myIcon"/>
      </div>
      <div class="d-flex justify-end">
        <v-btn 
         @click="FilmStore.toFavoritesPage()" 
         variant="outlined" 
         title="Избранное" 
         class="mr-8"
        >
          Закладки
        </v-btn>
        <v-btn 
         @click="toggleTheme" 
         title="Сменить тему" 
         class="mr-4"
        >
          <v-icon icon="mdi-invert-colors"/>
        </v-btn>
      </div>
    </v-app-bar>
  </v-app>
</template>

<script setup>
  import { useTheme } from 'vuetify/lib/framework.mjs';

  const theme = useTheme();

  const toggleTheme = () => {
    theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark';
  }
</script>

<script>
  import { useFilmStore } from "@/store/filmStorage"

  export default {
    data() {
      return {
        FilmStore: useFilmStore()
      }
  },
}
</script>

<style scoped lang="scss">
 :deep(.v-application__wrap) {  //уменьшаем высоту v-app для AppBar-а
    min-height: 64px;
  }
</style>
