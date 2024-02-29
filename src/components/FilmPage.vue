<template>
    <v-app>
        <v-container class="d-flex justify-center mt-16">
            <div class="ml-16 w-50">  
                <v-autocomplete    
                 width="100"    
                 label="Поиск"
                 variant="outlined"
                 v-model="FilmStore.curName"
                 :items="FilmStore.filmNames"
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
                        <v-list>
                            <v-list-item v-for="item in FilmStore.valuesOfSort"
                            :key="item.id">
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
                        <v-btn color="#df0f0f" @click="FilmStore.restartSort()">Сбросить</v-btn>
                    </v-menu>
                </v-btn>
        </v-container>
        <v-container class="d-flex flex-row flex-wrap justify-space-around"
        fill-height>
            <v-card class="mt-10" v-for="(filmData, index) in FilmStore.showResultArray"
             :key="filmData.id"
             max-width="300"
             height="300"
             variant="outlined"
             >  
                <v-card-item>
                    <v-card-title> {{ filmData.name }} </v-card-title>
                </v-card-item>
                <v-card-text class="d-flex justify-space-between">
                    <p>
                        {{ filmData.year }}
                    </p>
                    <p>
                        {{ filmData.rating.kp  }}
                        <v-icon  icon="mdi-star" class="pb-1">
                        </v-icon>
                    </p>
                     
                </v-card-text>
                <v-img
                 :min-width="300"
                 aspect-ratio="16/9"
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