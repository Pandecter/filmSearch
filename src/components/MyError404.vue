<template>
    <v-app>
        <v-main>
            <v-container class="d-flex flex-column justify-center align-center h-screen">
                <h1>
                    ОШИБКА 404
                    <v-icon icon="mdi-emoticon-sad-outline" size="x-large" class="mb-2"></v-icon>
                </h1>
                
                <p class="mb-2">
                    Страница не была найдена
                </p>
                <RouterLink to="/">На главную</RouterLink>
            </v-container>
        </v-main>
    </v-app>
</template>
