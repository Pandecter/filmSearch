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
      ],
      start: 0,
      end: 0,
      arrOfFields : ["year", "rating", "movieLength"],
      //arr2 : [],
      borderValuesOfFilters: []  
    }
  },
  actions : {
    // compareFunc(fieldName) {
    //   this.arr2.push(Math)
    // },
    moveToStorageArrays() {
      let arrOfYears = [];
      let arrOfRating = [];
      let arrOfLength = [];
      //let arr = [];
      for(let i = 0; i < filmData.docs.length; i++) {
        this.filmDataStorage[i] = filmData.docs[i];
        this.filmNames[i] = filmData.docs[i].name;
        this.selectedFilms[i] = filmData.docs[i];
        arrOfYears[i] = filmData.docs[i].year;
        arrOfRating[i] = filmData.docs[i].rating.kp;
        arrOfLength[i] = filmData.docs[i].movieLength;
      }

      // for(let i = 0; i < this.arr.length; i++){
      //   this.compareFunc(arr[i]);
      // }

      // arr.push(Math.max.apply(Math, arrOfYears));
      // arr.push(Math.min.apply(Math, arrOfYears));
      // this.borderValuesOfFilters.push(arr);
      // arr.length = 0;
      
      // arr.push(Math.max.apply(Math, arrOfRating));
      // arr.push(Math.min.apply(Math, arrOfRating));
      // this.borderValuesOfFilters.push(arr);
      // arr.length = 0;

      // arr.push(Math.max.apply(Math, arrOfLength));
      // arr.push(Math.min.apply(Math, arrOfLength));
      // this.borderValuesOfFilters.push(arr);
      // arr.length = 0;

     


      // this.arr[0] = Math.max.apply(Math, arrOfRating);
      // this.arr[1] = Math.min.apply(Math, arrOfRating);
      // this.borderValuesOfFilters.push(arr);

      // this.arr[0] = Math.max.apply(Math, arrOfLength);
      // this.arr[1] = Math.min.apply(Math, arrOfLength);
      // this.borderValuesOfFilters.push(arr);

      // this.maxValues[0] = Math.max.apply(Math, arrOfYears);
      // this.maxValues[1] = Math.max.apply(Math, arrOfRating);
      // this.maxValues[2] = Math.max.apply(Math, arrOfLength);

      // this.minValues[0] = Math.min.apply(Math, arrOfYears);
      // this.minValues[1] = Math.min.apply(Math, arrOfRating);
      // this.minValues[2] = Math.min.apply(Math, arrOfLength);

      // for(let i = 1; i < this.selectedFilms.length; i++) {
      //   if(this.selectedFilms[i].year >=  this.selectedFilms[i - 1].year) {
      //     this.maxValues[0] = this.selectedFilms[i].year;
      //   }
      //   if(this.selectedFilms[i].rating.kp >=  this.selectedFilms[i - 1].rating.kp) {
      //     this.maxValues[1] = this.selectedFilms[i].rating.kp;
      //   }
      //   if(this.selectedFilms[i].movieLength >=  this.selectedFilms[i - 1].movieLength) {
      //     this.maxValues[2] = this.selectedFilms[i].movieLength;
      //   }

      //   if(this.selectedFilms[i].year <=  this.selectedFilms[i - 1].year) {
      //     this.minValues[0] = this.selectedFilms[i].year;
      //   }
      //   if(this.selectedFilms[i].rating.kp <=  this.selectedFilms[i - 1].rating.kp) {
      //     this.minValues[1] = this.selectedFilms[i].rating.kp;
      //   }
      //   if(this.selectedFilms[i].movieLength <=  this.selectedFilms[i - 1].movieLength) {
      //     this.minValues[2] = this.selectedFilms[i].movieLength;
      //   }
      // }

      this.paginationLength = Math.ceil(this.filmNames.length / this.countOfFilmsOnPage);
      this.end = this.countOfFilmsOnPage;
      this.updatePage();

      //console.log(this.selectedFilms.year);

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
      let field = this.arrOfFields[choice];
      let result = this.selectedFilms;
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет
        return result.sort((a,b) => (a[field].kp > b[field].kp) ? 1 : ((b[field].kp > a[field].kp) ? -1 : 0))
      }
      return result.sort((a,b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0))
    },

    descendingSort(choice) {
      let field = this.arrOfFields[choice];
      let result = this.selectedFilms;
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет
        return result.sort((a,b) => (a[field].kp > b[field].kp) ? -1 : ((b[field].kp > a[field].kp) ? 1 : 0))
      }
      return result.sort((a,b) => (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0))
    },

    restartSort() {
      this.selectedFilms = [...this.filmDataStorage];
    },

    updatePage() {
      this.start = this.countOfFilmsOnPage * (this.currentPage - 1);
      this.end = (this.countOfFilmsOnPage * this.currentPage);
    },
  },
  getters: {
    showResultArray() {
      return this.selectedFilms.slice(this.start, this.end);
    }
  }
})
