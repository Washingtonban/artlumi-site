// Inclusive dates in America/Sao_Paulo. Add a new { id, from, to } entry here.
const SEASON_CALENDAR = [
  { id: 'halloween-despedida', from: '2026-11-01', to: '2026-11-08' },
  { id: 'natal-chegando-1', from: '2026-11-09', to: '2026-11-15' },
  { id: 'natal-chegando-2', from: '2026-11-16', to: '2026-11-22' },
  { id: 'natal-chegando-3', from: '2026-11-23', to: '2026-11-30' },
  { id: 'natal', from: '2026-12-01', to: '2026-12-26' },
  { id: 'ano-novo', from: '2026-12-27', to: '2027-01-06' }
];

(() => {
  const lang = document.documentElement.lang.split('-')[0];
  const labels = {
    pt: { on: '✳ Enfeites: ligados', off: '✳ Enfeites: desligados', christmas: 'feliz<br>natal ✳' },
    en: { on: '✳ Decorations: on', off: '✳ Decorations: off', christmas: 'merry<br>christmas ✳' },
    es: { on: '✳ Adornos: activados', off: '✳ Adornos: desactivados', christmas: 'feliz<br>navidad ✳' }
  }[lang] || { on: '✳ Enfeites: ligados', off: '✳ Enfeites: desligados', christmas: 'feliz<br>natal ✳' };
  const query = new URLSearchParams(location.search).get('tema');
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(part => [part.type, part.value]));
  const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const current = query === 'nenhum' ? null : SEASON_CALENDAR.find(item => item.id === query) || (query ? null : SEASON_CALENDAR.find(item => item.from <= today && today <= item.to));
  const toggle = document.querySelector('.decor-toggle');
  const brand = document.querySelector('.site-header .brand');
  let enabled = true;
  try { enabled = localStorage.getItem('artlumi-enfeites') !== 'off'; } catch (_) { /* Optional preference. */ }

  // Small scene pieces on a 90 x 44 canvas. Each piece takes its own coordinates.
  const ink = '#3c315b';
  const bulbColors = ['#ffd66b', '#f6a6c8', '#a6dcc8', '#c9b6f2'];
  const web = (s = 1) => `<g class="web" transform="scale(${s})" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1 1H27M1 1L22 22M1 1V27M1 1L27 12M1 1L12 27"/><path d="M13 1Q12 12 1 13M21 1Q19 19 1 21"/></g>`;
  const bat = x => `<g class="bat"><path d="M${x} 0V8" stroke="#9a86c4" stroke-width="1.4"/><path d="M${x - 5} 11Q${x - 12} 13 ${x - 11} 21Q${x - 7} 18 ${x - 5} 20ZM${x + 5} 11Q${x + 12} 13 ${x + 11} 21Q${x + 7} 18 ${x + 5} 20Z" fill="#6f5b91" stroke="#c9b6f2" stroke-width="1" stroke-linejoin="round"/><ellipse cx="${x}" cy="15" rx="5.5" ry="7" fill="#6f5b91" stroke="#c9b6f2" stroke-width="1"/><path d="M${x - 4} 20 ${x - 3} 24 ${x - 1} 21ZM${x + 4} 20 ${x + 3} 24 ${x + 1} 21Z" fill="#6f5b91"/><circle cx="${x - 2}" cy="14" r="1" fill="#fff"/><circle cx="${x + 2}" cy="14" r="1" fill="#fff"/><circle cx="${x - 3.5}" cy="17" r="1.3" fill="#f6a6c8"/><circle cx="${x + 3.5}" cy="17" r="1.3" fill="#f6a6c8"/></g>`;
  // Elf at (x, y) = top-left of a 24 x 30 box. The broom is optional and swings around his hand.
  const elf = (x, y, hat, broom = false) => `${broom ? `<g class="broom"><path d="M${x + 4} ${y + 17}L${x - 7} ${y + 29}" stroke="#8a684b" stroke-width="2" stroke-linecap="round"/><path d="M${x - 11} ${y + 27}L${x - 3} ${y + 32}L${x - 8} ${y + 24}Z" fill="#ffd66b" stroke="#c9a23c" stroke-width=".8" stroke-linejoin="round"/></g>` : ''}<path d="M${x + 6} ${y + 20}Q${x + 12} ${y + 17} ${x + 18} ${y + 20}L${x + 19} ${y + 30}H${x + 5}Z" fill="#a6dcc8" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/><circle cx="${x + 12}" cy="${y + 14}" r="7" fill="#f7d3b2" stroke="${ink}" stroke-width="1.2"/><path d="M${x + 3} ${y + 11}L${x + 14} ${y - 2}L${x + 22} ${y + 11}Z" fill="${hat}" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${x + 3.5} ${y + 11}H${x + 21.5}" stroke="#fffdf9" stroke-width="3" stroke-linecap="round"/><circle cx="${x + 15}" cy="${y - 2.5}" r="2.6" fill="${hat === '#e8708c' ? '#fffdf9' : '#ffd66b'}"/><circle cx="${x + 9.5}" cy="${y + 15}" r="1" fill="${ink}"/><circle cx="${x + 14.5}" cy="${y + 15}" r="1" fill="${ink}"/><circle cx="${x + 7.5}" cy="${y + 17}" r="1.4" fill="#f6a6c8"/><circle cx="${x + 16.5}" cy="${y + 17}" r="1.4" fill="#f6a6c8"/><path d="M${x + 10.5} ${y + 17.5}q1.5 1.5 3 0" fill="none" stroke="${ink}" stroke-width="1" stroke-linecap="round"/>`;
  const lights = (x1, y1, x2, y2, sag, n) => {
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2;
    const bulbs = Array.from({length: n}, (_, i) => {
      const t = (i + .5) / n, u = 1 - t;
      const px = u * u * x1 + 2 * u * t * cx + t * t * x2, py = u * u * y1 + 2 * u * t * cy + t * t * y2;
      return `<ellipse class="bulb" style="--n:${i}" cx="${px.toFixed(1)}" cy="${(py + 3).toFixed(1)}" rx="2.2" ry="3" fill="${bulbColors[i % 4]}" stroke="${ink}" stroke-width=".7"/>`;
    }).join('');
    return `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="#6b9b70" stroke-width="1.2"/>${bulbs}`;
  };
  const tree = x => `<path d="M${x + 12} 6L${x + 2} 24H${x + 7}L${x} 36H${x + 24}L${x + 17} 24H${x + 22}Z" fill="#7ea98a" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${x + 10} 36h4v6h-4z" fill="#8a684b"/><circle cx="${x + 9}" cy="29" r="1.8" fill="#f6a6c8"/><circle cx="${x + 15}" cy="31" r="1.8" fill="#ffd66b"/><circle cx="${x + 12}" cy="20" r="1.6" fill="#c9b6f2"/><path d="m${x + 12} 1 1.7 3.6 3.9.5-2.9 2.6.8 3.8-3.5-1.9-3.5 1.9.8-3.8-2.9-2.6 3.9-.5Z" fill="#ffd66b" stroke="#c9a23c" stroke-width=".6"/>`;
  const gift = x => `<rect x="${x}" y="28" width="18" height="14" rx="2" fill="#f6a6c8" stroke="${ink}" stroke-width="1.2"/><rect x="${x - 1}" y="24" width="20" height="6" rx="1.5" fill="#ffd66b" stroke="${ink}" stroke-width="1.2"/><path d="M${x + 9} 24V42" stroke="#ffd66b" stroke-width="3"/><path d="M${x + 9} 24c-9 0-8-8-3-6 3 1 3 6 3 6Zm0 0c9 0 8-8 3-6-3 1-3 6-3 6Z" fill="#a6dcc8" stroke="${ink}" stroke-width="1"/>`;
  const star = (x, y, r, n) => `<path class="star" style="--n:${n}" d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="#ffd66b" stroke="#c9a23c" stroke-width=".7" stroke-linejoin="round"/>`;
  const scenes = {
    'halloween-despedida': () => web() + bat(44) + elf(62, 12, '#6b9b70', true),
    'natal-chegando-1': () => web(.55) + lights(14, 4, 60, 22, 7, 5) + elf(62, 12, '#6b9b70'),
    'natal-chegando-2': () => lights(2, 4, 60, 4, 6, 6) + gift(68),
    'natal-chegando-3': () => lights(2, 4, 58, 4, 6, 6) + tree(62),
    'natal': () => lights(2, 4, 38, 4, 5, 4) + tree(42) + elf(66, 12, '#e8708c'),
    'ano-novo': () => star(8, 20, 8, 0) + star(30, 10, 5.5, 1) + star(44, 26, 6.5, 2)
  };

  let scene;
  if (current && brand && scenes[current.id]) {
    document.documentElement.dataset.season = current.id;
    scene = document.createElement('span');
    scene.className = 'season-scene'; scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML = `<svg viewBox="0 0 90 44" focusable="false" xmlns="http://www.w3.org/2000/svg">${scenes[current.id]()}</svg>`;
    brand.append(scene);
    if (current.id === 'natal') {
      const sticker = document.querySelector('.media-sticker');
      if (sticker) sticker.innerHTML = labels.christmas;
    }
  }
  function update() {
    const visible = enabled && Boolean(scene);
    document.documentElement.classList.toggle('season-disabled', !visible);
    if (scene) scene.hidden = !visible;
    toggle.textContent = enabled ? labels.on : labels.off;
    toggle.setAttribute('aria-pressed', String(enabled));
  }
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem('artlumi-enfeites', enabled ? 'on' : 'off'); } catch (_) { /* Optional preference. */ }
    update();
  });
  update();
})();
