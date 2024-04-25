<template>
  <v-container 
    v-if="filmStore.results" 
    class="d-flex flex-row flex-wrap justify-space-around"
    fill-height
  >
    <extended-card-component 
      :film-data="film ? film : filmStore.firstFilm"
      @change-rating="updateRating"
      @update-info="updateFilm"
    />
    <v-card  
      v-for="filmData in filmStore.showResultArray"
      :key="filmData.id"
      class="mt-10"
      max-width="300"
      height="350"
      variant="outlined"
      hover
      link
      @click="film = filmData"
    >  
      <v-card-item>
        <v-card-title> 
          {{ filmData.name }} 
        </v-card-title>
        <v-card-subtitle> 
          {{ filmData.year }} 
        </v-card-subtitle>
      </v-card-item>
      <v-card-text class="d-flex justify-space-between">
        <p>
          {{ filmData.movieLength }} мин
        </p>
        <p>
          {{ filmData.rating.kp }}
          <v-icon 
            class="pb-1" 
            icon="mdi-star"
          />
        </p>         
      </v-card-text>
      <v-img
        min-width="300"
        cover
        :src="filmData.poster.url"
      />
    </v-card>
  </v-container>
  <v-container 
    v-else 
    class="d-flex justify-center align-center text-h5"
  >
    <p>
      Нет результатов
    </p>
  </v-container>
</template>

<script>
import { useFilmStore } from "@/store/filmStorage"
import ExtendedCardComponent from "./ExtendedCard.vue"

export default {
	components: {
		ExtendedCardComponent
	},
  data() {
    return {
      filmStore: useFilmStore(),
      film: {}
    }
  },
	methods: {
		updateRating(data) {
			const INDEX = this.filmStore.filmDataStorage.findIndex((el) => el.id === data.id);
			this.filmStore.filmDataStorage[INDEX].filmRating = data.rating;
		},

    updateFilm(recomendedFilm) {
      this.film = recomendedFilm;
    }
	}
}
</script>