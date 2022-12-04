export const getItemTemplate = ({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  largeImageURL,
}) =>
  `
<div class="gallery__item photo-card">

    <a class="gallery__link" href="${largeImageURL}">
        <img src="${webformatURL}}" alt="${tags}" loading="lazy"/>
    </a>
    
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>

      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>

      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>

      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>

</div>

  `;
