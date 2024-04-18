<template>
  <v-app>
    <film-search-component />
    <film-list-component />
    <v-pagination 
      v-model="filmStore.currentPage"
      :length="filmStore.paginationLength"
      @update:model-value="filmStore.updatePage()"
    />
  </v-app>
</template>

<script>
import { useFilmStore } from "@/store/filmStorage"
import FilmSearchComponent from "./FilmSearch.vue"
import FilmListComponent from "./FilmList.vue"

export default {
  components: {
    FilmSearchComponent,
    FilmListComponent
  },
  data() {
    return {
      filmStore: useFilmStore()
    }
  },
  
}
</script>