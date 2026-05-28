export default function decorate(block) {
  block.textContent = '';

  block.innerHTML = `
    <div class="category-buttons-grid">
      <a href="/us/en/things-to-do/events" class="category-button" aria-label="Events">
        <div class="category-button-bg">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/campaign-assets/homepage-test/desktop/Untitled%20design%20(37).jpg?bfc=on&fit=crop%2C1&hei=210&qlt=60&resMode=bisharp&wid=210" alt="Events" loading="lazy">
        </div>
        <div class="category-button-overlay">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/icons/nav-icons/white-icons/Icon%20Files_Events_White.png?bfc=on&fit=wrap&fmt=png-alpha&resMode=bisharp&wid=104" alt="" height="52" class="category-button-icon">
          <h3>Events</h3>
        </div>
      </a>
      <a href="/us/en/plan-your-holiday/news-and-articles" class="category-button" aria-label="What's new">
        <div class="category-button-bg">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/campaign-assets/homepage-test/desktop/Homepage%20test%20food%20and%20drink%201080%20x%201080px.jpg?bfc=on&fit=crop%2C1&hei=210&qlt=60&resMode=bisharp&wid=210" alt="What's new" loading="lazy">
        </div>
        <div class="category-button-overlay">
          <img src="https://s7ap1.scene7.com/is/image/destqueensland/teq/consumer/global/icons/nav-icons/white-icons/Icon%20Files_EditorialNews_White.png?bfc=on&fit=wrap&fmt=png-alpha&resMode=bisharp&wid=104" alt="" height="52" class="category-button-icon">
          <h3>What's new</h3>
        </div>
      </a>
    </div>
  `;
}
