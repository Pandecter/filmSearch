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
      curName: null
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
            console.log(this.curName + "/" +  this.filmDataStorage[i].name)
            this.selectedFilms.push(this.filmDataStorage[i]);
            break;
          }
        }
      }

    },
    updatePage() {

    },
  }
})
