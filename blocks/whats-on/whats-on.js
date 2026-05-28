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
  `;
}
