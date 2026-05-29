import { getMetadata } from '../../scripts/aem.js';

/**
 * Fetches and returns nav content HTML.
 * Tries /content/nav.plain.html first, then the metadata-configured path.
 * @returns {HTMLElement|null} parsed nav content
 */
async function fetchNavContent() {
  const paths = ['/content/nav.plain.html'];
  const navMeta = getMetadata('nav');
  if (navMeta) {
    const metaPath = new URL(navMeta, window.location).pathname.replace(/\.html$/, '');
    paths.push(`${metaPath}.plain.html`);
  } else {
    paths.push('/nav.plain.html');
  }

  const resp = await fetch(paths[0]);
  if (resp.ok) {
    const html = await resp.text();
    const container = document.createElement('div');
    container.innerHTML = html;
    return container;
  }

  if (paths.length > 1) {
    const fallback = await fetch(paths[1]);
    if (fallback.ok) {
      const html = await fallback.text();
      const container = document.createElement('div');
      container.innerHTML = html;
      return container;
    }
  }
  return null;
}

/**
 * Creates the brand/logo section of the header.
 * @param {Element} brandSection The source brand section element
 * @returns {Element} brand element
 */
async function buildBrand(brandSection) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const link = brandSection.querySelector('a');
  if (link) {
    const brandLink = document.createElement('a');
    brandLink.href = link.href;
    brandLink.setAttribute('aria-label', 'Queensland - Home');
    try {
      const resp = await fetch('/icons/queensland-logo.svg');
      if (resp.ok) {
        const svgText = await resp.text();
        brandLink.innerHTML = svgText;
        const svgEl = brandLink.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('width', '145');
          svgEl.setAttribute('height', '42');
          svgEl.setAttribute('aria-hidden', 'true');
          svgEl.setAttribute('focusable', 'false');
          svgEl.removeAttribute('id');
        }
      }
    } catch (e) {
      brandLink.textContent = 'Queensland';
    }
    brand.append(brandLink);
  }
  return brand;
}

/**
 * Creates the bookmark icon button.
 * @returns {Element} bookmark button
 */
function buildBookmarkButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-bookmark-btn';
  btn.setAttribute('aria-label', 'Bookmarks');
  btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`;
  return btn;
}

/**
 * Creates the hamburger toggle button.
 * @returns {Element} hamburger button
 */
function buildHamburgerButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-hamburger-btn';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="22" height="22" aria-hidden="true">
    <rect fill="currentColor" x="4" y="10" width="32" height="3" rx="1.5"></rect>
    <rect fill="currentColor" x="4" y="19" width="32" height="3" rx="1.5"></rect>
    <rect fill="currentColor" x="4" y="28" width="32" height="3" rx="1.5"></rect>
  </svg>`;
  return btn;
}

/**
 * Creates the search button for the top of the menu.
 * @returns {Element} search button element
 */
function buildSearchButton() {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-search';
  const btn = document.createElement('a');
  btn.href = '/us/en/info/search';
  btn.className = 'nav-search-btn';
  btn.setAttribute('role', 'button');
  btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <span>Explore Queensland</span>`;
  wrapper.append(btn);
  return wrapper;
}

/**
 * Builds a single accordion panel from nav content.
 * @param {string} title The panel title
 * @param {Array} sections Array of {heading, list, showAll} objects
 * @returns {Element} panel element
 */
function buildPanel(title, sections) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav-panel-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `<span>${title}</span><svg class="nav-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

  const content = document.createElement('div');
  content.className = 'nav-panel-content';
  content.setAttribute('aria-hidden', 'true');

  sections.forEach((section) => {
    const col = document.createElement('div');
    col.className = `nav-panel-section nav-section-${section.type}`;

    if (section.heading) {
      const h = document.createElement('h3');
      h.textContent = section.heading;
      col.append(h);
    }

    if (section.list) {
      col.append(section.list.cloneNode(true));
    }

    if (section.showAll) {
      const showAllLink = document.createElement('a');
      showAllLink.href = section.showAll.href;
      showAllLink.className = 'nav-show-all';
      showAllLink.textContent = section.showAll.text;
      col.append(showAllLink);
    }

    content.append(col);
  });

  panel.append(trigger, content);
  return panel;
}

/**
 * Parses the nav sections content and builds accordion panels.
 * @param {Element} navContent The sections div from nav content
 * @returns {Element} accordion container
 */
function buildAccordion(navContent) {
  const accordion = document.createElement('div');
  accordion.className = 'nav-accordion';

  // Parse the content: h2 elements define panel boundaries
  const headings = navContent.querySelectorAll('h2');

  headings.forEach((h2) => {
    const title = h2.textContent.trim();
    const sections = [];

    // Collect all sibling elements until next h2
    let el = h2.nextElementSibling;
    let currentSection = null;

    while (el && el.tagName !== 'H2') {
      if (el.tagName === 'H3') {
        // Start a new section
        if (currentSection) sections.push(currentSection);
        const heading = el.textContent.trim();
        // Determine section type based on position
        let type = 'primary';
        if (sections.length === 1) type = 'categories';
        else if (sections.length >= 2) type = 'featured';
        currentSection = {
          heading, type, list: null, showAll: null,
        };
      } else if (el.tagName === 'UL' && currentSection) {
        currentSection.list = el;
        // Detect type by checking for images
        const hasImages = el.querySelector('img');
        const hasDescriptions = el.querySelector('li > p');
        if (hasDescriptions) {
          currentSection.type = 'featured';
        } else if (hasImages) {
          currentSection.type = 'categories';
        }
      } else if (el.tagName === 'P' && currentSection) {
        const link = el.querySelector('a');
        if (link) {
          currentSection.showAll = { href: link.href, text: link.textContent.trim() };
        }
      }
      el = el.nextElementSibling;
    }
    if (currentSection) sections.push(currentSection);

    const panel = buildPanel(title, sections);
    accordion.append(panel);
  });

  return accordion;
}

