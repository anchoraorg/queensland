export default function decorate(block) {
  block.textContent = '';

  block.innerHTML = `
    <div class="whats-on-heading">
      <h2>What's on in Queensland</h2>
    </div>
    <div class="whats-on-divider"></div>
    <div class="whats-on-cards">
      <div class="whats-on-card">
        <div class="whats-on-card-icon">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/icons/resized-icons/Icon%20Files_Reef_Grey.png?bfc=on&fit=wrap&fmt=png-alpha&qlt=80&resMode=bisharp&wid=140" alt="On now" height="70" width="70">
        </div>
        <div class="whats-on-card-content">
          <h6>On now</h6>
          <p class="whats-on-title">Crystal Clear waters</p>
          <p class="whats-on-period">September - November</p>
        </div>
      </div>
      <div class="whats-on-card">
        <div class="whats-on-card-icon">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/icons/resized-icons/Icon%20Files_Weather(Icecream)_Grey.png?bfc=on&fit=wrap&fmt=png-alpha&qlt=80&resMode=bisharp&wid=140" alt="Average temperatures" height="70" width="70">
        </div>
        <div class="whats-on-card-content">
          <h6>Average temperatures</h6>
          <p class="whats-on-period">September - November</p>
          <div class="whats-on-temps">
            <div class="whats-on-temp">
              <span class="whats-on-temp-label">Min</span>
              <span class="whats-on-temp-value">52<span class="whats-on-temp-deg">°</span></span>
            </div>
            <div class="whats-on-temp">
              <span class="whats-on-temp-label">Max</span>
              <span class="whats-on-temp-value">89<span class="whats-on-temp-deg">°</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="whats-on-buttons">
      <a href="/us/en/things-to-do/events" class="whats-on-btn" aria-label="Events">
        <div class="whats-on-btn-bg">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/campaign-assets/homepage-test/desktop/Untitled%20design%20(37).jpg?bfc=on&fit=crop%2C1&hei=210&qlt=60&resMode=bisharp&wid=210" alt="Events" loading="lazy">
        </div>
        <div class="whats-on-btn-overlay">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/icons/nav-icons/white-icons/Icon%20Files_Events_White.png?bfc=on&fit=wrap&fmt=png-alpha&resMode=bisharp&wid=104" alt="" height="52" class="whats-on-btn-icon">
          <h3>Events</h3>
        </div>
      </a>
      <a href="/us/en/plan-your-holiday/news-and-articles" class="whats-on-btn" aria-label="What's new">
        <div class="whats-on-btn-bg">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/campaign-assets/homepage-test/desktop/Homepage%20test%20food%20and%20drink%201080%20x%201080px.jpg?bfc=on&fit=crop%2C1&hei=210&qlt=60&resMode=bisharp&wid=210" alt="What's new" loading="lazy">
        </div>
        <div class="whats-on-btn-overlay">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/icons/nav-icons/white-icons/Icon%20Files_EditorialNews_White.png?bfc=on&fit=wrap&fmt=png-alpha&resMode=bisharp&wid=104" alt="" height="52" class="whats-on-btn-icon">
          <h3>What's new</h3>
        </div>
      </a>
    </div>
  `;
}
