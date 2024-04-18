<template>
  <v-app>
    <v-app-bar app>
      <div class="ml-16 pl-10 w-100 d-flex justify-center">
        <p class="ml-16 pl-16 pr-2 text-h5">
          Поиск Кино
        </p>
        <v-icon 
          icon="mdi-movie-search-outline" 
          size="x-large" 
        />
      </div>
      <div class="d-flex justify-end">
        <v-btn 
          variant="outlined" 
          title="Избранное" 
          class="mr-8"
          @click="filmStore.toFavoritesPage()" 
        >
          Закладки
        </v-btn>
        <v-btn  
          title="Сменить тему" 
          class="mr-4"
          @click="toggleTheme"
        >
          <v-icon icon="mdi-invert-colors" />
        </v-btn>
      </div>
    </v-app-bar>
  </v-app>
</template>

<script>
  import { useFilmStore } from "@/store/filmStorage"
  import {useTheme} from 'vuetify/lib/framework.mjs'
  export default {
    data() {
      return {
        filmStore: useFilmStore(),
        theme: useTheme(),
      }
  },
  methods: {
    toggleTheme() {
      this.theme.global.name = this.theme.global.name === 'dark' ? 'light' : 'dark';
    }
  }
}
</script>

<style scoped lang="scss">
 :deep(.v-application__wrap) {  //уменьшаем высоту v-app для AppBar-а
    min-height: 64px;
  }
</style>