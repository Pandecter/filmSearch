<template>
  <v-app>
    <v-app-bar>
      <v-btn 
        variant="flat" 
        color="error"
        @click="filmStore.toMainPage()" 
      > 
        Назад 
      </v-btn>
      <v-dialog v-model="filmStore.dialog">
        <div class="d-flex justify-center">
          <v-card
            max-width="400"
            text="Переход на главную страницу приведет к сбросу фильтров для закладок. Вы точно хотите перейти?"
            title="Внимание!"
          >
            <div class="d-flex">
              <v-btn 
                class="w-50" 
                color="error"
                @click="filmStore.dialog = false"
              >
                Отмена
              </v-btn>
              <v-btn 
                class="w-50" 
                @click="filmStore.fromDialogToMainPage()"
              >
                Перейти
              </v-btn>
            </div>
          </v-card>
        </div>     
      </v-dialog>      
      <div class="d-flex justify-center w-100 mr-8">
        <p class="text-h5"> 
          Избранное 
        </p>
      </div>
      <v-btn
        id="filter-activator"
        variant="plain"
        title="Фильтрация"
      >   
        <v-icon 
          icon="mdi-filter-outline" 
          size="x-large"
        />
        <v-menu   
          activator="#filter-activator"
          location="start" 
          :close-on-content-click="false"
        >
          <v-sheet>
            <v-list>
              <v-list-item 
                v-for="(item, index) in filmStore.valuesOfSort"
                :key="item.id"
              >
                <v-list-item-title>
                  <div>
                    {{ item.type }}
                  </div>
                  <div>
                    <v-range-slider
                      v-model="filmStore.valueOfRangeFavorites[index]" 
                      class="ml-5 mr-5 mt-7"
                      style="width: 200px"
                      :min="filmStore.borderValuesOfFilters[index][0]"
                      :max="filmStore.borderValuesOfFilters[index][1]"
                      thumb-label="always"
                      :step="filmStore.stepValue[index]"
                    />
                  </div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <div>
              <v-btn
                class="w-50"  
                rounded="0" 
                color="error" 
                @click="filmStore.restartFavoritesFilter()"
              >
                Сбросить
              </v-btn>
              <v-btn
                id="tooltip-activator"
                class="w-50" 
                rounded="0"
                variant="elevated"
                color="accept"
                @click="filmStore.favoritesFilterInit()"
              >
                Применить
              </v-btn>
            </div>
          </v-sheet>
          <v-tooltip
            activator="#tooltip-activator"
            location="bottom"
          >
            Во время фильтрации нельзя удалять закладки!
          </v-tooltip>
        </v-menu>
      </v-btn>
    </v-app-bar>
    <v-container 
      v-if="filmStore.favoritesResults"
      class="d-flex flex-row flex-wrap justify-space-around mt-16"
    >
      <extended-card-component 
        :film-data="film"
        @change-rating="updateRatingInFavorites"
        @update-info="updateFilmInFavorites"
      /> 
      <v-card 
        v-for="favorite in filmStore.favorites"
        :key="favorite.id"
        class="mt-8"
        width="250"
        heigth="350"
        variant="outlined"
        @click="favoritesInit(favorite)"
      >
        <div class="d-flex justify-space-between">
          <v-card-text 
            class="text-truncate text-h6" 
            :title="favorite.name"
          >
            {{ favorite.name }}
          </v-card-text>
          <v-btn
            class="mt-2 pl-8" 
            title="Удалить из закладок"
            variant="plain"
            color="error"
            :disabled="filmStore.favoritesInFilterMode"
            @click.stop="filmStore.removeFromFavorites(favorite)"
          >
            <v-icon icon="mdi-close-thick" />
          </v-btn>           
        </div>
        <div class="ml-4">
          <p>
            {{ favorite.year }}
          </p>
          <p>
            Ваша оценка: {{ favorite.filmRating }}
            <v-icon icon="mdi-star mb-1" />
          </p>
        </div>
        <v-img
          height="350"
          :src="favorite.poster.url"
          gradient="to top, rgba(255, 255, 255,.5), rgba(0, 0, 0,.7)"
          cover
        >
          <div class="h-100 d-flex justify-space-between align-end">
            <div class="mb-1 ml-2">
              {{ favorite.movieLength }} мин
            </div>
            <div class="mr-1">
              {{ favorite.rating.kp }}                     
              <v-icon icon="mdi-star mb-1" />
            </div>  
          </div>
        </v-img>
      </v-card>
    </v-container>
    <v-container 
      v-else 
      class=" h-100 d-flex justify-center align-center text-h3"
    >
      <p>
        Нет результатов
      </p>
    </v-container>
  </v-app>
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
    updateRatingInFavorites(data) {
      const INDEX = this.filmStore.filmDataStorage.findIndex((el) => el.id === data.id);
			this.filmStore.filmDataStorage[INDEX].filmRating = data.rating;
    },

    updateFilmInFavorites(recommendedFilm) {
      this.film = recommendedFilm;
    },

    favoritesInit(favorite) {
      this.film = favorite;
    }
  },
}
</script>