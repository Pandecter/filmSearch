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
        <v-container>
            <p>тут будут фильмы</p>
            <h1>...</h1>
        </v-container>
    </v-app>
</template>

<style scoped lang="scss">
    *{  
        background-color: rgb(90, 90, 90) !important; 
    }
</style>