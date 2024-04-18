<template>
  <router-view />
</template>

<script>
   import { useFilmStore } from '@/store/filmStorage'
   import router from '@/router'

   export default {
    data() {
      return {
        FilmStore: useFilmStore()
      }
    },
    mounted() { // при монтировании экземпляра загружаем файлы с json
      if(localStorage.getItem("favorites")) {
        this.FilmStore.favorites = [...(JSON.parse(localStorage.getItem("favorites")))]
      }
      this.FilmStore.moveToStorageArrays();
      router.push('/');
    },
  }
</script>