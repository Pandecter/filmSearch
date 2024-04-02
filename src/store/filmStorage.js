import { defineStore } from 'pinia'
import filmData from '../../dataset/kinopoisk-1.json'

//const STORE_NAME = 'main';

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
      favButtonValue: "Добавить в закладки",
      favorites: [],
      results: true,
      ascBut: [false, false, false],
      desBut: [false, false, false] 
      // favs.find((film) => film.id === id): [
      //   {
      //     film: "obj",
      //     rating: 5, 
      //   },
      // ]
    }
  },
  actions : {
    moveToStorageArrays() {
      let arrOfYears = [];
      let arrOfRating = [];
      let arrOfLength = [];
      let arrForBorders = [];
      let tempArr = []; 

      this.filmDataStorage = [...filmData.docs] //изначальный массив, взятый с JSON, над которым проводятся действия
      
      tempArr = [...filmData.docs] //создадим временный массив, который дополним полем рекомендованных фильмов
      tempArr.sort((a,b) =>  //сортируем массив по трем полям, чтоб сформировать схожие по рейтингу фильмы по возрастанию
        (a.rating.kp > b.rating.kp) ? 1 : (b.rating.kp > a.rating.kp) ? -1 : 0
      );

      for(let i = 0; i < this.filmDataStorage.length; i++) {
        let filmId = this.filmDataStorage[i].id;
        this.filmDataStorage[i] = {...this.filmDataStorage[i], similarFilms: []} //добавим поле с реком. фильмами
        this.filmDataStorage[i] = {...this.filmDataStorage[i], filmRating: 0} //добавим поле с рейтингом 
        this.filmDataStorage[i] = {...this.filmDataStorage[i], isFavorite: false} //добавим поле для избранного
        let index = tempArr.findIndex((el) => el.id === filmId);

        for(let j = 0; j < 4; j++) { 
          if(index >= this.filmDataStorage.length - 2) {  //если фильм стоит после предпоследнего индекса включительно, то берем предыдущие 4 фильма
            this.filmDataStorage[i].similarFilms[j] = tempArr[this.filmDataStorage.length - (2 + j)];
          }
          else if(index <= 1) { //если фильм стоит до 1 индекса включительно, то берем следующие 4 фильма
            this.filmDataStorage[i].similarFilms[j] = tempArr[2 + j];
          }
          else {
            if(j <= 1) { //2 фильма ДО 
              this.filmDataStorage[i].similarFilms[j] = tempArr[index - 1 - j];
            }
            else { //2 фильма ПОСЛЕ
              this.filmDataStorage[i].similarFilms[j] = tempArr[index - 1 + j];
            }
          }
        }
      } 

      console.log(tempArr);

      if(this.favorites !== null) { //если есть данные с localStorage
        //console.log(this.favorites.length)
        for(let i = 0; i < this.favorites.length; i++) {
          let index = this.filmDataStorage.findIndex((el) => el.id === this.favorites[i].id);
          console.log(this.favorites[i])
          this.filmDataStorage[index] = this.favorites[i];
        }
      }

      for(let i = 0; i < this.filmDataStorage.length; i++) { 
        this.selectedFilms[i] = this.filmDataStorage[i]; //массив, который отоборажает выбранные фильмы с учетом сортировок/фильтров и тд
        this.selectedFilms[i].rating.kp =  Number(this.selectedFilms[i].rating.kp).toFixed(1);

        arrOfYears[i] = this.filmDataStorage[i].year;
        arrOfRating[i] = this.filmDataStorage[i].rating.kp;
        arrOfLength[i] = this.filmDataStorage[i].movieLength;
      }

      this.borderValuesOfFilters.push(arrForBorders.slice());
      this.borderValuesOfFilters[0][0] = Math.min.apply(Math, arrOfYears);
      this.borderValuesOfFilters[0][1] = Math.max.apply(Math, arrOfYears);

      this.borderValuesOfFilters.push(arrForBorders.slice());
      this.borderValuesOfFilters[1][0] = Math.min.apply(Math, arrOfRating);
      this.borderValuesOfFilters[1][1] = Math.max.apply(Math, arrOfRating);

      this.borderValuesOfFilters.push(arrForBorders.slice());
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
      this.desBut.fill(false);
      this.ascBut.fill(false);
      this.ascBut[choice] = true;
      this.sortChoice[0] = choice;
      this.sortChoice[1] = null;  
      let field = this.arrOfFields[choice];
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        this.selectedFilms.sort((a,b) => (a[field].kp > b[field].kp) ? 1 : ((b[field].kp > a[field].kp) ? -1 : 0))
      }
      this.selectedFilms.sort((a,b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0))
    },

    descendingSort(choice) {
      this.desBut.fill(false);
      this.ascBut.fill(false);
      this.desBut[choice] = true;
      this.sortChoice[0] = null;
      this.sortChoice[1] = choice;
      let field = this.arrOfFields[choice];
      if(choice == 1){ // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        this.selectedFilms.sort((a,b) => (a[field].kp > b[field].kp) ? -1 : ((b[field].kp > a[field].kp) ? 1 : 0))
      }
      this.selectedFilms.sort((a,b) => (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0))
    },

    restartSort() {
      this.selectedFilms = [...this.filmDataStorage];
      this.sortChoice[0] = null;
      this.sortChoice[1] = null;
      this.desBut.fill(false);
      this.ascBut.fill(false);
    },

    restartFilter() {
      this.selectedFilms = [...this.filmDataStorage];
      this.valuesOfRange = [...this.borderValuesOfFilters];
      this.updatePage();
      this.currentPage = 1;
      this.inFilterMode = false;
      this.sortType(this.sortChoice);
      this.results = true;
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
      if(this.selectedFilms.length === 0) {
        this.results = false;
      }
      else {
        this.results = true;
      }
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

    moveToFavorites(filmData) {
      if(!(this.favorites.find((el) => el.id === filmData.id))) {
        filmData.isFavorite = true;
        this.favorites.push(filmData);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      }
      else { //если элемент повторяется, то подразумевается, что пользователь мог изменить оценку (кнопку трогать он не может)
        let index = this.favorites.findIndex((el) => el.id === filmData.id);
        this.favorites[index].filmRating = filmData.filmRating;
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      }
    },

    

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
    },

    // getFavorites() {
    //   return this.selectedFilms.filter((el) => el.isFavorite === true);
    // },

    // returnButtonName() {
    //   return this.favButtonValue = this.favButtonValue === "Добавить в закладки" ? "Добавлено" : "Добавить в закладки";
    // }
  
  }
})

// на 28.03:
// (solved) 1) Нужно вывести сообщение о том, что результатов нет при: поиске/фильтрации.
// (solved) 2) 404 error
// 3) Подсвечивать использованные кнопки сортировки
// (solved) 4) Проблема с изображениями: возможно, первая парадигма работать не будет. В некоторых местах текста много...
// 5) Некоторые поля фильма пустые 
// 6) Изображения не оч
// 7) Звезда не там находится
// (solved) 8) разобраться с LocalStorage
// (solved) 9) No data available в поиске
// (solved) 10) некорректные индексы
// (solved) 11) toggleTheme при смене страниц работает некорректно
