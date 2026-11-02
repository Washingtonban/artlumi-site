import { readFile, readdir, stat, writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selecionarPosts, shortcode } from './bastidores-selecao.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const arquivoJson = path.join(raiz, 'assets/bastidores.json');
const pastaImagens = path.join(raiz, 'assets/img/bastidores');

function legenda(caption) {
  const linha = String(caption || '').split(/\r?\n/, 1)[0]
    .replace(/(^|\s)#[^\s#]+/g, '$1').replace(/\s+/g, ' ').trim();
  const letras = Array.from(linha);
  if (letras.length <= 60) return linha;
  const trecho = letras.slice(0, 59).join('');
  const palavra = trecho.replace(/\s+\S*$/, '').trimEnd();
  return `${palavra || trecho.trimEnd()}…`;
}

async function buscarPosts(token) {
  const url = new URL('https://graph.instagram.com/me/media');
  url.searchParams.set('fields', 'id,caption,media_type,media_product_type,permalink,thumbnail_url,timestamp');
  url.searchParams.set('limit', '40');
  url.searchParams.set('access_token', token);
  const posts = [];
  let proxima = url.href;
  while (proxima && posts.length < 80) {
    if (new URL(proxima).hostname !== 'graph.instagram.com') throw new Error('Paginação da API com host inesperado');
    let resposta;
    try { resposta = await fetch(proxima); }
    catch { throw new Error('Falha de rede ao consultar a API do Instagram'); }
    if (!resposta.ok) throw new Error(`API do Instagram retornou HTTP ${resposta.status}`);
    let corpo;
    try { corpo = await resposta.json(); }
    catch { throw new Error('Resposta JSON inválida da API do Instagram'); }
    if (!Array.isArray(corpo.data)) throw new Error('Resposta da API do Instagram sem lista de mídias');
    posts.push(...corpo.data.slice(0, 80 - posts.length));
    proxima = corpo.paging?.next || null;
  }
  return posts;
}

async function existe(arquivo) {
  try { return (await stat(arquivo)).isFile(); }
  catch (erro) { if (erro.code === 'ENOENT') return false; throw erro; }
}

async function atualizar() {
  const token = process.env.IG_TOKEN?.trim();
  if (!token) { console.warn('IG_TOKEN ausente; Bastidores não foram alterados.'); return; }
  const { fixados } = JSON.parse(await readFile(path.join(raiz, 'bastidores/fixados.json'), 'utf8'));
  if (!Array.isArray(fixados)) throw new Error('bastidores/fixados.json deve conter uma lista "fixados"');
  const escolhidos = selecionarPosts(await buscarPosts(token), fixados);
  const posts = escolhidos.map((post) => {
    const codigo = shortcode(post.permalink);
    return {
      permalink: post.permalink,
      imagem: `assets/img/bastidores/${codigo}.jpg`,
      legenda: legenda(post.caption),
      data: post.timestamp
    };
  });
  await mkdir(pastaImagens, { recursive: true });
  for (let i = 0; i < escolhidos.length; i++) {
    const post = escolhidos[i];
    const arquivo = path.join(raiz, posts[i].imagem);
    if (await existe(arquivo)) continue;
    if (!post.thumbnail_url) throw new Error(`Vídeo ${shortcode(post.permalink)} sem thumbnail_url`);
    let resposta;
    try { resposta = await fetch(post.thumbnail_url); }
    catch { throw new Error(`Falha de rede ao baixar capa de ${shortcode(post.permalink)}`); }
    if (!resposta.ok) throw new Error(`Falha ao baixar capa de ${shortcode(post.permalink)}: HTTP ${resposta.status}`);
    await writeFile(arquivo, Buffer.from(await resposta.arrayBuffer()));
  }
  const anteriores = JSON.parse(await readFile(arquivoJson, 'utf8'));
  if (JSON.stringify(anteriores.posts) !== JSON.stringify(posts)) {
    await writeFile(arquivoJson, `${JSON.stringify({ atualizado: new Date().toISOString(), posts }, null, 2)}\n`);
    console.log(`Bastidores atualizados: ${posts.length} vídeo(s).`);
  } else console.log('Bastidores sem mudanças.');
  const manter = new Set([...posts.map((post) => path.basename(post.imagem)), 'post-1.jpg', 'post-2.jpg', 'post-3.jpg']);
  for (const nome of await readdir(pastaImagens)) {
    if (/\.(?:jpe?g|png|webp)$/i.test(nome) && !manter.has(nome)) await unlink(path.join(pastaImagens, nome));
  }
}

atualizar().catch((erro) => {
  console.error(`Erro ao atualizar Bastidores: ${erro.message.replaceAll(process.env.IG_TOKEN || '\u0000', '[oculto]')}`);
  process.exitCode = 1;
});
