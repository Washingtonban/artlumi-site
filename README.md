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

A decoração sazonal é um pequeno detalhe SVG (até 90 × 44 px; 60 × 29 px no celular) ao lado do logotipo, dentro de `.site-header`. Não há nada no resto da página, nada voa nem cai. O desenho muda semana a semana e tem no máximo uma animação curta ao carregar (o duende varre duas vezes ou as luzinhas acendem); depois fica parado, e com `prefers-reduced-motion` não anima. Em dezembro o selo do hero troca para "feliz natal ✳" (e equivalentes).

O calendário inclusivo no começo de `assets/seasons.js` (`SEASON_CALENDAR`) usa o fuso `America/Sao_Paulo`. Para adicionar uma semana: inclua `{ id, from, to }` no array e uma entrada com o mesmo `id` no objeto `scenes` do mesmo arquivo, montada com as peças prontas (`web`, `bat`, `elf`, `lights`, `tree`, `gift`, `star`) numa tela de 90 × 44; o CSS fica em "Seasonal detail" no `assets/style.css`. Incremente o `?v=` de `seasons.js` e `style.css` nas três páginas.

Pré-visualize com `?tema=halloween-despedida`, `?tema=natal-chegando-1`, `?tema=natal-chegando-2`, `?tema=natal-chegando-3`, `?tema=natal`, `?tema=ano-novo` ou desative com `?tema=nenhum`. O botão no rodapé liga e desliga os enfeites e guarda a preferência em `artlumi-enfeites`.
