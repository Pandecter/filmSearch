<template>
  <v-app>
    <v-container v-if="FilmStore.searchMode" class="d-flex justify-center mr-14 mt-16">
      <div class="w-50">  
        <v-autocomplete    
         width="100"    
         label="Поиск"
         variant="outlined"
         no-data-text="По данному запросу нет результатов"
         :items="FilmStore.filmNamesList"
         v-model="FilmStore.curName"
         @update:modelValue="FilmStore.filmResult()"
        />
      </div>
      <v-btn
       id="sort-activator"
       class="ml-6 mt-1" 
       size="large" 
       elevation="0" 
       title="Сортировать фильмы"
       variant="outlined"
      >
        <v-icon icon="mdi-sort"/>
        <v-menu 
         activator="#sort-activator"
         location="bottom" 
         :close-on-content-click="false"
        >
          <v-sheet>
            <v-list>
              <v-list-item v-for="item in FilmStore.valuesOfSort"
               :key="item.id"
              >
                <v-list-item-title>
                  <div>
                    {{ item.type }}
                  </div>
                  <div>
                    <v-btn 
                     class="mt-1 ml-3 mb-1"
                     title="По возрастанию"
                     variant="outlined"
                     :active="FilmStore.ascBut[item.id]"
                     @click="FilmStore.ascendingSort(item.id)"
                    >
                      <v-icon icon="mdi-sort-ascending"/>
                    </v-btn>
                    <v-btn 
                     class="mt-1 ml-3 mb-1 mr-3" 
                     title="По убыванию" 
                     variant="outlined"
                     :active="FilmStore.desBut[item.id]"
                     @click="FilmStore.descendingSort(item.id)"
                    >
                      <v-icon icon="mdi-sort-descending"/>
                    </v-btn>
                  </div>
                </v-list-item-title>
              </v-list-item>    
            </v-list>
            <v-btn 
             class="w-100" 
             rounded="0" 
             color="error" 
             @click="FilmStore.restartSort()"
            >
              Сбросить
            </v-btn>
          </v-sheet>
        </v-menu>
      </v-btn>
      <v-btn
       id="filter-activator" 
       class="ml-6 mt-1" 
       size="large" 
       elevation="0" 
       title="Фильтровать фильмы"
       variant="outlined"
      >
        <v-icon icon="mdi-filter"/>
         <v-menu 
         activator="#filter-activator"
         location="bottom" 
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
                    <v-range-slider class="ml-5 mr-5 mt-7"
                     style="width: 200px"
                     :min="FilmStore.borderValuesOfFilters[index][0]"
                     :max="FilmStore.borderValuesOfFilters[index][1]"
                     thumb-label="always"
                     :step="FilmStore.stepValue[index]"
                     v-model="FilmStore.valuesOfRange[index]"
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
               @click="FilmStore.restartFilter()"
              >
                Сбросить
              </v-btn>
              <v-btn
               class="w-50" 
               rounded="0"  
               variant="elevated" 
               color="accept" 
               @click="FilmStore.filterInit()"
              >
                Применить
              </v-btn>
            </div>
          </v-sheet> 
        </v-menu>
      </v-btn>
    </v-container>
    <v-container v-else class="d-flex justify-center mt-10">
      <v-btn @click="FilmStore.backToSearch()"> Вернуться к поиску </v-btn>
    </v-container>
    <v-container v-if="FilmStore.results" 
     class="d-flex flex-row flex-wrap justify-space-around"
     fill-height
    >
      <v-card class="mt-10" v-for="filmData in FilmStore.showResultArray"
       :key="filmData.id"
       max-width="300"
       height="350"
       variant="outlined"
       hover
       link
      >  
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
                    <v-icon  icon="mdi-star mb-1"/>
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
              <v-divider class="mt-4 ml-4 mr-4" :thickness="3"/>
              <p class="ml-4 mr-4 mt-4">
                Альтернативное название: {{ filmData.alternativeName }}
              </p>
              <p class="ml-4 mr-4 mt-4">
                Длительность фильма: {{ filmData.movieLength }} мин
              </p>
              <v-divider class="mt-4 ml-4 mr-4" :thickness="3"/>
              <p class="ml-4 mr-4 mt-4">
                Смотрите на
              </p>
              <v-list class="d-flex flex-row">
                <v-list-item v-for="item in filmData.watchability.items"
                 :key=item._id
                >
                  <a :href="item.url">
                    <v-img :src="item.logo.url"
                     width="25"
                     heigth="25"
                     rounded
                     :title="item.name"
                    />
                  </a>    
                </v-list-item>
              </v-list>
              <v-divider class="mt-4 ml-4 mr-4" :thickness="3"/>
              <p class="ml-4 mr-4 mt-4">
                Оцените фильм
              </p>
              <v-rating 
               class="d-flex justify-center"
               length="10"
               size="80"
               v-model="filmData.filmRating"
               @click="FilmStore.moveToFavorites(filmData)"
              />
              <p class="ml-4 mr-4 mt-4">
                Рекомендуем посмотреть
              </p>
              <div class="d-flex justify-space-around w-100 mt-4">
                <div v-for="recomendedFilm in filmData.similarFilms"
                 :key="recomendedFilm.id"
                >   
                  <v-img 
                   class="ml-4"
                   :src="recomendedFilm.poster.url"
                   width="10vw"
                   height="20vh"
                   :title="recomendedFilm.name"
                  />
                </div>
              </div>
              <div class="d-flex justify-center">
                <v-btn 
                 class="mt-10 mb-4"
                 variant="outlined" 
                 :disabled="filmData.isFavorite"
                 @click="FilmStore.moveToFavorites(filmData)"
                > 
                  Добавить в закладки
                </v-btn>
              </div>
            </div>  
          </v-sheet>
        </v-overlay>
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
            <v-icon class="pb-1" icon="mdi-star"/>
          </p>         
        </v-card-text>
        <v-img
         min-width="300"
         cover
         :src="filmData.poster.url"/>
      </v-card>
    </v-container>
    <v-container v-else class="d-flex justify-center align-center text-h5">
      <p>
        Нет результатов
      </p>
    </v-container>
    <v-pagination 
     :length="FilmStore.paginationLength"
     v-model="FilmStore.currentPage"
     @update:modelValue="FilmStore.updatePage()"
    />
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
