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
 * Creates the hamburger toggle button for mobile.
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
 * Parses the nav sections content and returns an array of panel data.
 * Each panel has: title, sections (array of {heading, type, list, showAll})
 * @param {Element} sectionsDiv The sections div from nav content
 * @returns {Array} array of panel objects
 */
function parseNavPanels(sectionsDiv) {
  const panels = [];
  const headings = sectionsDiv.querySelectorAll('h2');

  headings.forEach((h2) => {
    const title = h2.textContent.trim();
    const sections = [];
    let el = h2.nextElementSibling;
    let currentSection = null;

    while (el && el.tagName !== 'H2') {
      if (el.tagName === 'H3') {
        if (currentSection) sections.push(currentSection);
        const heading = el.textContent.trim();
        let type = 'primary';
        if (sections.length === 1) type = 'categories';
        else if (sections.length >= 2) type = 'featured';
        currentSection = {
          heading, type, list: null, showAll: null,
        };
      } else if (el.tagName === 'UL' && currentSection) {
        currentSection.list = el;
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
    panels.push({ title, sections });
  });

  return panels;
}

/**
 * Builds the desktop mega-menu navigation bar.
 * @param {Array} panels Array of panel data objects
 * @returns {Element} nav-menu element with menubar and dialogs
 */
function buildDesktopMenu(panels) {
  const menu = document.createElement('div');
  menu.className = 'nav-menu';

  const ul = document.createElement('ul');
  ul.setAttribute('role', 'menubar');

  panels.forEach((panel) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'menuitem');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = panel.title;

    const dialog = document.createElement('div');
    dialog.className = 'mega-menu';
    dialog.setAttribute('role', 'menu');
    dialog.setAttribute('aria-label', panel.title);
    dialog.hidden = true;

    const columns = document.createElement('div');
    columns.className = 'mega-menu-columns';

    panel.sections.forEach((section) => {
      const col = document.createElement('div');
      col.className = `mega-menu-col mega-col-${section.type}`;

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
        showAllLink.className = 'mega-show-all';
        showAllLink.textContent = section.showAll.text;
        col.append(showAllLink);
      }

      columns.append(col);
    });

    dialog.append(columns);
    li.append(btn, dialog);
    ul.append(li);
  });

  menu.append(ul);
  return menu;
}

/**
 * Builds the nav icons section (bookmark + search) for desktop.
 * @param {Element} navContent The nav content for extracting bookmark link
 * @returns {Element} nav-icons element
 */
function buildNavIcons(navContent) {
  const icons = document.createElement('div');
  icons.className = 'nav-icons';

  // Bookmark link
  const { children: sections } = navContent;
  if (sections.length >= 3) {
    const bmLink = sections[2].querySelector('a');
    if (bmLink) {
      const a = document.createElement('a');
      a.href = bmLink.href;
      a.className = 'nav-bookmark-icon';
      a.setAttribute('aria-label', 'My Bookmarks');
      a.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>`;
      icons.append(a);
    }
  }

  // Search button
  const searchBtn = document.createElement('a');
  searchBtn.href = '/us/en/info/search';
  searchBtn.className = 'nav-search-icon';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`;
  icons.append(searchBtn);

  return icons;
}

/**
 * Builds the mobile menu overlay with accordion panels.
 * @param {Array} panels Array of panel data objects
 * @param {Element} navContent The nav content for extracting bookmark link
 * @returns {Element} mobile menu dialog element
 */
function buildMobileMenu(panels, navContent) {
  const dialog = document.createElement('div');
  dialog.className = 'nav-mobile-menu';
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
  const search = document.createElement('div');
  search.className = 'nav-mobile-search';
  const searchLink = document.createElement('a');
  searchLink.href = '/us/en/info/search';
  searchLink.className = 'nav-search-btn';
  searchLink.setAttribute('role', 'button');
  searchLink.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
  <span>Explore Queensland</span>`;
  search.append(searchLink);

  // Accordion
  const accordion = document.createElement('div');
  accordion.className = 'nav-accordion';

  panels.forEach((panel) => {
    const panelEl = document.createElement('div');
    panelEl.className = 'nav-panel';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-panel-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span>${panel.title}</span><svg class="nav-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

    const content = document.createElement('div');
    content.className = 'nav-panel-content';
    content.setAttribute('aria-hidden', 'true');

    panel.sections.forEach((section) => {
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

    panelEl.append(trigger, content);
    accordion.append(panelEl);
  });

  // Bookmarks link
  const bookmarks = document.createElement('div');
  bookmarks.className = 'nav-bookmarks';
  const { children: sections } = navContent;
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
 * Sets up desktop mega-menu behavior: one open at a time, close on outside click.
 * @param {Element} menuEl The nav-menu element
 * @param {Element} headerEl The header element
 */
function setupDesktopMenu(menuEl, headerEl) {
  const buttons = menuEl.querySelectorAll('ul[role="menubar"] > li > button');

  function closeAllMenus() {
    buttons.forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
      const dialog = btn.nextElementSibling;
      if (dialog) dialog.hidden = true;
    });
    headerEl.classList.remove('nav-open');
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      closeAllMenus();
      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        const dialog = btn.nextElementSibling;
        if (dialog) dialog.hidden = false;
        headerEl.classList.add('nav-open');
      }
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!menuEl.contains(e.target)) {
      closeAllMenus();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openBtn = menuEl.querySelector('button[aria-expanded="true"]');
      if (openBtn) {
        closeAllMenus();
        openBtn.focus();
      }
    }
  });
}

/**
 * Sets up mobile accordion behavior and hamburger toggle.
 * @param {Element} mobileMenu The mobile menu dialog element
 * @param {Element} hamburgerBtn The hamburger button
 * @param {Element} headerEl The header element
 */
function setupMobileMenu(mobileMenu, hamburgerBtn, headerEl) {
  function openMenu() {
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    headerEl.classList.add('nav-open');
  }

  function closeMenu() {
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    headerEl.classList.remove('nav-open');
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  mobileMenu.querySelector('.nav-close-btn').addEventListener('click', () => {
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      hamburgerBtn.focus();
    }
  });

  // Accordion triggers
  const triggers = mobileMenu.querySelectorAll('.nav-panel-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      triggers.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.setAttribute('aria-hidden', 'true');
      });
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

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  // Header bar
  const headerBar = document.createElement('div');
  headerBar.className = 'nav-header-bar';

  // Brand
  const brandSection = navContent.children[0];
  const brand = await buildBrand(brandSection);

  // Parse panels from nav content
  const { children: sections } = navContent;
  const sectionsDiv = sections.length >= 2 ? sections[1] : null;
  const panels = sectionsDiv ? parseNavPanels(sectionsDiv) : [];

  // Desktop mega-menu
  const desktopMenu = buildDesktopMenu(panels);
  const navIcons = buildNavIcons(navContent);

  // Mobile hamburger
  const hamburgerBtn = buildHamburgerButton();

  // Mobile menu overlay
  const mobileMenu = buildMobileMenu(panels, navContent);

  headerBar.append(brand, desktopMenu, navIcons, hamburgerBtn);
  nav.append(headerBar, mobileMenu);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Setup interactions
  const headerEl = document.querySelector('header');
  setupDesktopMenu(desktopMenu, headerEl);
  setupMobileMenu(mobileMenu, hamburgerBtn, headerEl);
}
