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
  prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('hero-carousel-next');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  block.append(prevBtn, nextBtn);

  // Create progress bar
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('hero-carousel-progress');
  const progressBar = document.createElement('div');
  progressBar.classList.add('hero-carousel-progress-bar');
  progressContainer.append(progressBar);
  block.append(progressContainer);

  let currentSlide = 0;
  let autoplayInterval = null;
  const autoplayDelay = 5000;

  function resetProgress() {
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    progressBar.offsetWidth;
    progressBar.style.transition = `width ${autoplayDelay}ms linear`;
    progressBar.style.width = '100%';
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('hero-carousel-slide-active');
    slides[currentSlide].setAttribute('aria-hidden', 'true');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('hero-carousel-slide-active');
    slides[currentSlide].setAttribute('aria-hidden', 'false');
    resetProgress();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    resetProgress();
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
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

  // Hero controls (pause/play + bookmark)
  const controls = document.createElement('div');
  controls.className = 'hero-carousel-controls';

  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'hero-carousel-pause';
  pauseBtn.setAttribute('aria-label', 'Pause video');
  pauseBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

  const bookmarkBtn = document.createElement('button');
  bookmarkBtn.className = 'hero-carousel-bookmark';
  bookmarkBtn.setAttribute('aria-label', 'Add bookmark');
  bookmarkBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

  let isPaused = false;
  pauseBtn.addEventListener('click', () => {
    if (isPaused) {
      startAutoplay();
      pauseBtn.setAttribute('aria-label', 'Pause video');
      pauseBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    } else {
      stopAutoplay();
      pauseBtn.setAttribute('aria-label', 'Play video');
      pauseBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
    isPaused = !isPaused;
  });

  bookmarkBtn.addEventListener('click', () => {
    window.location.href = '/us/en/info/my-bookmarks';
  });

  controls.append(pauseBtn, bookmarkBtn);
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
