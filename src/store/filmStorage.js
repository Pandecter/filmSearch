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
      inFilterMode: false,
      searchMode: true,
      sortChoice: [null, null], // где [0] - по-возрастанию, [1] - по-убыванию,
      //overlayToggle: false
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
      this.searchMode = false;
      this.selectedFilms.length = 0;
      for(let i = 0; i < this.filmDataStorage.length; i++){
        if(this.filmDataStorage[i].name == this.curName) {
          this.selectedFilms.push(this.filmDataStorage[i]);
          this.currentPage = 1;
          this.updatePage();
          break;
        }
      }
      
    },

    ascendingSort(choice) {
      this.sortChoice[0] = choice;
      this.sortChoice[1] = null;  
      let field = this.arrOfFields[choice];
      //let result = this.selectedFilms;
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        this.selectedFilms.sort((a,b) => (a[field].kp > b[field].kp) ? 1 : ((b[field].kp > a[field].kp) ? -1 : 0))
      }
      this.selectedFilms.sort((a,b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0))
    },

    descendingSort(choice) {
      this.sortChoice[0] = null;
      this.sortChoice[1] = choice;
      let field = this.arrOfFields[choice];
      //let result = this.selectedFilms;
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        this.selectedFilms.sort((a,b) => (a[field].kp > b[field].kp) ? -1 : ((b[field].kp > a[field].kp) ? 1 : 0))
      }
      this.selectedFilms.sort((a,b) => (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0))
    },

    restartSort() {
      this.selectedFilms = [...this.filmDataStorage];
      this.sortChoice[0] = null;
      this.sortChoice[1] = null;
    },

    restartFilter() {
      this.selectedFilms = [...this.filmDataStorage];
      this.valuesOfRange = [...this.borderValuesOfFilters];
      this.updatePage();
      this.currentPage = 1;
      this.inFilterMode = false;
      this.sortType(this.sortChoice);
    },

    updatePage() {
      this.paginationLength = Math.ceil(this.selectedFilms.length / this.countOfFilmsOnPage);
      this.start = this.countOfFilmsOnPage * (this.currentPage - 1);
      this.end = (this.countOfFilmsOnPage * this.currentPage);
    },

    filterFunc(value) {
      let yearResetCondition = (this.valuesOfRange[0][0] == this.borderValuesOfFilters[0][0]) &&
                               (this.valuesOfRange[0][1] == this.borderValuesOfFilters[0][1]);
      let ratingResetCondition = (this.valuesOfRange[1][0] == this.borderValuesOfFilters[1][0]) &&
                                 (this.valuesOfRange[1][1]  == this.borderValuesOfFilters[1][1]);
      let lengthResetCondition = (this.valuesOfRange[2][0] == this.borderValuesOfFilters[2][0]) && 
                                 (this.valuesOfRange[2][1] == this.borderValuesOfFilters[2][1]);

      let yearTrueCondition = (value.year >= this.valuesOfRange[0][0]) &&
                              (value.year <= this.valuesOfRange[0][1]);
      let ratingTrueCondition = (value.rating.kp >= this.valuesOfRange[1][0]) &&
                                (value.rating.kp  <= this.valuesOfRange[1][1]);
      let lengthTrueCondition = (value.movieLength >= this.valuesOfRange[2][0]) &&
                                (value.movieLength <= this.valuesOfRange[2][1]);

      if(yearResetCondition && ratingResetCondition && lengthResetCondition) { //условие прекращения фильтрации
        this.inFilterMode = false;
      }
      else { // условие начала фильтрации (необходимо для корректной работы поиска)
        this.inFilterMode = true;
      }
      return (yearTrueCondition && ratingTrueCondition && lengthTrueCondition)
    },

    filterInit(){
      this.selectedFilms = [...this.filmDataStorage];
      this.selectedFilms = this.selectedFilms.filter(this.filterFunc);
      this.currentPage = 1;

      this.sortType(this.sortChoice);
      this.updatePage();
    },

    backToSearch() {
      this.curName = null;
      if(this.inFilterMode == true) {
        this.filterInit();
      }
      else {
        this.selectedFilms = [...this.filmDataStorage];
        this.updatePage();
      }
      this.searchMode = true;
      this.sortType(this.sortChoice); 
    },

    sortType(arrayOfChoices) { //функция вызова одной из сортировок
      if(arrayOfChoices[0] == null) { 
        this.descendingSort(arrayOfChoices[1]);
      }
      else {
        this.ascendingSort(arrayOfChoices[0]);
      }
    },

    // overlay() {
    //   this.overlayToggle != this.overlayToggle;
    // }

  },
  getters: {
    showResultArray() {
      return this.selectedFilms.slice(this.start, this.end);
    },

    filmNamesList() {
      this.filmNames.length = 0;
      for (let i = 0; i < this.selectedFilms.length; i++){
        this.filmNames.push(this.selectedFilms[i].name);
      }
      return this.filmNames;
    }
  }
})

// на 14.03:
// 1) Нужно вывести сообщение о том, что результатов нет при: поиске/фильтрации.
// 2) 404 error
// 3) Подсвечивать использованные кнопки сортировки
