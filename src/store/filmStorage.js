import { defineStore } from 'pinia'
import filmData from '../../dataset/kinopoisk-1.json'
import router from '@/router'

export const useFilmStore = defineStore('filmStorage', {
  state: () => {
    return {
      filmDataStorage: [], // массив данных, который не будет меняться
      filmNames: [],
      selectedFilms: [], //здесь будут хранится фильмы с учетом фильтрации/сортировки
      paginationLength: 0,
      countOfFilmsOnPage: 25,
      currentPage: 1,
      curName: null, //поле ввода названия
      valuesOfSort: [{ type: 'По году', id: 0},
                     { type: 'По рейтингу', id: 1},
                     { type: 'По хронометражу', id: 2} //виды сортировок
      ],
      start: 0, //начало для пагинации
      end: 0, //конец для пагинации
      arrOfFields : ["year", "rating", "movieLength"], //используется для "вставки" в функциях сортировки
      stepValue: [1, 0.1, 1], //шаги для ползунков фильтрации
      valuesOfRange: [], //значения фильтров на основной странице
      valueOfRangeFavorites: [], //значения фильтров на странице закладок
      borderValuesOfFilters: [], //граничные значения фильтров (меняются от страницы к странице)
      inFilterMode: false, //bool значения для корректной работы сортировки в процессе фильтрации
      favoritesInFilterMode: false, //аналогично для страницы закладок
      dialog: false, //условие всплывающего окна на странице закладок
      favoritesResults: true, //условие для отображения "нет результатов" для страницы закладок
      results: true, //аналогично для основной страницы
      searchMode: true, //условие для перехода в режим поиска/отображения всех фильмов на основной странице
      sortChoice: [null, null], // где [0] - по-возрастанию, [1] - по-убыванию,
      favButtonValue: "Добавить в закладки", 
      favorites: [], //массив фильмов, добавленных в закладки
      ascBut: [false, false, false], //необходимы для пометки кнопки конкретной сортировки как активной
      desBut: [false, false, false] 
    }
  },
  actions : {
    moveToStorageArrays() { //функция, которая вызывается при запуске приложения
      let arrOfYears = [];
      let arrOfRating = [];
      let arrOfLength = [];
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
        let index = tempArr.findIndex((el) => el.id === filmId); //ищем индекс текущего фильма в массиве похожих фильмов

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

      if(this.favorites !== null) { //если есть данные с localStorage
        for(let i = 0; i < this.favorites.length; i++) {
          let index = this.filmDataStorage.findIndex((el) => el.id === this.favorites[i].id);
          this.filmDataStorage[index] = this.favorites[i];
        }
      }

      for(let i = 0; i < this.filmDataStorage.length; i++) { 
        this.selectedFilms[i] = this.filmDataStorage[i]; 
        this.selectedFilms[i].rating.kp =  Number(this.selectedFilms[i].rating.kp).toFixed(1);

        arrOfYears[i] = this.filmDataStorage[i].year;
        arrOfRating[i] = this.filmDataStorage[i].rating.kp;
        arrOfLength[i] = this.filmDataStorage[i].movieLength;
      }

      this.borderMaker(arrOfYears, arrOfRating, arrOfLength);

      this.valuesOfRange = [...this.borderValuesOfFilters]; //заполним на старте значения текущей фильтрации граничными

      this.end = this.countOfFilmsOnPage;
      this.updatePage();
    },

    borderMaker(years, ratings, lengths) { //функция, которая задает границы для фильтрации
      let arrForBorders = [];

      this.borderValuesOfFilters.length = 0; //необходимо, чтоб массив при переходе со страницы на страницу бесконечно не заполнялся

      this.borderValuesOfFilters.push(arrForBorders.slice());
      this.borderValuesOfFilters[0][0] = Math.min.apply(Math, years);
      this.borderValuesOfFilters[0][1] = Math.max.apply(Math, years);

      this.borderValuesOfFilters.push(arrForBorders.slice());
      this.borderValuesOfFilters[1][0] = Math.min.apply(Math, ratings);
      this.borderValuesOfFilters[1][1] = Math.max.apply(Math, ratings);

      this.borderValuesOfFilters.push(arrForBorders.slice());
      this.borderValuesOfFilters[2][0] = Math.min.apply(Math, lengths);
      this.borderValuesOfFilters[2][1] = Math.max.apply(Math, lengths);
    },
  
    filmResult() { //выводит результат поиска фильма
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

    ascendingSort(choice) { //сортировка по возрастанию
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

    descendingSort(choice) { //сортировка по убыванию
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

    restartSort() { //сброс сортровки
      if(this.inFilterMode === true){ 
        this.selectedFilms = [...this.filmDataStorage];
        this.selectedFilms = this.selectedFilms.filter(this.filterFunc);
      }
      else {
        this.selectedFilms = [...this.filmDataStorage];
      }
      this.sortChoice[0] = null;
      this.sortChoice[1] = null;
      this.desBut.fill(false);
      this.ascBut.fill(false);
    },

    restartFilter() { //сброс фильтров
      this.selectedFilms = [...this.filmDataStorage];
      this.valuesOfRange = [...this.borderValuesOfFilters];
      this.currentPage = 1;
      this.updatePage();
      this.inFilterMode = false;
      this.sortType(this.sortChoice);
      this.results = true;
    },

    restartFavoritesFilter() { //сброс фильтров на странице закладок
      this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
      this.favorites = JSON.parse(localStorage.getItem("favorites"));
      this.favoritesInFilterMode = false;
      this.favoritesResults = true;
    },

    updatePage() { //метод, который отвечает за работу пагинации и корректное отображение главной страницы
      this.paginationLength = Math.ceil(this.selectedFilms.length / this.countOfFilmsOnPage);
      this.start = this.countOfFilmsOnPage * (this.currentPage - 1);
      this.end = (this.countOfFilmsOnPage * this.currentPage);
    },

    filterFunc(value) { //метод фильтрации для главной страницы
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
        this.currentPage = 1;
        this.updatePage();
      }
      else { // условие начала фильтрации (необходимо для корректной работы поиска)
        this.inFilterMode = true;
      }
      return (yearTrueCondition && ratingTrueCondition && lengthTrueCondition)
    },

    favoritesFilterFunc(value) { //метод фильтрации для закладок (т. к. переменная другая)
      let yearResetConditionFavorites = (this.valueOfRangeFavorites[0][0] == this.borderValuesOfFilters[0][0]) &&
                               (this.valueOfRangeFavorites[0][1] == this.borderValuesOfFilters[0][1]);
      let ratingResetConditionFavorites = (this.valueOfRangeFavorites[1][0] == this.borderValuesOfFilters[1][0]) &&
                                 (this.valueOfRangeFavorites[1][1]  == this.borderValuesOfFilters[1][1]);
      let lengthResetConditionFavorites = (this.valueOfRangeFavorites[2][0] == this.borderValuesOfFilters[2][0]) && 
                                 (this.valueOfRangeFavorites[2][1] == this.borderValuesOfFilters[2][1]);

      if(yearResetConditionFavorites && ratingResetConditionFavorites && lengthResetConditionFavorites) { 
        this.favorites = JSON.parse(localStorage.getItem("favorites")); 
        this.favoritesInFilterMode = false;
      }
      else {
        this.favoritesInFilterMode = true;
      }

      let yearTrueConditionFavorites = (value.year >= this.valueOfRangeFavorites[0][0]) &&
                              (value.year <= this.valueOfRangeFavorites[0][1]);
      let ratingTrueConditionFavorites = (value.rating.kp >= this.valueOfRangeFavorites[1][0]) &&
                                (value.rating.kp  <= this.valueOfRangeFavorites[1][1]);
      let lengthTrueConditionFavorites = (value.movieLength >= this.valueOfRangeFavorites[2][0]) &&
                                (value.movieLength <= this.valueOfRangeFavorites[2][1]);
      return (yearTrueConditionFavorites && ratingTrueConditionFavorites && lengthTrueConditionFavorites)
    },

    filterInit(){ //вызов фильтрации для главной страницы
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

    favoritesFilterInit() { //вызов фильтрации для закладок
      this.favorites = JSON.parse(localStorage.getItem("favorites")); 
      this.favorites = this.favorites.filter(this.favoritesFilterFunc);
      if(this.favorites.length === 0) {
        this.favoritesResults = false;
      }
      else {
        this.favoritesResults = true;
      }
    },

    backToSearch() { //метод, который позволяет вернуться к поиску фильмов
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

    moveToFavorites(filmData) { //метод, который добавляет фильм в закладки
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
      this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
    },

    removeFromFavorites(filmData) { //метод, который убирает фильм из закладок
      let updatedStorage = JSON.parse(localStorage.getItem("favorites")); //обновляем (удаляем элемент) список закладок
      let tempName = filmData.name;
      updatedStorage = updatedStorage.filter(item => item.name !== tempName);
      localStorage.setItem("favorites", JSON.stringify(updatedStorage));

      let index = this.filmDataStorage.findIndex(el => el.name === tempName); //обнуляем данные для корректной работы
      this.filmDataStorage[index].filmRating = 0;
      this.filmDataStorage[index].isFavorite = false;
      this.favorites = this.favorites.filter(item => item.name !== tempName);
      this.favoritesBorderChanger();
      this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
    },

    toFavoritesPage() { //метод, который позволяет перейти к странице закладок и сформировать границы
      this.favoritesBorderChanger();
      if(this.valueOfRangeFavorites.length === 0) {
        
        this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
      }
      router.push('/favorites');
    },

    toMainPage() { //метод, который позволяет перейти к основной странице и сформировать границы
      if(this.favoritesInFilterMode) {
        this.dialog = true;
      }
      else{
        this.dialog = false;
        router.push('/');
        let arrOfYears = [];
        let arrOfRating = [];
        let arrOfLength = [];
        for(let i = 0; i < this.filmDataStorage.length; i++) { 
          arrOfYears[i] = this.filmDataStorage[i].year;
          arrOfRating[i] = this.filmDataStorage[i].rating.kp;
          arrOfLength[i] = this.filmDataStorage[i].movieLength;
        }
        this.borderMaker(arrOfYears, arrOfRating, arrOfLength);
      }
    },
    
    favoritesBorderChanger() { //вспомогательный метод, который меняет границы фильтрации при удалении/добавлении закладок
      let yearsFavorite = [];
      let ratingsFavorite = [];
      let lengthsFavorite = [];
      for(let i = 0; i < this.favorites.length; i++) { 
        yearsFavorite[i] = this.favorites[i].year;
        ratingsFavorite[i] = this.favorites[i].rating.kp;
        lengthsFavorite[i] = this.favorites[i].movieLength;
      }
      this.borderMaker(yearsFavorite, ratingsFavorite, lengthsFavorite);
    },

    fromDialogToMainPage() { //метод, который вызывается из диалогового онка
      router.push('/');
      this.restartFavoritesFilter();
      this.dialog = false;
    }
  },
  getters: {
    showResultArray() { //показывает результат фильтрации/сортировки
      return this.selectedFilms.slice(this.start, this.end);
    },

    filmNamesList() { //показывает названия фильмов в v-autocomplete
      this.filmNames.length = 0;
      for (let i = 0; i < this.selectedFilms.length; i++){
        this.filmNames.push(this.selectedFilms[i].name);
      }
      return this.filmNames;
    },
  }
})



