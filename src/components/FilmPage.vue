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
            <v-btn icon="mdi-arrow-bottom-right-bold-box-outline" size="large" class="ml-6" elevation="0"></v-btn>
        </v-container>
        <v-container class="d-flex flex-row flex-wrap justify-space-around"
        fill-height>
            <v-card class="mt-10" v-for="(filmData, index) in FilmStore.selectedFilms"
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
        <v-pagination :length="FilmStore.paginationLength">

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
    watch: {

    }
    
}
</script>

<style scoped lang="scss">
    *{  
        background-color: rgb(90, 90, 90) !important; 
    }
</style>