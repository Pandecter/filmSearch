<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <v-autocomplete
                     label="Поиск"
                     variant="outlined"
                     :items="FilmStore.filmNames">
                    </v-autocomplete>
                </v-col>
                <v-col>
                    <p>тут будет кнопка сорт</p>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="d-flex flex-row flex-wrap justify-space-around"
        fill-height>
            <v-card class="mt-10" v-for="(filmData, index) in FilmStore.filmDataStorage"
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
    </v-app>
</template>

<script>
import { useFilmStore } from "@/store/filmStorage"

export default {
    data() {
        return {
            FilmStore: useFilmStore()
        }
    }
    
}
</script>

<style scoped lang="scss">
    *{  
        background-color: rgb(90, 90, 90) !important; 
    }

    .filmList{
    }
</style>