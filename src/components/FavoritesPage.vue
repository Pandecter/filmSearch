<template>
    <v-app>
        <v-app-bar>
            <v-btn @click="$router.push('/')" variant="flat" color="error"> Назад </v-btn>
            <div class="d-flex justify-center w-100 mr-16">
                <v-app-title class="text-h5 mr-16"> Избранное </v-app-title>
            </div>
        </v-app-bar>
        <div class="d-flex justify-space-around mt-16 flex-wrap">
            <v-card v-for="favorite in FilmStore.favorites"
             :key="favorite.id"
             class="mt-16"
             width="150"
             heigth="250">
                <v-card-item>
                    <v-card-text>
                        {{ favorite.name }}
                    </v-card-text>
                </v-card-item>
                <div>
                    <v-img 
                     :src="favorite.poster.url"
                     cover>
                    </v-img>
                </div>
            </v-card>
        </div>
        
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

