const AUTOPLAY_DELAY = 5000;
const CIRCLE_CIRCUMFERENCE = 87.96; // 2 * PI * 14 (radius)

function createPauseIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" height="30" width="30">
    <path class="pause-icon" fill="#F2EFEF" d="M13 9c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1h-1c-.6 0-1-.4-1-1V10c0-.6.4-1 1-1h1zm5 0c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1h-1c-.6 0-1-.4-1-1V10c0-.6.4-1 1-1h1z"></path>
    <circle class="pause-circle-bg" cx="15" cy="15" r="14" fill="none" stroke="#F2EFEF" stroke-width="2" transform="rotate(-90,15,15)"></circle>
    <circle class="pause-circle-fg" cx="15" cy="15" r="14" fill="none" stroke="#F2EFEF" stroke-width="2" transform="rotate(-90,15,15)"></circle>
  </svg>`;
}

function createPlayIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" height="30" width="30">
    <polygon fill="#F2EFEF" points="11 7 23 15 11 23 11 7"></polygon>
    <circle class="pause-circle-bg" cx="15" cy="15" r="14" fill="none" stroke="#F2EFEF" stroke-width="2" transform="rotate(-90,15,15)"></circle>
  </svg>`;
}

function createBookmarkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24.6 22.6">
    <path fill="none" stroke="#F2EFEF" stroke-width="1.5" d="M21.2,12l-8.6,8.7c-.2.2-.5.2-.6,0L3.4,12A6.13,6.13,0,0,1,1.7,7.7,6.31,6.31,0,0,1,3.4,3.4,5.92,5.92,0,0,1,7.6,1.6a5.92,5.92,0,0,1,4.2,1.8.67.67,0,0,0,1,0,5.8,5.8,0,0,1,8.4,0,6.13,6.13,0,0,1,1.7,4.3A6,6,0,0,1,21.2,12"></path>
  </svg>`;
}

function createArrowSvg(direction) {
  const transform = direction === 'prev' ? 'scale(-1, 1) translate(-9, 0)' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 15" height="15" width="9">
    <path fill="currentColor" fill-rule="evenodd" d="M1.70365 0L0 1.7512 5.59271 7.5 0 13.24724 1.70365 15 9 7.5z" transform="${transform}"></path>
  </svg>`;
}

export default function decorate(block) {
  const slides = [...block.querySelectorAll(':scope > div')];
  if (slides.length === 0) return;

  // Mark each row as a slide
  slides.forEach((slide, i) => {
    slide.classList.add('hero-carousel-slide');
    slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
  });

  // Show the first slide
  slides[0].classList.add('hero-carousel-slide-active');

  // Create navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('hero-carousel-prev');
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = createArrowSvg('prev');

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('hero-carousel-next');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = createArrowSvg('next');

  block.append(prevBtn, nextBtn);

  // Create scrollbar progress track
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('hero-carousel-progress');
  const progressBar = document.createElement('div');
  progressBar.classList.add('hero-carousel-progress-bar');
  progressContainer.append(progressBar);
  block.append(progressContainer);

  let currentSlide = 0;
  let autoplayInterval = null;

  function resetProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    progressBar.offsetWidth;
    progressBar.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
    progressBar.style.width = '100%';
  }

  function resetCircleProgress() {
    const circle = block.querySelector('.pause-circle-fg');
    if (!circle) return;
    circle.style.transition = 'none';
    circle.style.strokeDashoffset = `${CIRCLE_CIRCUMFERENCE}`;
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    circle.offsetWidth;
    circle.style.transition = `stroke-dashoffset ${AUTOPLAY_DELAY}ms linear`;
    circle.style.strokeDashoffset = '0';
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('hero-carousel-slide-active');
    slides[currentSlide].setAttribute('aria-hidden', 'true');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('hero-carousel-slide-active');
    slides[currentSlide].setAttribute('aria-hidden', 'false');
    resetProgress();
    resetCircleProgress();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    block.classList.remove('hero-carousel-playing');
  }

  function startAutoplay() {
    stopAutoplay();
    block.classList.add('hero-carousel-playing');
    resetProgress();
    resetCircleProgress();
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    stopAutoplay();
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
  });

  // Hero controls (pause/play + bookmark) as <ul>
  const controls = document.createElement('ul');
  controls.className = 'hero-carousel-controls';

  const pauseLi = document.createElement('li');
  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'hero-carousel-pause';
  pauseBtn.setAttribute('type', 'button');
  pauseBtn.setAttribute('aria-label', 'Pause video');
  pauseBtn.innerHTML = createPauseIcon();
  pauseLi.append(pauseBtn);

  const bookmarkLi = document.createElement('li');
  const bookmarkBtn = document.createElement('button');
  bookmarkBtn.className = 'hero-carousel-bookmark';
  bookmarkBtn.setAttribute('type', 'button');
  bookmarkBtn.setAttribute('aria-label', 'Add bookmark');
  bookmarkBtn.innerHTML = createBookmarkIcon();
  bookmarkLi.append(bookmarkBtn);

  let isPaused = false;
  pauseBtn.addEventListener('click', () => {
    if (isPaused) {
      startAutoplay();
      pauseBtn.setAttribute('aria-label', 'Pause video');
      pauseBtn.innerHTML = createPauseIcon();
    } else {
      stopAutoplay();
      pauseBtn.setAttribute('aria-label', 'Play video');
      pauseBtn.innerHTML = createPlayIcon();
    }
    isPaused = !isPaused;
  });

  bookmarkBtn.addEventListener('click', () => {
    window.location.href = '/us/en/info/my-bookmarks';
  });

  controls.append(pauseLi, bookmarkLi);
  block.append(controls);

  // Pull the next sibling section (Discover text) into the hero block container
  const heroSection = block.closest('.section');
  if (heroSection) {
    const nextSection = heroSection.nextElementSibling;
    if (nextSection && nextSection.classList.contains('center')) {
      const discoverPanel = document.createElement('div');
      discoverPanel.className = 'hero-carousel-discover';
      const wrapper = nextSection.querySelector('.default-content-wrapper');
      if (wrapper) {
        discoverPanel.innerHTML = wrapper.innerHTML;
      }
      block.append(discoverPanel);
      nextSection.remove();
    }
  }

  // Start autoplay
  startAutoplay();
}
