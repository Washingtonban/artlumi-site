export function shortcode(valor) {
  if (typeof valor !== 'string') return null;
  const texto = valor.trim();
  if (/^[A-Za-z0-9_-]+$/.test(texto)) return texto;
  return texto.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)(?:[/?#]|$)/)?.[1] || null;
}

export function selecionarPosts(posts, fixados, n = 3) {
  const videos = posts.filter((post) =>
    (post.media_type === 'VIDEO' || post.media_product_type === 'REELS') && shortcode(post.permalink)
  );
  const porCodigo = new Map(videos.map((post) => [shortcode(post.permalink), post]));
  const escolhidos = [];
  const vistos = new Set();
  const incluir = (post) => {
    if (!post || escolhidos.length >= n) return;
    const codigo = shortcode(post.permalink);
    if (vistos.has(codigo)) return;
    vistos.add(codigo);
    escolhidos.push(post);
  };
  for (const fixado of fixados) incluir(porCodigo.get(shortcode(fixado)));
  for (const post of [...videos].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))) incluir(post);
  return escolhidos;
}
