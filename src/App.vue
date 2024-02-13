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
    mounted() {
      this.FilmStore.moveToPosters();
    }
  }
</script>
