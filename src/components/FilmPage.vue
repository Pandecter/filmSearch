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
                    :close-on-content-click="false">
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
        fill-height>
            <v-card class="mt-10" v-for="(filmData, index) in FilmStore.showResultArray"
             :key="filmData.id"
             max-width="300"
             height="350"
             variant="outlined"
             >  
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
                 aspect-ratio="0.66"
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
</script>

<style scoped lang="scss">

</style>