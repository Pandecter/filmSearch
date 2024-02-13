<template>
  <router-view />
</template>

<script>
   import { useFilmStore } from '@/store/filmStorage'

   export default {
    data() {
      return {
        FilmStore: useFilmStore()
      }
    },
    mounted() { // при монтировании экземпляра загружаем файлы с json
      this.FilmStore.moveToPosters();
    }
  }
</script>
