# Artlumi Studio

Landing page estática em português para a Artlumi Studio. Funciona sem build, servidor de aplicação ou bibliotecas JavaScript.

## Contatos e redes

Edite o objeto `CONFIG` no começo de `assets/site.js`. Preencha `instagram`, `tiktok` e `youtube` com URLs completas (`https://...`), `whatsapp` apenas com números e `email` com o endereço desejado. Links vazios ficam ocultos; se todas as redes estiverem vazias, a página mostra “Em breve”.

## Publicação

No repositório do GitHub, abra **Settings → Pages** e selecione **Deploy from a branch**, branch **main**, pasta **/ (root)**. O arquivo `CNAME` configura `artlumi.com.br`; o DNS do domínio também precisa apontar para o GitHub Pages. Para conferir localmente, abra `index.html` ou rode `python3 -m http.server` na raiz.
