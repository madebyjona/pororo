// Data
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

let lang = navigator.languages[1];

const countries = [
  {
    name: "usa",
    language: "en-US",
    flag: '🇺🇸',
  },
  {
    name: 'spain',
    language: 'es-ES',
    flag: '🇪🇸',
  },
  {
    name: "brazil",
    language: "pt-BR",
    flag: '🇧🇷',
  },
  {
    name: "france",
    language: "fr-FR",
    flag: '🇫🇷',
  },
  {
    name: "italia",
    language: "it-IT",
    flag: '🇮🇹',
  },
  {
    name: "germany",
    language: "de-DE",
    flag: '🇩🇪',
  },
  {
    name: "russia",
    language: "ru-RU",
    flag: '🇷🇺',
  },
  {
    name: "china",
    language: "zh-CN",
    flag: '🇨🇳',
  },
]

const textsLanguages = [
  { 
    name:'en',
    languageText: 'Language',
    tendencesTitle: 'Tendences', 
    categoriesTitle: 'Categories',
    likedTitle: 'Favorites Movies',
    relatedTitle: 'Similar Movies',
    btnMore: 'See More',
    inputSearch: 'Avengers',
  },
  {
    name:'es',
    languageText: 'Idioma',
    tendencesTitle: 'Tendencias', 
    categoriesTitle: 'Categorías',
    likedTitle: 'Películas Favoritas',
    relatedTitle: 'Películas Similares',
    btnMore: 'Ver más',
    inputSearch: 'Vengadores',
  },
  {
    name:'pt',
    languageText: 'Linguagem',
    tendencesTitle: 'Tendências', 
    categoriesTitle: 'Categorias',
    likedTitle: 'Filmes favoritos',
    relatedTitle: 'Filmes semelhantes',
    btnMore: 'Ver mais',
    inputSearch: 'Vingadores',
  },
  {
    name:'fr',
    languageText: 'Langue',
    tendencesTitle: 'Tendances', 
    categoriesTitle: 'Catégories',
    likedTitle: 'Films favoris',
    relatedTitle: 'Films similaires',
    btnMore: 'Voir plus',
    inputSearch: 'Vengeurs',
  },
  {
    name:'it',
    languageText: 'Lingua',
    tendencesTitle: 'Tendenze', 
    categoriesTitle: 'Categorie',
    likedTitle: 'Film preferiti',
    relatedTitle: 'Film simili',
    btnMore: 'Vedi altro',
    inputSearch: 'Vendicatori',
  },
  {
    name:'de',
    languageText: 'Sprache',
    tendencesTitle: 'Tendenzen', 
    categoriesTitle: 'Kategorien',
    likedTitle: 'Lieblingsfilme',
    relatedTitle: 'Ähnliche Filme',
    btnMore: 'Mehr sehen',
    inputSearch: 'Rächer',
  },
  {
    name:'ru',
    languageText: 'Язык',
    tendencesTitle: 'Тенденции', 
    categoriesTitle: 'Категории',
    likedTitle: 'Избранные фильмы',
    relatedTitle: 'Похожие фильмы',
    btnMore: 'Узнать больше',
    inputSearch: 'Мстители',
  },
  {
    name:'zh',
    languageText: '语',
    tendencesTitle: '趋势', 
    categoriesTitle: '类别',
    likedTitle: '最喜欢的电影',
    relatedTitle: '类似电影',
    btnMore: '看更多',
    inputSearch: '复仇者联盟',
  },
]

function getLanguages() {
  countries.forEach((country) => {
    const languageOption = document.createElement('option');
    languageOption.setAttribute('value', country.language );
    languageOption.setAttribute('for', 'language');
    const languageText = document.createTextNode(country.flag);
    languageOption.appendChild(languageText);
    languageOptions.appendChild(languageOption);
  });
}
getLanguages();





function changeTitles() {
  const textLang = lang.split('-')[0]
  const select = textsLanguages.find( ({name}) => name == textLang)
  languageText.textContent = select.languageText,
  tendencesTitle.textContent = select.tendencesTitle,
  categoriesTitle.textContent = select.categoriesTitle,
  likedTitle.textContent = select.likedTitle,
  relatedTitle.textContent = select.RelatedTitle,
  btnMore.textContent = select.btnMore,
  inputSearch.placeholder = select.inputSearch
}
changeTitles()

languageOptions.addEventListener("change", (event) => {
  lang = event.target.value;
  homePage();
  changeTitles()
});


function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;
  if (item) {
    movies = item;
  } else {
    movies = {};
  }
  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMoviesList();
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  } else {
    likedMovies[movie.id] = movie;
  }
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
  if (location.hash == "") {
    homePage();
  }
}

// Utils

let lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute("data-image");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovies(
  movies,
  container,
  { lazyLoad = true, clean = true } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    const movieImg = document.createElement("img");
    movieImg.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-image" : "src",
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );
    movieImg.addEventListener("error", () => {
      if (movie.genre_ids[0]) {
        movieImg.setAttribute(
          "src",
          `images/w300/bg-default-${movie.genre_ids[0]}.png`
        );
      } else {
        movieImg.setAttribute(
          "src",
          `images/w300/bg-default-28.png`
        );
      }
      const movieTitleText = document.createTextNode(
        movieImg.getAttribute("alt")
      );
      const movieTitle = document.createElement("span");
      movieContainer.appendChild(movieTitle);
      movieTitle.appendChild(movieTitleText);
    });
    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    likedMoviesList()[movie.id] && movieBtn.classList.add("movie-btn--liked");
    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likeMovie(movie);
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// Llamados a la API

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day", {
    params: {
      language: lang,
    },
  });
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList);
}

async function getCategegoriesPreview() {
  const { data } = await api("genre/movie/list", {
    params: {
      language: lang,
    },
  });
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
      language: lang,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection);
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("discover/movie", {
        params: {
          with_genres: id,
          language: lang,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      language: lang,
      query,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api("search/movie", {
        params: {
          language: lang,
          query,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day", {
    params: {
      language: lang,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 15;
  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api("trending/movie/day", {
      params: {
        language: lang,
        page,
      },
    });
    const movies = data.results;

    createMovies(movies, genericSection, { lazyLoad: true, clean: false });
  }
}

async function getMovieById(id) {
  const { data: movie } = await api("movie/" + id, {
    params: {
      language: lang,
    },
  });

  let movieImgUrl;

  if (movie.poster_path) {
    movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  } else if (movie.genres[0].id){
    movieImgUrl = `images/w300/bg-default-${movie.genres[0].id}.png`
  } else {
    movieImgUrl = `images/w300/bg-default-28.png`
  }
  

  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl})
  `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`, {
    params: {
      language: lang,
      page,
    },
  });
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();

  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, {
    lazyLoad: true,
    clean: true,
  });
}
