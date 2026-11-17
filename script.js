// ---------- Mobile nav ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') links.classList.remove('open');
});

// ---------- Highlight current section in nav ----------
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));

// ---------- Placeholders for missing images / videos ----------
function makePlaceholder(file, kind) {
  const div = document.createElement('div');
  div.className = 'img-placeholder';
  div.innerHTML = `<strong>${kind} goes here</strong><span>Add file:</span><code>${file}</code>`;
  return div;
}

function swapImage(img) {
  if (img.dataset.swapped) return;
  img.dataset.swapped = '1';
  const ph = makePlaceholder(img.dataset.file || img.getAttribute('src'), 'Photo');
  // If the image is wrapped in a link (e.g. poster), replace the link too
  const target = img.parentElement.tagName === 'A' ? img.parentElement : img;
  target.replaceWith(ph);
  window.dispatchEvent(new Event('resize'));
}

document.querySelectorAll('img[data-file]').forEach(img => {
  if (img.complete && img.naturalWidth === 0) swapImage(img);
  else img.addEventListener('error', () => swapImage(img));
});

document.querySelectorAll('video[data-file]').forEach(video => {
  const source = video.querySelector('source');
  const fail = () => {
    if (video.dataset.swapped) return;
    video.dataset.swapped = '1';
    video.replaceWith(makePlaceholder(video.dataset.file, 'Video'));
  };
  if (source) source.addEventListener('error', fail);
  video.addEventListener('error', fail);
});

// ---------- Annotated photo: arrows from labels to features ----------
const SVG_NS = 'http://www.w3.org/2000/svg';

function setupAnnotated(container) {
  const callouts = [...container.querySelectorAll('.callout')];
  const legend = document.getElementById(container.id + '-legend');

  callouts.forEach((c, i) => {
    c.style.left = c.dataset.lx + '%';
    c.style.top = c.dataset.ly + '%';
    c.insertAdjacentHTML('afterbegin', `<span class="num">${i + 1}</span>`);
    if (legend) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="num">${i + 1}</span>${c.textContent.replace(/^\d+/, '')}`;
      legend.appendChild(li);
    }
  });

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('arrows');
  container.appendChild(svg);

  function draw() {
    const box = container.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.innerHTML = `<defs><marker id="${container.id}-ah" viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto"><path class="ah-fill" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;

    callouts.forEach((c, i) => {
      // Keep labels inside the image horizontally
      c.style.left = c.dataset.lx + '%';
      let r = c.getBoundingClientRect();
      if (r.right > box.right - 4) {
        c.style.left = (box.width - r.width - 4) + 'px';
        r = c.getBoundingClientRect();
      }

      const tx = (parseFloat(c.dataset.x) / 100) * box.width;
      const ty = (parseFloat(c.dataset.y) / 100) * box.height;
      const left = r.left - box.left, right = r.right - box.left;
      const top = r.top - box.top, bottom = r.bottom - box.top;
      // Start the arrow at the point on the label's edge closest to the target
      const sx = Math.min(Math.max(tx, left), right);
      const sy = Math.min(Math.max(ty, top), bottom);

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', sx); line.setAttribute('y1', sy);
      line.setAttribute('x2', tx); line.setAttribute('y2', ty);
      line.setAttribute('marker-end', `url(#${container.id}-ah)`);
      svg.appendChild(line);

      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', tx); dot.setAttribute('cy', ty); dot.setAttribute('r', 4);
      svg.appendChild(dot);

      // Numbered marker (shown on small screens instead of labels)
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'marker-num');
      g.innerHTML = `<circle cx="${tx}" cy="${ty}" r="11"/><text x="${tx}" y="${ty + 4}"
        text-anchor="middle" font-size="12" font-weight="800" fill="#111">${i + 1}</text>`;
      svg.appendChild(g);
    });
  }

  draw();
  window.addEventListener('resize', draw);
  container.querySelectorAll('img').forEach(img => img.addEventListener('load', draw));
}

document.querySelectorAll('.annotated').forEach(setupAnnotated);
