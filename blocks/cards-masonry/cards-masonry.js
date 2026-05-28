import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-masonry-card-image';
      else div.className = 'cards-masonry-card-body';
    });

    // Wrap entire li content in anchor if a link exists in the card body
    const body = li.querySelector('.cards-masonry-card-body');
    const link = body ? body.querySelector('a') : null;
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.title = link.textContent.trim();
      // Move all children into the anchor
      while (li.firstChild) anchor.append(li.firstChild);
      // Ensure the body text stays (unwrap the inner link)
      const innerLink = anchor.querySelector('.cards-masonry-card-body a');
      if (innerLink) {
        const span = document.createElement('span');
        span.innerHTML = innerLink.innerHTML;
        innerLink.replaceWith(span);
      }
      li.append(anchor);
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
