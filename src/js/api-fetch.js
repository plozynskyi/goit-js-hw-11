import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const API_KEY = '31765853-e30cfb70381adc432e0775e7f';
const BASE_URL = 'https://pixabay.com/api';

const options = {
  headers: {
    Authorization: API_KEY,
  },
};

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = '';
  }

  fetchArticles() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return fetch(url)
      .then(response => response.json())
      .then(({ hits, totalHits }) => {
        this.incrementPage();
        return { hits, totalHits };
      })
      .catch(console.error());
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
