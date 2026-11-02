import test from 'node:test';
import assert from 'node:assert/strict';
import { selecionarPosts } from './bastidores-selecao.mjs';

const video = (code, day, extra = {}) => ({
  id: code,
  permalink: `https://www.instagram.com/reel/${code}/`,
  media_type: 'VIDEO',
  timestamp: `2026-10-${day}T12:00:00+0000`,
  ...extra
});
const posts = [video('old', '01'), video('new', '31'), video('middle', '30'), video('fourth', '29')];
const codes = (selected) => selected.map((post) => post.id);

test('sem fixados, escolhe os três vídeos mais recentes', () => {
  assert.deepEqual(codes(selecionarPosts(posts, [])), ['new', 'middle', 'fourth']);
});

test('fixado antigo vem antes dos dois mais recentes', () => {
  assert.deepEqual(codes(selecionarPosts(posts, ['old'])), ['old', 'new', 'middle']);
});

test('fixado também recente não duplica', () => {
  assert.deepEqual(codes(selecionarPosts(posts, ['new'])), ['new', 'middle', 'fourth']);
});

test('ignora fotos e álbuns, mas aceita REELS', () => {
  const mixed = [
    video('photo', '31', { media_type: 'IMAGE' }),
    video('album', '30', { media_type: 'CAROUSEL_ALBUM' }),
    video('reel', '29', { media_type: 'IMAGE', media_product_type: 'REELS' }),
    video('clip', '28')
  ];
  assert.deepEqual(codes(selecionarPosts(mixed, ['photo', 'album'])), ['reel', 'clip']);
});

test('devolve somente os vídeos disponíveis', () => {
  assert.deepEqual(codes(selecionarPosts(posts.slice(0, 2), [], 3)), ['new', 'old']);
});

test('fixado por URL com query casa pelo shortcode', () => {
  assert.deepEqual(codes(selecionarPosts(posts, ['https://instagram.com/p/old/?igsh=abc'])), ['old', 'new', 'middle']);
});
