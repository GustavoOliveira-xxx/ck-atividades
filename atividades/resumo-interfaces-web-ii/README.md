# Atividade de Revisão · Interfaces Web II

Resumo e questionário da **Atividade de Revisão** do Prof. Clayton de Almeida Souza: *JavaScript, jQuery e DOM* e *IA e Segurança Digital*. Retoma os dois últimos trabalhos, a [Minha Lista de Estudos](../minha-lista-estudos/) e o [Fato ou Ruído?](../analise-critica-ia/), com exemplos de código, as 15 questões respondidas com fonte de pesquisa e exercícios de fixação no final.

| | |
|---|---|
| **Aluno** | Gustavo Oliveira dos Santos |
| **Turma** | 2º C · Informática para Internet |
| **Escola** | ETEC Taboão da Serra |
| **Componente** | Interfaces Web II · 4º bimestre |
| **Professor** | Clayton de Almeida Souza |
| **Entrega** | 23/10/2026 · individual |

## Entregáveis

| Arquivo | O que é |
|---|---|
| `relatorio-revisao-interfaces-web-ii.pdf` | Relatório em PDF (texto selecionável): capa, folha de rosto, sumário, resumos, 15 respostas com fonte, exercícios com gabarito e referências. Formatação do Manual do CPS (A4, Arial 12, entrelinha 1,5, margens 3/2 cm). |
| `index.html` + `css/` + `js/` + `assets/` | Site em vários arquivos (o mesmo publicado no acervo). |
| `revisao-interfaces-web-ii.html` | O site inteiro em **um arquivo só**, com jQuery embutido. Abre com dois cliques, sem internet. |

## O que o site faz

1. **Parte 1:** cinco cartões com o resumo de DOM, jQuery, `ready`, seletores/eventos/métodos e `let`/`const`/`if`, cada um com o trecho de código e botão *Copiar*.
2. **Laboratório:** a Minha Lista de Estudos funcionando com jQuery 3.7.1. Formulário com validação (`if` + `.trim()`), tecla **Enter** (`keydown`), contador, **tabela** com concluir/remover (delegação de eventos), registro dos métodos executados e teste de seletores que realça os elementos encontrados. A lista fica salva no navegador.
3. **Parte 2:** resumo do caso da IA no Medicare, linha do tempo com o grau de confirmação de cada fato e quatro cartões 3D de risco e prevenção.
4. **15 questões:** respostas com a fonte de cada uma, busca com destaque, filtros por parte e o botão **Marcar dúvida (\*)**, que coloca o asterisco na questão e abre um campo para descrever a dificuldade. **Baixar respostas (.txt)** exporta tudo, com as dúvidas.
5. **Prática:** seis exercícios com correção na hora, explicação e placar.
6. **Referências** no padrão ABNT.

### Requisitos técnicos

| Requisito | Onde está |
|---|---|
| Formulário | `#formLista` (laboratório) e campos de dúvida das questões |
| Tabela | `#corpoTabela`, montada com `.append()` |
| Manipulação do DOM | `js/app.js` monta cartões, questões, exercícios e referências a partir de `js/dados.js`; `js/laboratorio.js` usa jQuery |
| Eventos | `click`, `keydown`, `input`, `pointermove`, `scroll` |
| Layout responsivo | Grid/Flexbox com quebras em 1024, 860 e 560 px (testado em 390 px sem rolagem lateral) |
| 3D | árvore do DOM em CSS 3D que segue o mouse, cartões que inclinam, cartões de risco que giram e fundo em canvas (esfera de nós) |

### Acessibilidade e desempenho

- Navegação por teclado, link "Pular para o conteúdo", foco visível e menu que fecha com `Esc`.
- `aria-live` em mensagens, contador, placar e resultados; `aria-pressed` em filtros, cartões e dúvidas; tabela com `caption` e `th scope`.
- Respeita `prefers-reduced-motion` e tem o botão **Reduzir animações** no rodapé.
- O fundo 3D só começa depois que a página carrega, usa menos pontos no celular, limita a densidade de pixels e para quando a aba fica escondida.
- jQuery vem da CDN oficial com SRI; se a CDN falhar, carrega a cópia em `js/vendor/`.

## Como executar

**Direto:** abra `revisao-interfaces-web-ii.html` (arquivo único) ou `index.html` no navegador.

**Com servidor local** (recomendado para o `index.html`):

```bash
cd atividades/resumo-interfaces-web-ii
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

**Gerar de novo o PDF e o arquivo único** (depois de editar `js/dados.js`, onde está todo o texto):

```bash
pip install playwright pypdf
python -m playwright install chromium
python gerar-pdf.py
python gerar-arquivo-unico.py
```

## Publicação no GitHub

A atividade está no repositório [GustavoOliveira-xxx/ck-atividades](https://github.com/GustavoOliveira-xxx/ck-atividades), registrada no catálogo `atividades.js`. Com o GitHub Pages ligado em *Settings → Pages* (branch `main`, pasta raiz), a página fica em:

```
https://gustavooliveira-xxx.github.io/ck-atividades/atividades/resumo-interfaces-web-ii/
```

Para publicar uma alteração:

```bash
git add atividades/resumo-interfaces-web-ii atividades.js
git commit -m "Atualiza revisão de Interfaces Web II"
git push origin main
```

## Fontes

As referências completas estão no fim do PDF e da página. Principais: material da Atividade de Revisão, MDN Web Docs, documentação oficial do jQuery, Tecnoblog (25/09/2026) e The Boston Globe / The New York Times (24/09/2026).
