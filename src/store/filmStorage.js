// Utilities
import { defineStore } from 'pinia'
import filmData from '../../dataset/kinopoisk-1.json'

export const useFilmStore = defineStore('filmStorage', {
  state: () => {
    return {
      posters: []
    }
  },
  actions : {
    moveToPosters(){
      //alert('Move to poster init')
      for(let i = 0; i < filmData.docs.length; i++) {
        if('poster' in filmData.docs[i]) {
          this.posters[i] = filmData.docs[i].poster.url
        }
        else {
          this.posters[i] = null;
        }
      }
    }
  }
})
