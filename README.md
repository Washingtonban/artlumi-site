# Artlumi

Landing page estática em português da Artlumi, o projeto que reúne as vertentes (Studio, Books, Keycap e Loja). Funciona sem build, servidor de aplicação ou bibliotecas JavaScript.

## Contatos e redes

Edite o objeto `CONFIG` no começo de `assets/site.js`. Preencha `instagram`, `tiktok` e `youtube` com URLs completas (`https://...`), `whatsapp` apenas com números e `email` com o endereço desejado. Links vazios ficam ocultos; se todas as redes estiverem vazias, a página mostra “Em breve”.

## Publicação

No repositório do GitHub, abra **Settings → Pages** e selecione **Deploy from a branch**, branch **main**, pasta **/ (root)**. O arquivo `CNAME` configura `artlumi.com.br`; o DNS do domínio também precisa apontar para o GitHub Pages. Para conferir localmente, abra `index.html` ou rode `python3 -m http.server` na raiz.

## Idiomas

A página principal (`/`) é em português; `/en/` e `/es/` têm versões em inglês e espanhol. Na primeira visita à raiz, o navegador sugere um idioma; o seletor PT · EN · ES grava a escolha em `artlumi-lang`. `?lang=pt|en|es` força o idioma na raiz. Edite as três páginas ao atualizar textos ou metadados.

## Modo escuro

O site segue a preferência de cores do sistema. O botão no cabeçalho alterna o tema e guarda a escolha em `artlumi-theme` para os três idiomas. As cores ficam em `assets/style.css`.

## Temas sazonais

O calendário inclusivo no começo de `assets/seasons.js` usa o fuso `America/Sao_Paulo`. Para adicionar uma semana, inclua `{ id, from, to }` no array e crie o desenho correspondente no mesmo arquivo, com regras em `assets/style.css`. Pré-visualize com `?tema=halloween-despedida`, `?tema=natal-chegando-1`, `?tema=natal-chegando-2`, `?tema=natal-chegando-3`, `?tema=natal`, `?tema=ano-novo` ou desative com `?tema=nenhum`. O botão no rodapé guarda a preferência em `artlumi-enfeites`.
