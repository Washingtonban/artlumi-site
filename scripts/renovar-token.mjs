import { spawn } from 'node:child_process';

const token = process.env.IG_TOKEN?.trim();
const pat = process.env.GH_PAT?.trim();
if (!token || !pat) {
  console.warn('IG_TOKEN ou GH_PAT ausente; renovação mensal ignorada.');
  process.exit(0);
}
console.log(`::add-mask::${token}`);

try {
  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', token);
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Renovação do Instagram retornou HTTP ${resposta.status}`);
  const dados = await resposta.json();
  if (!dados.access_token) throw new Error('Renovação do Instagram não retornou access_token');
  console.log(`::add-mask::${dados.access_token}`);
  await new Promise((resolve, reject) => {
    const gh = spawn('gh', ['secret', 'set', 'IG_TOKEN', '--repo', process.env.GITHUB_REPOSITORY], {
      env: { ...process.env, GH_TOKEN: pat },
      stdio: ['pipe', 'ignore', 'pipe']
    });
    gh.stdin.end(dados.access_token);
    gh.stderr.resume();
    gh.on('error', () => reject(new Error('Não foi possível executar gh secret set')));
    gh.on('close', (code) => code === 0 ? resolve() : reject(new Error(`gh secret set falhou (código ${code})`)));
  });
  console.log('IG_TOKEN renovado no secret do repositório.');
} catch (erro) {
  console.error(`Erro ao renovar IG_TOKEN: ${erro.message}`);
  process.exitCode = 1;
}
