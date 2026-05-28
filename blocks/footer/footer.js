import { getMetadata, decorateIcons } from '../../scripts/aem.js';

function buildLocaleSelector(localeList) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-locale';

  const label = document.createElement('span');
  label.className = 'footer-locale-label';
  label.textContent = 'Language';

  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Language');

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'choose region';
  defaultOpt.selected = true;
  select.append(defaultOpt);

  localeList.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a');
    if (link) {
      const option = document.createElement('option');
      option.value = link.href;
      option.textContent = link.textContent.trim();
      select.append(option);
    }
  });

  select.addEventListener('change', () => {
    if (select.value) {
      window.location.href = select.value;
    }
  });

  wrapper.append(label, select);
  return wrapper;
}

function buildSocialIcons(socialList) {
  const wrapper = document.createElement('ul');
  wrapper.className = 'footer-social';

  socialList.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a');
    if (link) {
      const text = link.textContent.trim().toLowerCase();
      const newLi = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.setAttribute('aria-label', `Queensland ${text.charAt(0).toUpperCase() + text.slice(1)} account`);
      if (!link.href.startsWith('mailto:')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }

      const icon = document.createElement('span');
      const iconName = text === 'email' ? 'mail' : text;
      icon.className = `icon icon-${iconName}`;
      a.append(icon);
      newLi.append(a);
      wrapper.append(newLi);
    }
  });

  return wrapper;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections = doc.body.querySelectorAll(':scope > div');

  block.textContent = '';

  if (sections.length >= 1) {
    const linksSection = document.createElement('div');
    linksSection.className = 'footer-links-section';

    const linksInner = document.createElement('div');
    linksInner.className = 'footer-links-inner';

    const lists = sections[0].querySelectorAll('ul');

    if (lists.length >= 1) {
      const col1 = document.createElement('div');
      col1.className = 'footer-links-col';
      const ul1 = document.createElement('ul');
      lists[0].querySelectorAll('li').forEach((li) => {
        ul1.append(li.cloneNode(true));
      });
      col1.append(ul1);
      linksInner.append(col1);
    }

    if (lists.length >= 2) {
      const col2 = document.createElement('div');
      col2.className = 'footer-links-col';
      const ul2 = document.createElement('ul');
      lists[1].querySelectorAll('li').forEach((li) => {
        ul2.append(li.cloneNode(true));
      });
      col2.append(ul2);
      linksInner.append(col2);
    }

    if (lists.length >= 3) {
      const col3 = document.createElement('div');
      col3.className = 'footer-links-col';
      col3.append(buildLocaleSelector(lists[2]));
      linksInner.append(col3);
    }

    linksSection.append(linksInner);
    block.append(linksSection);
  }

  if (sections.length >= 2) {
    const bottomSection = document.createElement('div');
    bottomSection.className = 'footer-bottom-section';

    const bottomInner = document.createElement('div');
    bottomInner.className = 'footer-bottom-inner';

    const socialList = sections[1].querySelector('ul');
    if (socialList) {
      bottomInner.append(buildSocialIcons(socialList));
    }

    const paragraphs = sections[1].querySelectorAll('p');
    if (paragraphs.length >= 1) {
      const ackDiv = document.createElement('div');
      ackDiv.className = 'footer-acknowledgement';
      const ackP = document.createElement('p');
      ackP.textContent = paragraphs[0].textContent.trim();
      ackDiv.append(ackP);
      bottomInner.append(ackDiv);
    }

    const logosDiv = document.createElement('div');
    logosDiv.className = 'footer-logos';

    if (paragraphs.length >= 2) {
      const imgs = paragraphs[1].querySelectorAll('img');
      const logosContainer = document.createElement('div');
      logosContainer.className = 'footer-logos-images';
      imgs.forEach((img) => {
        const figure = document.createElement('figure');
        const newImg = document.createElement('img');
        const src = img.getAttribute('src');
        newImg.src = src.startsWith('http') ? src : `/content/${src}`;
        newImg.alt = img.alt;
        newImg.loading = 'lazy';
        figure.append(newImg);
        logosContainer.append(figure);
      });
      logosDiv.append(logosContainer);
    }

    if (paragraphs.length >= 3) {
      const copyright = document.createElement('span');
      copyright.className = 'footer-copyright';
      copyright.textContent = paragraphs[2].textContent.trim();
      logosDiv.append(copyright);
    }

    bottomInner.append(logosDiv);
    bottomSection.append(bottomInner);
    block.append(bottomSection);
  }

  decorateIcons(block);
}
