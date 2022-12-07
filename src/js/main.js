import NewsApiService from './api-fetch';
import LoadMoreBtn from './components/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import '/node_modules/simplelightbox/dist/simple-lightbox.min.css';
import { getItemTemplate } from './template';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  articlesContainer: document.querySelector('.photo-card'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();
  console.log(e.currentTarget.elements.searchQuery.value);
  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.searchQuery === '') {
    return Notify.failure('Введи что-то нормальное');
  }
  newsApiService.resetPage();
  clearArticlesContainer();
  fetchArticles();
}

function fetchArticles() {
  Loading.dots();
  Loading.change('Loading');
  loadMoreBtn.disable();
  newsApiService
    .fetchArticles()
    .then(hits => {
      appendArticlesMarkup(hits);
      if (hits.length > 0) {
        // loadMoreBtn.show();
        loadMoreBtn.enable();
      }
      console.log(hits.length);
      Loading.remove(1000);
    })
    .catch(console.error());
}

function appendArticlesMarkup(hits) {
  let listArticles = hits.map(getItemTemplate);

  refs.articlesContainer.insertAdjacentHTML('beforeend', listArticles.join(''));

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    disableRightClick: true,
  });
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}
