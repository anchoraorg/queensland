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

  // Start autoplay
  startAutoplay();

  // Pause on hover
  block.addEventListener('mouseenter', stopAutoplay);
  block.addEventListener('mouseleave', startAutoplay);
}
