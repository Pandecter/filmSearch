import { defineStore } from 'pinia'
import filmData from '../../dataset/kinopoisk-1.json'
import router from '@/router'

export const useFilmStore = defineStore('filmStorage', {
  state: () => {
    return {
      filmDataStorage: [], // массив данных, размер и порядок элементов которого не будет меняться
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
      desBut: [false, false, false],
      arrOfRecommended: [], //массив фильмов для рекомендаций
      similarFilms: [], //массив рекомендаций для конкретного фильма, который формируется при нажатии 
      onFavorites: false //необходим для отображения карточки фильма на странице поиска и в "избранное"
    }
  },
  actions : {
    moveToStorageArrays() { //функция, которая вызывается при запуске приложения
      const ARR_OF_YEARS = [];
      const ARR_OF_RATING = [];
      const ARR_OF_LENGTH = [];

      this.filmDataStorage = [...filmData.docs] //изначальный массив, взятый с JSON, над которым проводятся действия

      for (let i = 0; i < this.filmDataStorage.length; i++) {
        this.filmDataStorage[i] = {...this.filmDataStorage[i], filmRating: 0} //добавим поле с рейтингом 
        this.filmDataStorage[i] = {...this.filmDataStorage[i], isFavorite: false} //добавим поле для избранного
      }

      if (this.favorites !== null) { //если есть данные с localStorage
        for (let i = 0; i < this.favorites.length; i++) {
          const INDEX = this.filmDataStorage.findIndex((el) => el.id === this.favorites[i].id);
          this.filmDataStorage[INDEX] = this.favorites[i];
        }
      }
      
      this.arrOfRecommended = [...this.filmDataStorage] //создадим временный массив, который дополним полем рекомендованных фильмов
      this.arrOfRecommended.sort((a,b) =>  //сортируем массив по трем полям, чтоб сформировать схожие по рейтингу фильмы по возрастанию
        (a.rating.kp > b.rating.kp) ? 1 : (b.rating.kp > a.rating.kp) ? -1 : 0
      );

      for (let i = 0; i < this.filmDataStorage.length; i++) { 
        this.selectedFilms[i] = this.filmDataStorage[i]; 
        this.selectedFilms[i].rating.kp =  Number(this.selectedFilms[i].rating.kp).toFixed(1);

        ARR_OF_YEARS[i] = this.filmDataStorage[i].year;
        ARR_OF_RATING[i] = this.filmDataStorage[i].rating.kp;
        ARR_OF_LENGTH[i] = this.filmDataStorage[i].movieLength;
      }

      this.borderMaker(ARR_OF_YEARS, ARR_OF_RATING, ARR_OF_LENGTH);

      this.valuesOfRange = [...this.borderValuesOfFilters]; //заполним на старте значения текущей фильтрации граничными

      this.end = this.countOfFilmsOnPage;
      this.updatePage();
    },

    makeRecommendedList(currentFilm) {
        const FILM_ID = currentFilm.id;
        const INDEX = this.arrOfRecommended.findIndex((el) => el.id === FILM_ID); //ищем индекс текущего фильма в массиве похожих фильмов

        for (let i = 0; i < 4; i++) { 
          
          if (INDEX >= this.filmDataStorage.length - 2) {  //если фильм стоит после предпоследнего индекса включительно, то берем предыдущие 4 фильма
            this.similarFilms[i] = this.arrOfRecommended[this.arrOfRecommended.length - (3 + i)];
          }
          else if (INDEX <= 1) { //если фильм стоит до 1 индекса включительно, то берем следующие 4 фильма
            this.similarFilms[i] = this.arrOfRecommended[2 + i];
          }
          else {
            if(i <= 1) { //2 фильма ДО 
              this.similarFilms[i] = this.arrOfRecommended[INDEX - 1 - i];
            }
            else { //2 фильма ПОСЛЕ
              this.similarFilms[i] = this.arrOfRecommended[INDEX - 1 + i];
            }
          }
        }
      
    },

    borderMaker(years, ratings, lengths) { //функция, которая задает границы для фильтрации
      const ARR_FOR_BORDERS = [];

      this.borderValuesOfFilters.length = 0; //необходимо, чтоб массив при переходе со страницы на страницу бесконечно не заполнялся

      this.borderValuesOfFilters.push(ARR_FOR_BORDERS.slice());
      this.borderValuesOfFilters[0][0] = Math.min.apply(Math, years);
      this.borderValuesOfFilters[0][1] = Math.max.apply(Math, years);

      this.borderValuesOfFilters.push(ARR_FOR_BORDERS.slice());
      this.borderValuesOfFilters[1][0] = Math.min.apply(Math, ratings);
      this.borderValuesOfFilters[1][1] = Math.max.apply(Math, ratings);

      this.borderValuesOfFilters.push(ARR_FOR_BORDERS.slice());
      this.borderValuesOfFilters[2][0] = Math.min.apply(Math, lengths);
      this.borderValuesOfFilters[2][1] = Math.max.apply(Math, lengths);
    },
  
    filmResult() { //выводит результат поиска фильма
      this.searchMode = false;
      this.selectedFilms.length = 0;
      for (let i = 0; i < this.filmDataStorage.length; i++) {
        if (this.filmDataStorage[i].name == this.curName) {
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
      const FIELD = this.arrOfFields[choice];
      if (choice == 1) { // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        this.selectedFilms.sort((a,b) => (a[FIELD].kp > b[FIELD].kp) ? 1 : ((b[FIELD].kp > a[FIELD].kp) ? -1 : 0))
      }
      this.selectedFilms.sort((a,b) => (a[FIELD] > b[FIELD]) ? 1 : ((b[FIELD] > a[FIELD]) ? -1 : 0))
    },

    descendingSort(choice) { //сортировка по убыванию
      this.desBut.fill(false);
      this.ascBut.fill(false);
      this.desBut[choice] = true;
      this.sortChoice[0] = null;
      this.sortChoice[1] = choice;
      const FIELD = this.arrOfFields[choice];
      if (choice == 1) { // для "rating.kp" стандартный алгоритм работать не будет, cледовательно:
        this.selectedFilms.sort((a,b) => (a[FIELD].kp > b[FIELD].kp) ? -1 : ((b[FIELD].kp > a[FIELD].kp) ? 1 : 0))
      }
      this.selectedFilms.sort((a,b) => (a[FIELD] > b[FIELD]) ? -1 : ((b[FIELD] > a[FIELD]) ? 1 : 0))
    },

    restartSort() { //сброс сортровки
      if (this.inFilterMode === true) { 
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
      const YEAR_RESET_CONDITION = (this.valuesOfRange[0][0] == this.borderValuesOfFilters[0][0]) &&
                               (this.valuesOfRange[0][1] == this.borderValuesOfFilters[0][1]);
      const RATING_RESET_CONDITION = (this.valuesOfRange[1][0] == this.borderValuesOfFilters[1][0]) &&
                                 (this.valuesOfRange[1][1]  == this.borderValuesOfFilters[1][1]);
      const LENGTH_RESET_CONDITION = (this.valuesOfRange[2][0] == this.borderValuesOfFilters[2][0]) && 
                                 (this.valuesOfRange[2][1] == this.borderValuesOfFilters[2][1]);

      if (YEAR_RESET_CONDITION && RATING_RESET_CONDITION && LENGTH_RESET_CONDITION) { //условие прекращения фильтрации
        this.inFilterMode = false;
        this.currentPage = 1;
        this.updatePage();
      }
      else { // условие начала фильтрации (необходимо для корректной работы поиска)
        this.inFilterMode = true;
      }

      const YEAR_TRUE_CONDITION = (value.year >= this.valuesOfRange[0][0]) &&
                              (value.year <= this.valuesOfRange[0][1]);
      const RATING_TRUE_CONDITION = (value.rating.kp >= this.valuesOfRange[1][0]) &&
                                (value.rating.kp  <= this.valuesOfRange[1][1]);
      const LENGTH_TRUE_CONDITION = (value.movieLength >= this.valuesOfRange[2][0]) &&
                                (value.movieLength <= this.valuesOfRange[2][1]);
      return (YEAR_TRUE_CONDITION && RATING_TRUE_CONDITION && LENGTH_TRUE_CONDITION)
    },

    favoritesFilterFunc(value) { //метод фильтрации для закладок (т. к. переменная другая)
      const YEAR_RESET_CONDITION_FAVORITES = (this.valueOfRangeFavorites[0][0] == this.borderValuesOfFilters[0][0]) &&
                               (this.valueOfRangeFavorites[0][1] == this.borderValuesOfFilters[0][1]);
      const RATING_RESET_CONDITION_FAVORITES = (this.valueOfRangeFavorites[1][0] == this.borderValuesOfFilters[1][0]) &&
                                 (this.valueOfRangeFavorites[1][1]  == this.borderValuesOfFilters[1][1]);
      const LENGTH_RESET_CONDITION_FAVORITES = (this.valueOfRangeFavorites[2][0] == this.borderValuesOfFilters[2][0]) && 
                                 (this.valueOfRangeFavorites[2][1] == this.borderValuesOfFilters[2][1]);

      if (YEAR_RESET_CONDITION_FAVORITES && RATING_RESET_CONDITION_FAVORITES && LENGTH_RESET_CONDITION_FAVORITES) { 
        this.favorites = JSON.parse(localStorage.getItem("favorites")); 
        this.favoritesInFilterMode = false;
      }
      else {
        this.favoritesInFilterMode = true;
      }

      const YEAR_TRUE_CONDITION_FAVORITES = (value.year >= this.valueOfRangeFavorites[0][0]) &&
                              (value.year <= this.valueOfRangeFavorites[0][1]);
      const RATING_TRUE_CONDITION_FAVORITES = (value.rating.kp >= this.valueOfRangeFavorites[1][0]) &&
                                (value.rating.kp  <= this.valueOfRangeFavorites[1][1]);
      const LENGTH_TRUE_CONDITION_FAVORITES = (value.movieLength >= this.valueOfRangeFavorites[2][0]) &&
                                (value.movieLength <= this.valueOfRangeFavorites[2][1]);
      return (YEAR_TRUE_CONDITION_FAVORITES && RATING_TRUE_CONDITION_FAVORITES && LENGTH_TRUE_CONDITION_FAVORITES)
    },

    filterInit(){ //вызов фильтрации для главной страницы
      this.selectedFilms = [...this.filmDataStorage];
      this.selectedFilms = this.selectedFilms.filter(this.filterFunc);
      if (this.selectedFilms.length === 0) {
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
      if (this.favorites.length === 0) {
        this.favoritesResults = false;
      }
      else {
        this.favoritesResults = true;
      }
    },

    backToSearch() { //метод, который позволяет вернуться к поиску фильмов
      this.curName = null;
      if (this.inFilterMode == true) {
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
      if (arrayOfChoices[0] == null) { 
        this.descendingSort(arrayOfChoices[1]);
      }
      else {
        this.ascendingSort(arrayOfChoices[0]);
      }
    },

    moveToFavorites(filmData) { //метод, который добавляет фильм в закладки
      if (!(this.favorites.find((el) => el.id === filmData.id))) {
        filmData.isFavorite = true;
        this.favorites.push(filmData);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      }
      else { //если элемент повторяется, то подразумевается, что пользователь мог изменить оценку (кнопку трогать он не может)
        const INDEX = this.favorites.findIndex((el) => el.id === filmData.id);
        this.favorites[INDEX].filmRating = filmData.filmRating;
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      }
      this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
    },

    removeFromFavorites(filmData) { //метод, который убирает фильм из закладок
      let updatedStorage = JSON.parse(localStorage.getItem("favorites")); //обновляем (удаляем элемент) список закладок
      const TEMP_NAME = filmData.name;
      updatedStorage = updatedStorage.filter(item => item.name !== TEMP_NAME);
      localStorage.setItem("favorites", JSON.stringify(updatedStorage));

      const INDEX = this.filmDataStorage.findIndex(el => el.name === TEMP_NAME); //обнуляем данные для корректной работы
      this.filmDataStorage[INDEX].filmRating = 0;
      this.filmDataStorage[INDEX].isFavorite = false;
      this.favorites = this.favorites.filter(item => item.name !== TEMP_NAME);
      this.favoritesBorderChanger();
      this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
    },

    favoritesPageBorderMaker() { //метод, который позволяет перейти к странице закладок и сформировать границы
      this.favoritesBorderChanger();
      if (this.valueOfRangeFavorites.length === 0) {
        this.valueOfRangeFavorites = [...this.borderValuesOfFilters];
      }
    },

    toMainPage() { //метод, который позволяет перейти к основной странице и сформировать границы
      this.onFavorites = false;
      if (this.favoritesInFilterMode) {
        this.dialog = true;
      }
      else{
        this.dialog = false;
        router.push('/');
        const ARR_OF_YEARS = [];
        const ARR_OF_RATING = [];
        const ARR_OF_LENGTH = [];
        for (let i = 0; i < this.filmDataStorage.length; i++) { 
          ARR_OF_YEARS[i] = this.filmDataStorage[i].year;
          ARR_OF_RATING[i] = this.filmDataStorage[i].rating.kp;
          ARR_OF_LENGTH[i] = this.filmDataStorage[i].movieLength;
        }
        this.borderMaker(ARR_OF_YEARS, ARR_OF_RATING, ARR_OF_LENGTH);
      }
    },
    
    favoritesBorderChanger() { //вспомогательный метод, который меняет границы фильтрации при удалении/добавлении закладок
      const YEARS_FAVORITES = [];
      const RATING_FAVORITES = [];
      const LENGTH_FAVORITES = [];
      for (let i = 0; i < this.favorites.length; i++) { 
        YEARS_FAVORITES[i] = this.favorites[i].year;
        RATING_FAVORITES[i] = this.favorites[i].rating.kp;
        LENGTH_FAVORITES[i] = this.favorites[i].movieLength;
      }
      this.borderMaker(YEARS_FAVORITES, RATING_FAVORITES, LENGTH_FAVORITES);
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
      for (let i = 0; i < this.selectedFilms.length; i++) {
        this.filmNames.push(this.selectedFilms[i].name);
      }
      return this.filmNames;
    },
  }
})