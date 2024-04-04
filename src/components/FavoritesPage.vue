<template>
    <v-app>
        <v-app-bar>
            <v-btn @click="FilmStore.toMainPage()" variant="flat" color="error"> Назад </v-btn>
            <div class="d-flex justify-center w-100 mr-10">
                <v-app-title class="text-h5"> Избранное </v-app-title>
            </div>
            <v-btn 
             variant="plain"
             title="Фильтрация"
             id="filter-activator"
            >   <v-icon icon="mdi-filter-outline"></v-icon>
                <v-menu   
                 activator="#filter-activator"
                 location="start" 
                 :close-on-content-click="false"
                >
                    <v-sheet>
                        <v-list>
                            <v-list-item v-for="(item, index) in FilmStore.valuesOfSort"
                             :key="item.id">
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
                                         v-model="FilmStore.valueOfRangeFavorites[index]"
                                         :step="FilmStore.stepValue[index]"
                                        >
                                        </v-range-slider>
                                    </div>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                        <div>
                            <v-btn rounded="0" class="w-50" color="error" @click="FilmStore.restartFavoritesFilter()">Сбросить</v-btn>
                            <v-btn rounded="0" class="w-50" variant="elevated" color="accept" @click="FilmStore.favoritesFilterInit()">Применить</v-btn>
                        </div>
                    </v-sheet>
                </v-menu>
            </v-btn>
        </v-app-bar>
        <v-container class="d-flex flex-row flex-wrap justify-space-around mt-16">
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
                <v-btn icon="mdi-close-thick"
                 title="Удалить из закладок"
                 variant="plain"
                 color="error"
                 @click="FilmStore.removeFromFavorites(favorite)">
                </v-btn>           
            </div>
            <div class="ml-4">
                <p>
                    {{ favorite.year }}
                </p>
                <p>
                    Ваша оценка: {{ favorite.filmRating }}
                    <v-icon  icon="mdi-star mb-1">
                    </v-icon>
                </p>
            </div>
                <v-img 
                 :src="favorite.poster.url"
                 gradient="to top, rgba(255, 255, 255,.5), rgba(0, 0, 0,.7)"
                 cover>
                    <div class="h-100 d-flex justify-space-between align-end">
                        <div class="mb-1 ml-2">
                            {{ favorite.movieLength }} мин
                        </div>
                        <div class="mr-1">
                                {{ favorite.rating.kp }}                     
                            <v-icon  icon="mdi-star mb-1">
                            </v-icon>
                        </div>  
                    </div>
                </v-img>

            </v-card>
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

