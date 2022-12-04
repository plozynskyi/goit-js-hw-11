import NewsApiService from './api-fetch';
import LoadMoreBtn from './components/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import '/node_modules/simplelightbox/dist/simple-lightbox.min.css';
import { getItemTemplate } from './template';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

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

  loadMoreBtn.show();
  newsApiService.resetPage();
  clearArticlesContainer();
  fetchArticles();
}

function fetchArticles() {
  loadMoreBtn.disable();
  newsApiService.fetchArticles().then(hits => {
    if (hits === []) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    appendArticlesMarkup(hits);

    loadMoreBtn.enable();
  });
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
