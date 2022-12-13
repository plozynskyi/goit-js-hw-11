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

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  disableRightClick: true,
  overlayOpacity: 0.5,
});

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

async function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newsApiService.searchQuery === '') {
    return Notify.failure('Enter the correct value to search for');
  }

  newsApiService.resetPage();

  clearArticlesContainer();
  Loading.circle('Loading...', {
    messageFontSize: '24px',
    messageColor: '#8430c8',
    svgSize: '100px',
    svgColor: '#8430c8',
  });
  const { hits, totalHits } = await newsApiService.fetchArticles();

  appendArticlesMarkup(hits);

  Loading.remove();

  if (hits.length > 0) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    loadMoreBtn.show();
  } else {
    loadMoreBtn.hide(),
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  }
}

async function fetchArticles() {
  loadMoreBtn.disable();
  Loading.circle('Loading...', {
    messageFontSize: '24px',
    messageColor: '#8430c8',
    svgSize: '100px',
    svgColor: '#8430c8',
  });
  const { hits } = await newsApiService.fetchArticles();
  appendArticlesMarkup(hits);
  Loading.remove();
  loadMoreBtn.enable();

  if (hits.length > 0) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    loadMoreBtn.show();
  } else {
    loadMoreBtn.hide(),
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
  }
  console.log(hits);
  // smoothScroll();
}

function appendArticlesMarkup(hits) {
  let listArticles = hits.map(getItemTemplate);

  refs.articlesContainer.insertAdjacentHTML('beforeend', listArticles.join(''));
  gallery.refresh();
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

// function smoothScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();
//   console.log(window.scrollBy());
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