/**
 * Builds the full-screen menu dialog.
 * @param {Element} navContent The parsed nav content
 * @returns {Element} dialog element
 */
function buildMenuDialog(navContent) {
  const dialog = document.createElement('div');
  dialog.className = 'nav-menu-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-label', 'Main navigation');
  dialog.setAttribute('aria-hidden', 'true');

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'nav-close-btn';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;

  // Search
  const search = buildSearchButton();

  // Sections content (second div in nav)
  const { children: sections } = navContent;
  // eslint-disable-next-line prefer-destructuring
  const sectionsDiv = sections.length >= 2 ? sections[1] : null;

  // Accordion
  const accordion = sectionsDiv ? buildAccordion(sectionsDiv) : document.createElement('div');

  // Bookmarks link
  const bookmarks = document.createElement('div');
  bookmarks.className = 'nav-bookmarks';
  if (sections.length >= 3) {
    const bmLink = sections[2].querySelector('a');
    if (bmLink) {
      const a = document.createElement('a');
      a.href = bmLink.href;
      a.className = 'nav-bookmarks-link';
      a.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <span>${bmLink.textContent}</span>`;
      bookmarks.append(a);
    }
  }

  dialog.append(closeBtn, search, accordion, bookmarks);
  return dialog;
}

/**
 * Opens the navigation menu.
 * @param {Element} dialog The menu dialog
 * @param {Element} hamburger The hamburger button
 */
function openMenu(dialog, hamburger) {
  dialog.setAttribute('aria-hidden', 'false');
  dialog.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close menu');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the navigation menu.
 * @param {Element} dialog The menu dialog
 * @param {Element} hamburger The hamburger button
 */
function closeMenu(dialog, hamburger) {
  dialog.setAttribute('aria-hidden', 'true');
  dialog.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
  document.body.style.overflow = '';
}

/**
 * Sets up accordion behavior on panels (one open at a time).
 * @param {Element} accordion The accordion container
 */
function setupAccordion(accordion) {
  const triggers = accordion.querySelectorAll('.nav-panel-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      // Close all panels
      triggers.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.setAttribute('aria-hidden', 'true');
      });
      // Toggle clicked panel
      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        trigger.nextElementSibling.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

/**
 * Loads and decorates the header block.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navContent = await fetchNavContent();
  if (!navContent) return;

  block.textContent = '';

  // Build header bar
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  const headerBar = document.createElement('div');
  headerBar.className = 'nav-header-bar';

  // Brand
  const brandSection = navContent.children[0];
  const brand = await buildBrand(brandSection);

  // Inline nav links for desktop
  const inlineLinks = document.createElement('ul');
  inlineLinks.className = 'nav-inline-links';
  const navSection = navContent.children[1];
  if (navSection) {
    navSection.querySelectorAll('h2').forEach((h2) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = h2.textContent;
      btn.setAttribute('type', 'button');
      li.append(btn);
      inlineLinks.append(li);
    });
  }

  // Actions (bookmark + search + hamburger)
  const actions = document.createElement('div');
  actions.className = 'nav-actions';
  const bookmarkBtn = buildBookmarkButton();
  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-search-icon';
  searchBtn.setAttribute('type', 'button');
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  const hamburgerBtn = buildHamburgerButton();
  actions.append(bookmarkBtn, searchBtn, hamburgerBtn);

  headerBar.append(brand, inlineLinks, actions);

  // Full-screen menu dialog
  const menuDialog = buildMenuDialog(navContent);

  // Event listeners
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = menuDialog.classList.contains('is-open');
    if (isOpen) {
      closeMenu(menuDialog, hamburgerBtn);
    } else {
      openMenu(menuDialog, hamburgerBtn);
    }
  });

  menuDialog.querySelector('.nav-close-btn').addEventListener('click', () => {
    closeMenu(menuDialog, hamburgerBtn);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuDialog.classList.contains('is-open')) {
      closeMenu(menuDialog, hamburgerBtn);
      hamburgerBtn.focus();
    }
  });

  // Accordion behavior
  const accordion = menuDialog.querySelector('.nav-accordion');
  if (accordion) setupAccordion(accordion);

  // Inline nav link clicks open menu to specific panel
  inlineLinks.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      openMenu(menuDialog, hamburgerBtn);
      const panelTriggers = accordion.querySelectorAll('.nav-panel-trigger');
      panelTriggers.forEach((trigger) => {
        if (trigger.textContent.trim() === btn.textContent.trim()) {
          trigger.click();
        }
      });
    });
  });

  // Search icon opens menu
  searchBtn.addEventListener('click', () => {
    openMenu(menuDialog, hamburgerBtn);
  });

  // Bookmark button opens bookmarks page
  bookmarkBtn.addEventListener('click', () => {
    window.location.href = '/us/en/bookmarks';
  });

  nav.append(headerBar, menuDialog);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
