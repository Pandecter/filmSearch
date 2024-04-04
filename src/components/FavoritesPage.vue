<template>
  <v-app>
    <v-app-bar>
      <v-btn 
       @click="FilmStore.toMainPage()" 
       variant="flat" 
       color="error"
      > 
        Назад 
      </v-btn>
      <v-dialog v-model="FilmStore.dialog">
        <div class="d-flex justify-center">
          <v-card
           max-width="400"
           text="Переход на главную страницу приведет к сбросу фильтров для закладок. Вы точно хотите перейти?"
           title="Внимание!"
          >
            <div class="d-flex">
              <v-btn 
               class="w-50" 
               @click="FilmStore.dialog = false"
               color="error"
              >
                Отмена
              </v-btn>
              <v-btn class="w-50" @click="FilmStore.fromDialogToMainPage()">
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
       variant="plain"
       title="Фильтрация"
       id="filter-activator"
      >   
        <v-icon icon="mdi-filter-outline" size="x-large"/>
        <v-menu   
         activator="#filter-activator"
         location="start" 
         :close-on-content-click="false"
        >
          <v-sheet>
            <v-list>
              <v-list-item v-for="(item, index) in FilmStore.valuesOfSort"
               :key="item.id"
              >
                <v-list-item-title>
                  <div>
                    {{ item.type }}
                  </div>
                  <div>
                    <v-range-slider 
                     class="ml-5 mr-5 mt-7"
                     style="width: 200px"
                     :min="FilmStore.borderValuesOfFilters[index][0]"
                     :max="FilmStore.borderValuesOfFilters[index][1]"
                     thumb-label="always"
                     v-model="FilmStore.valueOfRangeFavorites[index]"
                     :step="FilmStore.stepValue[index]"
                    />
                  </div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <div>
              <v-btn 
               rounded="0" 
               class="w-50" 
               color="error" 
               @click="FilmStore.restartFavoritesFilter()"
              >
                Сбросить
              </v-btn>
              <v-btn 
               rounded="0"
               class="w-50"
               variant="elevated" 
               color="accept" 
               @click="FilmStore.favoritesFilterInit()"
               id="tooltip-activator"
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
    <v-container v-if="FilmStore.favoritesResults"
     class="d-flex flex-row flex-wrap justify-space-around mt-16"
    > 
      <v-card v-for="favorite in FilmStore.favorites"
       :key="favorite.id"
       class="mt-8"
       width="250"
       heigth="350"
       variant="outlined"
      >
        <div class="d-flex justify-space-between">
          <v-card-text class="text-truncate text-h6" :title="favorite.name">
            {{ favorite.name }}
          </v-card-text>
          <v-btn 
           title="Удалить из закладок"
           variant="plain"
           color="error"
           :disabled="FilmStore.favoritesInFilterMode"
           @click="FilmStore.removeFromFavorites(favorite)"
           class="mt-2 pl-8"
          >
            <v-icon icon="mdi-close-thick"/>
          </v-btn>           
        </div>
        <div class="ml-4">
          <p>
            {{ favorite.year }}
          </p>
          <p>
            Ваша оценка: {{ favorite.filmRating }}
            <v-icon  icon="mdi-star mb-1"/>
          </p>
        </div>
        <v-img
         height="350"
         :src="favorite.poster.url"
         gradient="to top, rgba(255, 255, 255,.5), rgba(0, 0, 0,.7)"
         cover>
          <div class="h-100 d-flex justify-space-between align-end">
            <div class="mb-1 ml-2">
              {{ favorite.movieLength }} мин
            </div>
            <div class="mr-1">
              {{ favorite.rating.kp }}                     
              <v-icon  icon="mdi-star mb-1"/>
            </div>  
          </div>
        </v-img>
      </v-card>
    </v-container>
    <v-container v-else class=" h-100 d-flex justify-center align-center text-h3">
      <p>
        Нет результатов
      </p>
    </v-container>
  </v-app>
</template>

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

