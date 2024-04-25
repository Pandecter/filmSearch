<template>
  <v-overlay 
    class="d-flex justify-space-around align-center"
    activator="parent" 
  >   
    <v-sheet
      class="d-flex" 
      rounded
      width="85vw"
      height="90vh"
    >  
      <v-sheet rounded>
        <v-img 
          class="d-flex flex-column align-end"
          :src="filmData.poster.url"
          height="90vh"
          min-width="400"
          rounded
          cover
          gradient="to top, rgba(255, 255, 255,.4), rgba(0, 0, 0,.7)"
        >
          <div class="h-100 d-flex justify-end align-end">
            <div class="mr-1">
              {{ filmData.rating.kp }}                     
              <v-icon icon="mdi-star mb-1" />
            </div>  
          </div>
        </v-img>        
      </v-sheet>
      <div class="overflow-auto">
        <div class="d-flex justify-space-between align-center">
          <p class="text-h4 ml-4 mt-4 mb-2">
            {{ filmData.name }} 
          </p> 
          <p class="mr-6 font-weight-light">
            {{ filmData.year }}
          </p>
        </div>
        <p class="ml-4 mr-4 mt-4">
          {{ filmData.description }}
        </p>
        <v-divider 
          class="mt-4 ml-4 mr-4" 
          :thickness="3"
        />
        <p class="ml-4 mr-4 mt-4">
          Альтернативное название: {{ filmData.alternativeName }}
        </p>
        <p class="ml-4 mr-4 mt-4">
          Длительность фильма: {{ filmData.movieLength }} мин
        </p>
        <v-divider 
          class="mt-4 ml-4 mr-4"
          :thickness="3"
        />
        <p class="ml-4 mr-4 mt-4">
          Смотрите на
        </p>
        <v-list class="d-flex flex-row">
          <v-list-item 
            v-for="item in filmData.watchability.items"
            :key="item._id"
          >
            <a :href="item.url">
              <v-img 
                :src="item.logo.url"
                width="25"
                heigth="25"
                rounded
                :title="item.name"
              />
            </a>    
          </v-list-item>
        </v-list>
        <v-divider 
          class="mt-4 ml-4 mr-4" 
          :thickness="3"
        />
        <p class="ml-4 mr-4 mt-4">
          Оцените фильм
        </p>
        <v-rating
          v-model="currentRating"
          class="d-flex justify-center"
          length="10"
          size="80"
          @click="changeRating(currentRating)"
        />
        <p class="ml-4 mr-4 mt-4">
          Рекомендуем посмотреть
        </p>
        <div class="d-flex justify-space-around w-100 mt-4">
          <div 
            v-for="recomendedFilm in filmData.similarFilms"
            :key="recomendedFilm.id"
          >   
            <v-img 
              class="ml-4"
              :src="recomendedFilm.poster.url"
              width="10vw"
              height="20vh"
              :title="recomendedFilm.name"
              @click="updateCardInfo(recomendedFilm)"
            />
          </div>
        </div>
        <div class="d-flex justify-center">
          <v-btn 
            class="mt-10 mb-4"
            variant="outlined" 
            :disabled="filmData.isFavorite"
            @click="filmStore.moveToFavorites(filmData)"
          > 
            Добавить в закладки
          </v-btn>
        </div>
      </div>  
    </v-sheet>
  </v-overlay>
</template>

<script>
import { useFilmStore } from "@/store/filmStorage"

export default {
  props: {
    filmData: {
      type: Object,
      required: true
    }
  },
  emits: ["changeRating", "updateInfo"],
  data() {
    return {
      filmStore: useFilmStore(),
      currentRating: 0
    }
  },
  watch: {
    filmData(newValue, oldValue) {
      if (newValue != oldValue) {
        this.currentRating = this.filmData.filmRating;
      }
    }
  },
  methods: {
    changeRating(value){
      console.log("Значение: " + this.filmData.filmRating)
      this.$emit('changeRating', {rating: value, id: this.filmData.id});
      this.filmStore.moveToFavorites(this.filmData);
    },

    updateCardInfo(film) {
      this.$emit('updateInfo', film);
    }
  }
}
</script>