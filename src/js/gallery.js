import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formElem: document.querySelector('.search-form'),
  galleryElem: document.querySelector('.gallery'),
  searchBtn: document.querySelector('.search-btn'),
  loaderElem: document.querySelector('.loader'),
};

const BASE_URL = 'https://pixabay.com/';
const END_POINT = '/api/';
const API_KEY = '42034785-c436f003c310c5b5229f24b7b';

refs.formElem.addEventListener('submit', event => {
  event.preventDefault();

  const query = refs.formElem.query.value.trim();

  if (!query) {
    createMessage(`Please type a value in the "Search images" field!`);
    return;
  }
  const url = `${BASE_URL}${END_POINT}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

  fetchImages(url)
    .then(data => {
      if (data.hits.length === 0) {
        createMessage(`Sorry, there are no such value!`);
        showLoader(false);
      }
      refs.galleryElem.innerHTML = createMarkup(data.hits);
      showLoader(false);
      new SimpleLightbox('.gallery-item a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
      refs.formElem.reset();
    })
    .catch(error => console.error(error));
});

function fetchImages(url) {
  showLoader(true);

  return fetch(url).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }
    console.log(resp);
    return resp.json();
  });
}

function createMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
        <li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img
      class="gallery-image"
      src="${webformatURL}"
      alt="${tags}"
    />
    <p class="gallery-descr">Likes: <span class="descr-span">${likes}</span> Views: <span class="descr-span">${views}</span> Comments: <span class="descr-span">${comments}</span> Downloads: <span class="descr-span">${downloads}</span></p>
  </a>
</li>`
    )
    .join('');
}

function createMessage(message) {
  iziToast.show({
    title: 'X',
    titleColor: '#fff',
    titleSize: '18px',
    position: 'bottomCenter',
    message: message,
    maxWidth: '42%',
    messageColor: '#fff',
    messageSize: '16px',
    backgroundColor: '#FF6868',
    close: false,
    closeOnClick: true,
  });
}

function showLoader(state = true) {
  refs.loaderElem.style.display = !state ? 'none' : 'inline-block';
  refs.searchBtn.disabled = state;
}
