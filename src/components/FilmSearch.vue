<template>
  <v-container 
    v-if="filmStore.searchMode" 
    class="d-flex justify-center mr-14 mt-16"
  >
    <div class="w-50">  
      <v-autocomplete
        v-model="filmStore.curName"    
        width="100"    
        label="Поиск"
        variant="outlined"
        no-data-text="По данному запросу нет результатов"
        :items="filmStore.filmNamesList"
        @update:model-value="filmStore.filmResult()"
      />
    </div>
    <v-btn
      id="sort-activator"
      class="ml-6 mt-1" 
      size="large" 
      elevation="0" 
      title="Сортировать фильмы"
      variant="outlined"
    >
      <v-icon icon="mdi-sort" />
      <v-menu 
        activator="#sort-activator"
        location="bottom" 
        :close-on-content-click="false"
      >
        <v-sheet>
          <v-list>
            <v-list-item 
              v-for="item in filmStore.valuesOfSort"
              :key="item.id"
            >
              <v-list-item-title>
                <div>
                  {{ item.type }}
                </div>
                <div>
                  <v-btn 
                    class="mt-1 ml-3 mb-1"
                    title="По возрастанию"
                    variant="outlined"
                    :active="filmStore.ascBut[item.id]"
                    @click="filmStore.ascendingSort(item.id)"
                  >
                    <v-icon icon="mdi-sort-ascending" />
                  </v-btn>
                  <v-btn 
                    class="mt-1 ml-3 mb-1 mr-3" 
                    title="По убыванию" 
                    variant="outlined"
                    :active="filmStore.desBut[item.id]"
                    @click="filmStore.descendingSort(item.id)"
                  >
                    <v-icon icon="mdi-sort-descending" />
                  </v-btn>
                </div>
              </v-list-item-title>
            </v-list-item>    
          </v-list>
          <v-btn 
            class="w-100" 
            rounded="0" 
            color="error" 
            @click="filmStore.restartSort()"
          >
            Сбросить
          </v-btn>
        </v-sheet>
      </v-menu>
    </v-btn>
    <v-btn
      id="filter-activator" 
      class="ml-6 mt-1" 
      size="large" 
      elevation="0" 
      title="Фильтровать фильмы"
      variant="outlined"
    >
      <v-icon icon="mdi-filter" />
      <v-menu 
        activator="#filter-activator"
        location="bottom" 
        :close-on-content-click="false"
      >
        <v-sheet>
          <v-list>
            <v-list-item 
              v-for="(item, index) in filmStore.valuesOfSort"
              :key="item.id"
            >
              <v-list-item-title>
                <div>
                  {{ item.type }}
                </div>
                <div>
                  <v-range-slider 
                    v-model="filmStore.valuesOfRange[index]"
                    class="ml-5 mr-5 mt-7"
                    style="width: 200px"
                    :min="filmStore.borderValuesOfFilters[index][0]"
                    :max="filmStore.borderValuesOfFilters[index][1]"
                    thumb-label="always"
                    :step="filmStore.stepValue[index]"
                  />
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <div>
            <v-btn
              class="w-50"  
              rounded="0" 
              color="error" 
              @click="filmStore.restartFilter()"
            >
              Сбросить
            </v-btn>
            <v-btn
              class="w-50" 
              rounded="0"  
              variant="elevated" 
              color="accept" 
              @click="filmStore.filterInit()"
            >
              Применить
            </v-btn>
          </div>
        </v-sheet> 
      </v-menu>
    </v-btn>
  </v-container>
  <v-container 
    v-else 
    class="d-flex justify-center mt-10"
  >
    <v-btn 
      variant="outlined"
      @click="filmStore.backToSearch()"
    > 
      Вернуться к поиску 
    </v-btn>
  </v-container>
</template>

<script>
import { useFilmStore } from "@/store/filmStorage"

export default {
  data() {
    return {
      filmStore: useFilmStore()
      }
  },
}
</script>