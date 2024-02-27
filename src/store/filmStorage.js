// Utilities
import { defineStore } from 'pinia'
import filmData from '../../dataset/kinopoisk-1.json'

export const useFilmStore = defineStore('filmStorage', {
  state: () => {
    return {
      filmDataStorage: [],
      filmNames: [],
      selectedFilms: [],
      paginationLength: 0,
      countOfFilmsOnPage: 25,
      currentPage: 1,
      curName: null,
      valuesOfSort: [{ type: 'По году', id: 0},
                     { type: 'По рейтингу', id: 1},
                     { type: 'По хронометражу', id: 2}
      ]
    }
  },
  actions : {
    moveToStorageArrays() {
      for(let i = 0; i < filmData.docs.length; i++) {
        this.filmDataStorage[i] = filmData.docs[i];
        this.filmNames[i] = filmData.docs[i].name;
        this.selectedFilms[i] = filmData.docs[i];
      }
      this.paginationLength = Math.ceil(this.filmNames.length / this.countOfFilmsOnPage);
    
    },
    filmResult() {
      if(this.curName == null) {
        this.selectedFilms = [...this.filmDataStorage];
      }
      else {
        this.selectedFilms.length = 0;
        for(let i = 0; i < this.filmDataStorage.length; i++){
          if(this.filmDataStorage[i].name == this.curName) {
            this.selectedFilms.push(this.filmDataStorage[i]);
            break;
          }
        }
      }
    },
    ascendingSort(choice) {
      switch(choice) {
        case 0:
          alert("по году");
          break;
        case 1:
          alert("по рейтингу");
          break;
        case 2:
          alert("по хроно");
          break;
      }
      // for(let i = 0; i + 1 < this.selectedFilms.length; ++i) {
      //   for(let j = 0; j + 1 < this.selectedFilms.length - i; ++j) {
      //     if(this.selectedFilms[j + 1].year < this.selectedFilms[j].year) {

      //     }
      //   }
      // }
    },
    updatePage() {

    },
  }
})
