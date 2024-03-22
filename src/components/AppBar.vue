<template>
  <v-app>
    <v-app-bar app>
      <div class="ml-16 w-100 d-flex justify-center">
        <p class="ml-16 pr-2 text-h5">Поиск Кино</p>
        <v-icon icon="mdi-movie-search-outline" size="x-large" class="myIcon"></v-icon>
      </div>
      <v-btn @click="$router.push('/favorites')" variant="tonal" title="Избранное">
        <v-icon icon="mdi-star"></v-icon>
      </v-btn>
      <v-btn @click="toggleTheme" title="Сменить тему">
        <v-icon icon="mdi-invert-colors"></v-icon>
      </v-btn>
    </v-app-bar>
  </v-app>
</template>

<script setup>
  import { ref } from "vue";
  import { useTheme } from 'vuetify/lib/framework.mjs';

  const theme = useTheme();
  const darkMode = ref(false);

  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
    theme.global.name.value = darkMode.value ? "dark" : "light";
  }

</script>

<style scoped lang="scss">
 :deep(.v-application__wrap) {  //уменьшаем высоту v-app для AppBar-а
    min-height: 64px;
  }
</style>
