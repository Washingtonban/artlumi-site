const CONFIG = {
  instagram: "https://www.instagram.com/artlumi.studio/",
  tiktok: "",
  youtube: "",
  whatsapp: "5541991019982",
  email: "contato@artlumi.com.br"
};

const language = document.documentElement.lang.split('-')[0];
const copy = {
  pt: { whatsapp: "Olá! Vim pelo site da Artlumi e quero fazer uma encomenda.", soon: "Em breve", menuOpen: "Abrir menu", menuClose: "Fechar menu", dark: "Ativar modo escuro", light: "Ativar modo claro" },
  en: { whatsapp: "Hi! I found Artlumi through the website and I'd like to place an order.", soon: "Coming soon", menuOpen: "Open menu", menuClose: "Close menu", dark: "Turn on dark mode", light: "Turn on light mode" },
  es: { whatsapp: "¡Hola! Llegué por el sitio de Artlumi y quiero hacer un pedido.", soon: "Próximamente", menuOpen: "Abrir menú", menuClose: "Cerrar menú", dark: "Activar modo oscuro", light: "Activar modo claro" }
}[language] || null;
const messages = copy || {
  whatsapp: "Olá! Vim pelo site da Artlumi e quero fazer uma encomenda.", soon: "Em breve", menuOpen: "Abrir menu", menuClose: "Fechar menu", dark: "Ativar modo escuro", light: "Ativar modo claro"
};
const socialNetworks = ["instagram", "tiktok", "youtube"];

const instaGrid = document.querySelector('.insta-grid');
if (instaGrid) {
  const labels = {
    pt: { small: 'Vídeo no Instagram', title: 'Ver vídeo' },
    en: { small: 'Video on Instagram', title: 'Watch on Instagram' },
    es: { small: 'Video en Instagram', title: 'Ver en Instagram' }
  }[language] || { small: 'Vídeo no Instagram', title: 'Ver vídeo' };
  const dia = new Date().toISOString().slice(0, 10);
  fetch(`/assets/bastidores.json?v=${dia}`)
    .then((response) => { if (!response.ok) throw new Error('Bastidores indisponíveis'); return response.json(); })
    .then(({ posts }) => {
      if (!Array.isArray(posts) || posts.length === 0) return;
      const cards = document.createDocumentFragment();
      for (const post of posts) {
        if (!post.permalink || !post.imagem) return;
        const link = document.createElement('a');
        link.className = 'insta-card';
        link.href = post.permalink;
        link.target = '_blank';
        link.rel = 'noopener';
        const img = document.createElement('img');
        img.src = `/${post.imagem.replace(/^\/+/, '')}`;
        img.width = 360;
        img.height = 640;
        img.loading = 'lazy';
        img.alt = '';
        const caption = document.createElement('span');
        caption.className = 'insta-caption';
        const small = document.createElement('small');
        small.textContent = labels.small;
        caption.append(small, document.createTextNode(`${language === 'pt' ? (post.legenda || labels.title) : labels.title} `));
        const arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗︎';
        caption.append(arrow);
        link.append(img, caption);
        cards.append(link);
      }
      instaGrid.replaceChildren(cards);
    })
    .catch(() => { /* O HTML estático permanece visível. */ });
}

document.querySelectorAll("[data-config]").forEach((link) => {
  const key = link.dataset.config;
  const value = (CONFIG[key] || "").trim();
  if (!value) { link.hidden = true; return; }
  if (key === "whatsapp") {
    const number = value.replace(/\D/g, "");
    if (!number) return;
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(messages.whatsapp)}`;
  } else if (key === "email") {
    link.href = `mailto:${value}`;
    link.firstChild.textContent = `${value} `;
  } else if (socialNetworks.includes(key)) link.href = value;
  link.hidden = false;
});

const comingSoon = document.getElementById("redes-em-breve");
comingSoon.firstChild.textContent = `${messages.soon} `;
comingSoon.hidden = socialNetworks.some((key) => Boolean((CONFIG[key] || "").trim()));

const menuButton = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu-principal");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", messages.menuOpen);
  menu.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? messages.menuOpen : messages.menuClose);
  menu.classList.toggle("is-open", !isOpen);
});
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

document.querySelectorAll('.language-switch a').forEach(link => link.addEventListener('click', () => {
  try { localStorage.setItem('artlumi-lang', link.lang.split('-')[0]); } catch (_) { /* Optional preference. */ }
}));

const themeButton = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const darkPreference = matchMedia('(prefers-color-scheme: dark)');
function activeTheme() { return document.documentElement.dataset.theme || (darkPreference.matches ? 'dark' : 'light'); }
function updateTheme() {
  const dark = activeTheme() === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? messages.light : messages.dark);
  themeButton.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  themeMeta.content = dark ? '#1e1a2e' : '#F6F1E8';
  const logo = document.querySelector('.brand img');
  logo.src = dark ? logo.src.replace('logo-artlumi.svg', 'logo-artlumi-branco.svg') : logo.src.replace('logo-artlumi-branco.svg', 'logo-artlumi.svg');
}
updateTheme();
themeButton.addEventListener('click', () => {
  const next = activeTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('artlumi-theme', next); } catch (_) { /* Optional preference. */ }
  updateTheme();
});
darkPreference.addEventListener('change', () => { if (!document.documentElement.dataset.theme) updateTheme(); });
