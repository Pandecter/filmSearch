<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col>
                    <v-autocomplete
                     label="Поиск"
                     variant="outlined">
                    </v-autocomplete>
                </v-col>
                <v-col>
                    <p>тут будет кнопка сорт</p>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="filmList">
            <v-card v-for="(poster, index) in FilmStore.posters"
             :key="index"
             max-width="200"
             height="200"
             :image="poster"></v-card>
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

    .filmList{}
</style>