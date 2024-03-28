<template>
    <v-app>
        <v-container class="d-flex justify-center mr-14 mt-16" v-if="FilmStore.searchMode">
            <div class="w-50">  
                <v-autocomplete    
                 width="100"    
                 label="Поиск"
                 variant="outlined"
                 v-model="FilmStore.curName"
                 :items="FilmStore.filmNamesList"
                 @update:modelValue="FilmStore.filmResult()"
                >
                </v-autocomplete>
            </div>
            <v-btn class="ml-6 mt-1" size="large" elevation="0" title="Сортировать фильмы"
             id="sort-activator"
             variant="outlined"
            >
                <v-icon icon="mdi-sort">
                </v-icon>
                <v-menu activator="#sort-activator"
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
                                        <v-btn title="По возрастанию" class="mt-1 ml-3 mb-1" @click="FilmStore.ascendingSort(item.id)"
                                         variant="outlined"
                                        >
                                            <v-icon icon="mdi-sort-ascending"></v-icon>
                                        </v-btn>
                                        <v-btn title="По убыванию" class="mt-1 ml-3 mb-1 mr-3" @click="FilmStore.descendingSort(item.id)"
                                         variant="outlined"
                                        >
                                            <v-icon icon="mdi-sort-descending"></v-icon>
                                        </v-btn>
                                    </div>
                                </v-list-item-title>
                            </v-list-item>    
                        </v-list>
                        <v-btn rounded="0" class="w-100" color="error" @click="FilmStore.restartSort()">Сбросить</v-btn>
                    </v-sheet>
                </v-menu>
            </v-btn>
            <v-btn class="ml-6 mt-1" size="large" elevation="0" title="Фильтровать фильмы"
             id="filter-activator"
             variant="outlined"
            >
                <v-icon icon="mdi-filter">
                </v-icon>
                <v-menu activator="#filter-activator"
                 location="bottom" 
                 :close-on-content-click="false">
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
                                         v-model="FilmStore.valuesOfRange[index]"
                                         :step="FilmStore.stepValue[index]"
                                        >
                                        </v-range-slider>
                                    </div>
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                        <div>
                            <v-btn rounded="0" class="w-50" color="error" @click="FilmStore.restartFilter()">Сбросить</v-btn>
                            <v-btn rounded="0" class="w-50" variant="elevated" color="accept" @click="FilmStore.filterInit()">Применить</v-btn>
                        </div>
                    </v-sheet> 
                </v-menu>
            </v-btn>
        </v-container>
        <v-container v-else class="d-flex justify-center mt-10">
            <v-btn @click="FilmStore.backToSearch()"> Вернуться к поиску </v-btn>
        </v-container>
        <v-container class="d-flex flex-row flex-wrap justify-space-around"
         fill-height
        >
            <v-card class="mt-10" v-for="(filmData, index) in FilmStore.showResultArray"
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
                 @click="FilmStore.showRecommendedFilms(index)"
                >   
                    <v-sheet 
                     rounded
                     class="d-flex"
                     width="85vw"
                     height="90vh"
                    >  
                        <v-sheet rounded>
                            <v-img :src="filmData.poster.url"
                             height="90vh"
                             min-width="400"
                             rounded
                             cover
                             gradient="to top, rgba(255, 255, 255,.4), rgba(0, 0, 0,.7)"
                             class="d-flex flex-column align-end"
                            >
                                <p class="text-h5 mr-1 mt-16">
                                    {{ filmData.rating.kp }}
                                    <v-icon  icon="mdi-star" class="pb-2">
                                    </v-icon>
                                </p>
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
                            <v-divider :thickness="3" class="mt-4 ml-4 mr-4"></v-divider>
                            <p class="ml-4 mr-4 mt-4">
                                Альтернативное название: {{ filmData.alternativeName }}
                            </p>
                            <p class="ml-4 mr-4 mt-4">
                               Длительность фильма: {{ filmData.movieLength }} мин
                            </p>
                            <v-divider :thickness="3" class="mt-4 ml-4 mr-4"></v-divider>
                            <p class="ml-4 mr-4 mt-4">
                                Смотрите на
                            </p>
                            <v-list class="d-flex flex-row">
                                <v-list-item 
                                v-for="item in filmData.watchability.items"
                                :key=item._id>
                                    <a :href="item.url">
                                        <v-img :src="item.logo.url"
                                         width="25"
                                         heigth="25"
                                         rounded
                                         :title="item.name"
                                        >
                                        </v-img>
                                    </a>    
                                </v-list-item>
                            </v-list>
                            <v-divider :thickness="3" class="mt-4 ml-4 mr-4"></v-divider>
                            <p class="ml-4 mr-4 mt-4">
                                Оцените фильм
                            </p>
                            <v-rating class="d-flex justify-center"
                             length="10"
                             size="80"
                             v-model="FilmStore.filmRating[index]"
                            >
                            </v-rating>
                            <p class="ml-4 mr-4 mt-4">
                                Рекомендуем посмотреть
                            </p>
                            <div class="d-flex justify-space-around w-100 mt-4">
                                <div v-for="recomendedFilm in filmData.similarFilms"
                                 :key="recomendedFilm.id"
                                >   
                                    <v-img :src="recomendedFilm.poster.url"
                                     class="ml-4"
                                     width="10vw"
                                     height="20vh"
                                     :title="recomendedFilm.name">
                                    </v-img>
                                </div>
                            </div>
                            <div class="d-flex justify-center">
                                <v-btn variant="outlined" 
                                 class="mt-10 mb-4" 
                                 @click="FilmStore.addToFavorites(filmData)"
                                > Добавить в закладки</v-btn>
                            </div>
                        </div>  
                    </v-sheet>
                </v-overlay>
                <v-card-item>
                    <v-card-title> {{ filmData.name }} </v-card-title>
                    <v-card-subtitle> {{ filmData.year }} </v-card-subtitle>
                </v-card-item>
                <v-card-text class="d-flex justify-space-between">
                    <p>
                        {{ filmData.movieLength }} мин
                    </p>
                    <p>
                        {{ filmData.rating.kp }}
                        <v-icon  icon="mdi-star" class="pb-1">
                        </v-icon>
                    </p>
                     
                </v-card-text>
                <v-img
                 :min-width="300"
                 cover
                 :src="filmData.poster.url">
                </v-img>
            </v-card>
        </v-container>
        <v-pagination :length="FilmStore.paginationLength"
         v-model="FilmStore.currentPage"
         @update:modelValue="FilmStore.updatePage()"
        >
        </v-pagination>
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

// const obj = {
//     asd: 213,
//     fds:654
// }

//const newObj = {...obj, newfield: 6755}


//localStorage.setItem('ratings', JSON.stringify(FilmStore.filmRating))
</script>

<style scoped lang="scss">

</style>