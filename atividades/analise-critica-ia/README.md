# Fato ou Ruído? Análise crítica de notícia com HTML, CSS e JavaScript

Página interativa de análise crítica da reportagem **"Austrália investiga invasão do sistema de saúde pela IA"** (Jornal Nacional / G1, 24/09/2026). A página ajuda o leitor a separar fatos de opiniões, avaliar as fontes, identificar riscos e escrever um parecer próprio.

| | |
|---|---|
| **Dupla** | Gustavo Oliveira dos Santos e Paulo Henrique de Lima Silva |
| **Turma** | 2º C · Informática para Internet |
| **Escola** | ETEC Taboão da Serra |
| **Componente** | Interfaces Web II |
| **Professor** | Clayton de Almeida Souza |
| **Entrega** | 23/10/2026 · 4º bimestre |

## Arquivos

```
analise-critica-ia/
├── index.html                      página (HTML semântico)
├── css/estilo.css                  visual, variáveis, grid, responsivo
├── js/dados.js                     arrays de objetos com o conteúdo
├── js/cena.js                      fundo 3D em canvas
├── js/app.js                       DOM, eventos, pontuação e validação
├── assets/logo-ck.webp             logo original da Conscious Knowledge
├── analise-critica-ia.html         a mesma página em arquivo único
├── relatorio-analise-critica-ia.pdf
├── Dockerfile
├── .dockerignore
└── .gitignore
```

## O que a página faz

1. **Notícia**: resumo dos fatos, pontos em que as fontes divergem e linha do tempo.
2. **Exercício 1**: seis afirmações para classificar como fato verificável, opinião ou não confirmado. Cada clique mostra se acertou, o motivo e soma 10 pontos por acerto.
3. **Exercício 2**: checklist de seis perguntas que calcula o nível de confiança na hora (marcadas ÷ 6 × 100) e compara com a avaliação da dupla. Abaixo, uma tabela com as seis fontes citadas, filtrável por confiabilidade.
4. **Riscos**: quatro cartões 3D que giram para mostrar responsáveis e medidas de prevenção. Cada um pode ser escolhido como risco principal do parecer.
5. **Exercício 3**: formulário com validação (nome, turma, risco principal, parecer com mínimo de 80 palavras e confirmação). O contador de palavras atualiza enquanto a pessoa digita, o rascunho fica salvo no navegador e o parecer validado pode ser baixado em `.txt`.
6. **Placar**: classificação (60) + checklist (15) + parecer validado (25) = 100 pontos.

## Requisitos técnicos atendidos

| Requisito | Onde está |
|---|---|
| Tags semânticas `header`, `main`, `section`, `footer` | `index.html` (também `nav`, `article`, `aside`) |
| Formulário com `label` | `#formParecer` e `#checklist` |
| Links | menu interno, reportagem do G1, MDN e acervo no rodapé |
| Tabela | `table` das fontes, com `caption`, `thead`, `th scope` |
| Variáveis CSS (`:root`) | início de `css/estilo.css` |
| Flexbox e Grid | painéis e botões em flex; abertura, cartões e riscos em grid |
| Layout responsivo (`@media`) | quebras em 1024, 860, 640 e 560 px |
| Estados `:hover` | botões, menu, opções, linhas da tabela, cartões |
| Classes de feedback | `.is-certo`, `.is-errado`, `.is-valido`, `.is-invalido`, `.is-alta`, `.is-media`, `.is-baixa`, `.aviso.is-erro`, `.aviso.is-sucesso` |
| Manipulação do DOM | cartões, tabela, checklist e riscos criados em `js/app.js` a partir de `js/dados.js` |
| Eventos `click` e `input` | classificação, filtros, cartões, contador de palavras |
| Array de objetos | `AFIRMACOES`, `CHECKLIST`, `FONTES`, `RISCOS`, `LINHA_DO_TEMPO` |
| Cálculo de pontuação | `atualizarClassificacao`, `atualizarConfianca`, `atualizarPlacar` |
| Validação do formulário | `validarFormulario` com mensagens por campo |

## Acessibilidade e desempenho

- Navegação completa por teclado, link "Pular para o conteúdo" e foco visível.
- `aria-live` nos placares e nas mensagens de erro, `aria-pressed` nos botões de escolha, `inert` na face escondida dos cartões que giram.
- Respeita `prefers-reduced-motion` e tem botão "Reduzir animações" no rodapé.
- O fundo 3D é um canvas leve, limitado a 1,5× de densidade de pixels, e para quando a aba fica escondida.
- Sem bibliotecas: só HTML, CSS e JavaScript puro.

## Como executar

**Direto no navegador:** abra `analise-critica-ia.html` (arquivo único) ou `index.html`.

**Com servidor local:**

```bash
cd atividades/analise-critica-ia
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Publicar em um container (Killercoda)

1. Abra o [Ubuntu Playground do Killercoda](https://killercoda.com/playgrounds/scenario/ubuntu) e inicie o ambiente.
2. Envie a pasta para o laboratório (ou clone o repositório):

```bash
git clone https://github.com/GustavoOliveira-xxx/ck-atividades.git
cd ck-atividades/atividades/analise-critica-ia
ls
cat Dockerfile
```

3. Construa a imagem e confira:

```bash
docker build -t site-turma:v1 .
docker images
```

4. Execute o container e teste:

```bash
docker run -d --name site-turma -p 8080:80 site-turma:v1
docker ps
curl http://localhost:8080
```

5. Desafio de autonomia: altere o `index.html`, gere a versão 2 e confira.

```bash
docker build -t site-turma:v2 .
docker images
```

O laboratório do Killercoda é temporário: salve o código no computador ou no GitHub antes de fechar.

## Publicar no GitHub

A atividade já está no acervo, no repositório [GustavoOliveira-xxx/ck-atividades](https://github.com/GustavoOliveira-xxx/ck-atividades). Com o GitHub Pages ligado em *Settings → Pages* (branch `main`, pasta raiz), a página fica em:

```
https://gustavooliveira-xxx.github.io/ck-atividades/atividades/analise-critica-ia/
```

## Observações

- A análise usa a reportagem e o resumo dos fatos da folha da atividade, com os pontos em que as fontes divergem.
- A afirmação 1 foi classificada como fato porque foi declarada pelo governo e reconhecida pela empresa; o tamanho exato do acesso ainda está sob investigação.
- A publicação no Killercoda, com os prints e as explicações de cada etapa, está na seção 8.1 do relatório em PDF.

## Referências

- G1. Jornal Nacional. *Austrália investiga invasão do sistema de saúde pela IA*. 24 set. 2026. Disponível em: <https://g1.globo.com/jornal-nacional/noticia/2026/09/24/australia-investiga-invasao-do-sistema-de-saude-pela-ia.ghtml>.
- MDN Web Docs. [HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML), [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS) e [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript).
- Docker Hub. [Imagem oficial do nginx](https://hub.docker.com/_/nginx).
- Killercoda. [Ubuntu Playground](https://killercoda.com/playgrounds/scenario/ubuntu).
