import { moveInstrumentation } from '../../scripts/scripts.js';

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-destination-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-destination-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

function scrollCarousel(slidesWrapper, direction) {
  const slideWidth = slidesWrapper.querySelector('.carousel-destination-slide')?.offsetWidth || 270;
  const gap = 30;
  const scrollAmount = slideWidth + gap;
  slidesWrapper.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  });
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-destination-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-destination-slides');

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);

  if (!isSingleSlide) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-destination-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
      <button type="button" class="slide-next" aria-label="Next Slide"></button>
    `;
    container.append(slideNavButtons);

    slideNavButtons.querySelector('.slide-prev').addEventListener('click', () => {
      scrollCarousel(slidesWrapper, 'prev');
    });
    slideNavButtons.querySelector('.slide-next').addEventListener('click', () => {
      scrollCarousel(slidesWrapper, 'next');
    });
  }

  block.prepend(container);
}
