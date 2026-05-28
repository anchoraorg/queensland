export default function decorate(block) {
  block.textContent = '';

  block.innerHTML = `
    <div class="video-cta-inner">
      <div class="video-cta-video">
        <div class="video-cta-embed">
          <iframe
            src="https://www.youtube.com/embed/X9FUaB-127Y?autoplay=0&mute=0&controls=1&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
            title="Get That Holiday Feeling in Queensland"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <div class="video-cta-content">
        <h1>That Holiday Feeling</h1>
        <p>Queensland's new TV commercial is more than a postcard – it's a holiday mood. From reef dives, rainforest vibes and swimming with whales, we've bottled up the state's best bits to show off what <em>That Holiday Feeling</em> really looks like. Want a closer peek at the jaw-dropping spots we filmed (and how to make them your next getaway? Let's dive behind the scenes.</p>
        <a href="/us/en/plan-your-holiday/news-and-articles/queensland-s-new-tv-commercial" class="video-cta-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.6 16.6" height="20" width="20"><path fill="currentColor" stroke="currentColor" stroke-width="0.6154" d="M16.3.7V.6l-.1-.1H12c-.3 0-.5.2-.5.5s.2.5.5.5h2.7L8.8 7.1c-.2.2-.2.5 0 .7.1.1.2.1.3.1.1 0 .2 0 .3-.1l5.9-5.9v2.7c0 .3.2.5.5.5s.5-.2.5-.5V.7m-1.7 7.4V13c0 1.8-1.5 3.3-3.3 3.3H3.6C1.8 16.3.3 14.8.3 13V5.3C.3 3.5 1.8 2 3.6 2h4.9c.3 0 .5.2.5.5s-.2.5-.5.5H3.6c-1.3-.1-2.3 1-2.3 2.3V13c0 1.3 1.1 2.3 2.3 2.3h7.7c1.3 0 2.3-1.1 2.3-2.3V8.1c0-.3.2-.5.5-.5s.5.2.5.5"></path></svg>
          <span>Discover our icons</span>
        </a>
      </div>
    </div>
  `;
}
