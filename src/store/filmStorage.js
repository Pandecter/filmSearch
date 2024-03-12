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
      stepValue: [1, 0.1, 1],
      valuesOfRange: [],
      borderValuesOfFilters: [] ,
      inSortMode: false 
    }
  },
  actions : {
    moveToStorageArrays() {
      let arrOfYears = [];
      let arrOfRating = [];
      let arrOfLength = [];
      let arr = [];
      for(let i = 0; i < filmData.docs.length; i++) {
        this.filmDataStorage[i] = filmData.docs[i];
        this.selectedFilms[i] = filmData.docs[i];
       
        //this.filmNames[i] = filmData.docs[i].name;
        
        this.selectedFilms[i].rating.kp =  this.selectedFilms[i].rating.kp.toFixed(1);
        arrOfYears[i] = filmData.docs[i].year;
        arrOfRating[i] = filmData.docs[i].rating.kp;
        arrOfLength[i] = filmData.docs[i].movieLength;
      }

      // const min = 2024;
      // const max = 0;

      // this.borderValuesOfFilters.forEach(element => {
        
      // });

      this.borderValuesOfFilters.push(arr.slice());
      this.borderValuesOfFilters[0][0] = Math.min.apply(Math, arrOfYears);
      this.borderValuesOfFilters[0][1] = Math.max.apply(Math, arrOfYears);

      this.borderValuesOfFilters.push(arr.slice());
      this.borderValuesOfFilters[1][0] = Math.min.apply(Math, arrOfRating);
      this.borderValuesOfFilters[1][1] = Math.max.apply(Math, arrOfRating);

      this.borderValuesOfFilters.push(arr.slice());
      this.borderValuesOfFilters[2][0] = Math.min.apply(Math, arrOfLength);
      this.borderValuesOfFilters[2][1] = Math.max.apply(Math, arrOfLength);


      this.valuesOfRange = [...this.borderValuesOfFilters]

      this.end = this.countOfFilmsOnPage;
      this.updatePage();
    },
  
    filmResult() {
      if(this.curName == null) {
        this.selectedFilms = [...this.filmDataStorage];
        this.updatePage();
        
      }
      else {
        this.selectedFilms.length = 0;
        for(let i = 0; i < this.filmDataStorage.length; i++){
          if(this.filmDataStorage[i].name == this.curName) {
            this.selectedFilms.push(this.filmDataStorage[i]);
            this.currentPage = 1;
            this.updatePage();
            break;
          }
        }
        // this.updatePage();
        
      }
    },

    ascendingSort(choice) {
      let field = this.arrOfFields[choice];
      let result = this.selectedFilms;
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        return result.sort((a,b) => (a[field].kp > b[field].kp) ? 1 : ((b[field].kp > a[field].kp) ? -1 : 0))
      }
      return result.sort((a,b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0))
    },

    descendingSort(choice) {
      let field = this.arrOfFields[choice];
      let result = this.selectedFilms;
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        return result.sort((a,b) => (a[field].kp > b[field].kp) ? -1 : ((b[field].kp > a[field].kp) ? 1 : 0))
      }
      return result.sort((a,b) => (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0))
    },

    restartSort() {
      this.selectedFilms = [...this.filmDataStorage];
    },

    restartFilter() {
      this.selectedFilms = [...this.filmDataStorage];
      this.valuesOfRange = [...this.borderValuesOfFilters];
      this.updatePage();
      this.currentPage = 1;
      this.inSortMode = false;
    },

    updatePage() {
      this.paginationLength = Math.ceil(this.selectedFilms.length / this.countOfFilmsOnPage);
      this.start = this.countOfFilmsOnPage * (this.currentPage - 1);
      this.end = (this.countOfFilmsOnPage * this.currentPage);
    },

    filterFunc(value) {
      //if()//условие сорта...
      
      this.inSortMode = true;
      let yearCondition = (value.year >= this.valuesOfRange[0][0]) && (value.year <= this.valuesOfRange[0][1]);
      let ratingCondition = (value.rating.kp >= this.valuesOfRange[1][0]) && (value.rating.kp  <= this.valuesOfRange[1][1]);
      let lengthCondition = (value.movieLength >= this.valuesOfRange[2][0]) && (value.movieLength <= this.valuesOfRange[2][1]);
      if (yearCondition && ratingCondition && lengthCondition) {
        return true;
      }
      else {
        return false;
      }
    },

    filterInit(){
      this.selectedFilms = [...this.filmDataStorage];
      this.selectedFilms = this.selectedFilms.filter(this.filterFunc);
      this.currentPage = 1;
      this.updatePage();
    }

  },
  getters: {
    showResultArray() {
      return this.selectedFilms.slice(this.start, this.end);
    },

    filmNamesList() {
      for (let i = 0; i < this.selectedFilms.length; i++){
        this.filmNames[i] = this.selectedFilms[i].name;
      }
      return this.filmNames;
    }
  }
})
