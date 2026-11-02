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
    pt: { on: '✳ Enfeites: ligados', off: '✳ Enfeites: desligados', elf: 'Duende faxineiro', speech: 'Limpando o Halloween para o Natal chegar!', christmas: 'feliz<br>natal ✳' },
    en: { on: '✳ Decorations: on', off: '✳ Decorations: off', elf: 'Cleaning elf', speech: 'Sweeping up Halloween to make room for Christmas!', christmas: 'merry<br>christmas ✳' },
    es: { on: '✳ Adornos: activados', off: '✳ Adornos: desactivados', elf: 'Duende limpiador', speech: '¡Barriendo Halloween para que llegue la Navidad!', christmas: 'feliz<br>navidad ✳' }
  }[lang] || { on: '✳ Enfeites: ligados', off: '✳ Enfeites: desligados', elf: 'Duende faxineiro', speech: 'Limpando o Halloween para o Natal chegar!', christmas: 'feliz<br>natal ✳' };
  const query = new URLSearchParams(location.search).get('tema');
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(part => [part.type, part.value]));
  const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const current = query === 'nenhum' ? null : SEASON_CALENDAR.find(item => item.id === query) || (query ? null : SEASON_CALENDAR.find(item => item.from <= today && today <= item.to));
  const toggle = document.querySelector('.decor-toggle');
  let enabled = true;
  try { enabled = localStorage.getItem('artlumi-enfeites') !== 'off'; } catch (_) { /* Optional preference. */ }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const svg = (body, viewBox = '0 0 80 80') => `<svg viewBox="${viewBox}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const bat = svg('<path d="M39 31C32 20 27 20 22 28 13 21 7 25 3 38c7-3 12-1 15 6 4-4 8-3 12 4 4-4 7-3 10 1 3-4 6-5 10-1 4-7 8-8 12-4 3-7 8-9 15-6-4-13-10-17-19-10-5-8-10-8-19 3Z" fill="#6f5b91" stroke="#3c315b" stroke-width="2" stroke-linejoin="round"/><circle cx="34" cy="39" r="2"/><circle cx="46" cy="39" r="2"/><circle cx="29" cy="44" r="3" fill="#f6a6c8"/><circle cx="51" cy="44" r="3" fill="#f6a6c8"/><path d="M37 46q3 4 6 0" fill="none" stroke="#332846" stroke-width="2" stroke-linecap="round"/>');
  const web = svg('<path d="M0 0H80M0 0V80M0 0q28 2 51 29T80 80M0 15q30 0 55 23M0 30q24-1 43 19M0 46q17-1 29 16M17 0q-2 29 15 58M34 0q-2 20 23 48M52 0q-1 15 19 27" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M48 18v20" stroke="currentColor" stroke-width="2.5"/><circle cx="48" cy="45" r="9" fill="#a6dcc8"/><circle cx="45" cy="44" r="1.3"/><circle cx="51" cy="44" r="1.3"/><path d="M45 49q3 3 6 0" fill="none" stroke="#3c315b" stroke-width="1.5"/><circle cx="39" cy="47" r="2" fill="#f6a6c8"/><circle cx="57" cy="47" r="2" fill="#f6a6c8"/>');
  const elf = svg('<path d="M31 59 13 76" stroke="#8a684b" stroke-width="4" stroke-linecap="round"/><path d="M18 68q4 8 12 7M17 72q4 8 11 7" stroke="#ffd66b" stroke-width="3" fill="none"/><path d="M27 58q12-7 27 0l5 18H24Z" fill="#a6dcc8" stroke="#3c315b" stroke-width="2"/><path d="M26 25 48 3 63 34Z" fill="#6b9b70" stroke="#3c315b" stroke-width="2"/><path d="M26 25q19-6 37 8" fill="none" stroke="#f6a6c8" stroke-width="7" stroke-linecap="round"/><circle cx="51" cy="8" r="5" fill="#ffd66b"/><ellipse cx="44" cy="44" rx="17" ry="16" fill="#f7d3b2"/><path d="m29 40-9-5 5 12 5 1m29-8 9-5-4 12-5 1" fill="#f7d3b2" stroke="#3c315b" stroke-width="2"/><circle cx="38" cy="43" r="2"/><circle cx="50" cy="43" r="2"/><circle cx="32" cy="49" r="3" fill="#f6a6c8"/><circle cx="56" cy="49" r="3" fill="#f6a6c8"/><path d="M40 50q4 4 8 0" stroke="#3c315b" stroke-width="2" fill="none"/><path d="M26 61 19 51M55 61 67 50" stroke="#f7d3b2" stroke-width="6" stroke-linecap="round"/>');
  const tree = svg('<path d="M40 5 16 49h12L13 66h54L52 49h12Z" fill="#7ea98a" stroke="#3c315b" stroke-width="2" stroke-linejoin="round"/><path d="M36 66h8v12h-8" fill="#8a684b"/><circle cx="32" cy="43" r="4" fill="#f6a6c8"/><circle cx="49" cy="54" r="4" fill="#ffd66b"/><circle cx="39" cy="34" r="3" fill="#c9b6f2"/><path d="m40 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#ffd66b"/>');
  const wreath = svg('<circle cx="40" cy="40" r="25" fill="none" stroke="#7ea98a" stroke-width="13"/><circle cx="27" cy="23" r="4" fill="#f6a6c8"/><circle cx="55" cy="34" r="4" fill="#ffd66b"/><circle cx="40" cy="61" r="4" fill="#c9b6f2"/><path d="M34 13q6-7 12 0l-6 13Z" fill="#f6a6c8"/>');
  const gift = svg('<rect x="16" y="30" width="48" height="42" rx="5" fill="#f6a6c8"/><rect x="12" y="25" width="56" height="11" rx="3" fill="#ffd66b"/><path d="M40 26v46" stroke="#ffd66b" stroke-width="7"/><path d="M40 25c-25 0-20-20-7-14 6 3 7 14 7 14Zm0 0c25 0 20-20 7-14-6 3-7 14-7 14Z" fill="#a6dcc8" stroke="#3c315b" stroke-width="2"/>');
  const layer = document.createElement('div');
  layer.className = 'season-layer'; layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const add = (className, markup, parent = layer) => {
    const el = document.createElement('span'); el.className = `season-item ${className}`; el.innerHTML = markup; parent.append(el); return el;
  };
  let elfButton;
  function showElf(className) {
    elfButton = document.createElement('button'); elfButton.type = 'button'; elfButton.className = `season-elf ${className}`;
    elfButton.setAttribute('aria-label', labels.elf); elfButton.innerHTML = elf;
    document.body.append(elfButton);
    return elfButton;
  }
  if (current) {
    document.documentElement.dataset.season = current.id;
    const id = current.id;
    if (id === 'halloween-despedida' || id === 'natal-chegando-1') {
      const goodbye = id === 'halloween-despedida';
      const small = innerWidth < 720;
      const count = goodbye ? (small ? 7 : 12) : 1;
            const sizes = small ? [40, 46, 42, 50, 44, 40, 48] : [48, 60, 42, 64, 52, 44, 58, 40, 62, 50, 46, 56];
      for (let i = 0; i < count; i++) {
        const el = add(`season-bat ${goodbye ? 'flying' : 'sleeping'}`, bat);
        el.style.setProperty('--x', goodbye ? (i % 2 ? `calc(100% - ${sizes[i] + 4 + i % 3 * 3}px)` : `${4 + i % 3 * 3}px`) : `${(i * 29 + 7) % 90}%`);
        el.style.setProperty('--y', `${goodbye ? (i * 47 + 12) % 78 : (i * 37 + 9) % 76}%`);
        el.style.setProperty('--size', `${goodbye ? sizes[i] : 46}px`);
        el.style.setProperty('--delay', `${-i * 2.3}s`);
        el.style.setProperty('--duration', `${17 + i % 5 * 3}s`);
      }
      if (goodbye) {
        ['.project-section', '.about-section', '.contact-section', '.ventures-section'].forEach((selector, i) => {
          const parent = document.querySelector(selector);
          if (!parent) return;
          const hanging = add('season-bat hanging', bat, parent);
          hanging.style.setProperty('--size', `${40 + i % 2 * 6}px`);
          hanging.style.setProperty('--hx', `${i % 2 ? 'auto' : '4%'}`);
          hanging.style.setProperty('--hr', `${i % 2 ? '4%' : 'auto'}`);
        });
      }
      const targets = goodbye ? ['.hero','.project-section','.pillar-card','.ventures-section','.venture-card','.about-section','.social-section','.contact-section'] : ['.hero','.project-section'];
      const webs = targets.map((selector, i) => {
        const parent = document.querySelector(selector);
        const el = add(`season-web ${['right', 'left', 'right', 'left', 'left', 'right', 'left', 'right'][i % 8]}`, web, parent);
        if (!i) el.style.setProperty('--top', '82px');
        el.style.setProperty('--s', `${selector.endsWith('card') ? (small ? 64 : 84) : small ? 80 + i % 3 * 12 : 110 + i % 3 * 20}px`);
        return el;
      });
      const button = showElf(goodbye ? 'sweeping-elf' : 'hanging-elf');
      let swept = 0;
      function sweep() {
        if (!goodbye || motion.matches || swept >= 3 || !enabled || document.hidden) return;
        const target = webs[swept++];
        const elfRect = button.getBoundingClientRect();
        const webRect = target.getBoundingClientRect();
        button.style.setProperty('--sweep-x', `${Math.max(-innerWidth + 90, Math.min(0, webRect.left - elfRect.left))}px`);
        button.style.setProperty('--sweep-y', `${Math.max(-innerHeight + 90, Math.min(0, webRect.top - elfRect.top))}px`);
        button.classList.add('is-sweeping');
        const bubble = document.createElement('span'); bubble.className = 'elf-speech'; bubble.textContent = labels.speech; button.append(bubble);
        window.setTimeout(() => { target.classList.add('swept'); button.classList.remove('is-sweeping'); bubble.remove(); }, 3000);
      }
      if (goodbye) {
        button.addEventListener('click', sweep);
        window.setTimeout(() => { sweep(); window.setInterval(sweep, 20000); }, 4000);
      }
    }
    if (id.startsWith('natal')) {
      add('season-lights', Array.from({length: id === 'natal-chegando-1' ? 5 : 12}, (_,i) => `<i style="--n:${i}"></i>`).join(''), document.querySelector('.site-header'));
      if (id === 'natal-chegando-1') add('season-wreath', wreath, document.querySelector('.hero'));
      if (id === 'natal-chegando-2' || id === 'natal-chegando-3' || id === 'natal') {
        const count = id === 'natal-chegando-2' ? 6 : 12;
        for (let i = 0; i < count; i++) {
          const flake = add('season-snow', '✳');
          flake.style.setProperty('--x', `${(i * 31 + 5) % 95}%`);
          flake.style.setProperty('--delay', `${-i * 2.8}s`);
          flake.style.setProperty('--duration', `${15 + i % 6 * 3}s`);
        }
        const button = showElf(id === 'natal' ? 'waving-elf' : 'gift-elf');
        if (id !== 'natal') add('season-gift', gift, button);
      }
      if (id === 'natal-chegando-3' || id === 'natal') {
        add('season-tree', tree, document.querySelector('.hero'));
        document.querySelectorAll('.project-section,.ventures-section,.about-section,.social-section,.contact-section').forEach((section, i) => add('season-ornament', i % 2 ? '✳' : '●', section));
      }
      if (id === 'natal') {
        document.querySelector('.media-sticker').innerHTML = labels.christmas;
        document.querySelectorAll('.project-section,.about-section,.contact-section').forEach(section => add('section-wreath', wreath, section));
      }
    }
    if (id === 'ano-novo') {
      for (let i = 0; i < 20; i++) {
        const item = add('season-confetti', i % 3 ? '✦' : '●');
        item.style.setProperty('--x', `${(i * 37 + 4) % 95}%`);
        item.style.setProperty('--delay', `${-i * 1.6}s`);
        item.style.setProperty('--duration', `${16 + i % 5 * 3}s`);
      }
    }
  }
  function update() {
    const visible = enabled && Boolean(current);
    document.documentElement.classList.toggle('season-disabled', !visible);
    layer.hidden = !visible;
    if (elfButton) elfButton.hidden = !visible;
    toggle.textContent = enabled ? labels.on : labels.off;
    toggle.setAttribute('aria-pressed', String(enabled));
  }
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem('artlumi-enfeites', enabled ? 'on' : 'off'); } catch (_) { /* Optional preference. */ }
    update();
  });
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('season-paused', document.hidden));
  motion.addEventListener('change', () => document.documentElement.classList.toggle('season-reduced', motion.matches));
  document.documentElement.classList.toggle('season-reduced', motion.matches);
  update();
})();
