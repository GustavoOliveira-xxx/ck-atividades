# Eco Lunar · Turnê Brasil 2026

Atividade Prática: Organizando a Turnê de uma Banda · Interfaces Web II · ETEC Taboão da Serra · 2º C
Professor: Clayton de Almeida Souza
Grupo: Gustavo Oliveira dos Santos, Paulo Henrique de Lima Silva e Gabriel Heanna dos Reis

## Como executar

1. Descompacte o ZIP e abra a pasta `turne-banda` no VS Code.
2. Abra o `index.html` pelo botão Play (Executar e Depurar) ou com dois cliques.
3. Aperte F12 e veja a aba Console.

Pelo Play (`file:///`) o navegador bloqueia a leitura do `dados/turne.json` e o painel usa a lista de contingência do `script.js` (aviso amarelo no Console). Com um servidor local (Live Server ou `python -m http.server`) o JSON é lido via AJAX (aviso verde).

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura semântica, campos de busca e filtro, jQuery 3.7.1 por CDN com cópia local |
| `css/style.css` | Tema escuro de palco, variáveis `:root`, Flexbox, Grid e badges de status |
| `js/script.js` | `carregarDadosTurne()`, `criarCardShowHtml()`, `renderizarGradeShows()`, `aplicarFiltros()`, `atualizarPainelMetricas()` |
| `js/palco-3d.js` | Só o visual da CK: vinheta, estrelas 3D, lua 3D, cartões 3D |
| `dados/turne.json` | Os 8 shows da turnê |

## Testes rápidos

- Buscar `Curitiba`: fica só o show da Pedreira Paulo Leminski.
- Status `Esgotado`: 3 shows (São Paulo, Rio de Janeiro e Brasília) e 76.000 ingressos no topo.
- Sem filtro: 215.630 ingressos vendidos em 8 cidades.

A banda e os números são fictícios. Fontes Inter, Space Grotesk e JetBrains Mono sob licença SIL OFL (`assets/fontes`).
