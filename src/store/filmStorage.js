// Utilities
import { defineStore } from 'pinia'
import filmData from '../../dataset/kinopoisk-1.json'

export const useFilmStore = defineStore('filmStorage', {
  state: () => {
    return {
      filmDataStorage: [],
    }
  },
  actions : {
    moveToStorage(){
      for(let i = 0; i < filmData.docs.length; i++) {
        this.filmDataStorage[i] = filmData.docs[i];
      }
    }
  }
})
