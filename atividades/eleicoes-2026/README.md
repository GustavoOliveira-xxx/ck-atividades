# CK Eleições 2026 — São Paulo

**Sistema de Transparência Eleitoral (SP)** — adaptação da *Atividade Prática: XML, JSON e APIs*
para o tema Eleições 2026, conforme a Atividade Avaliativa II.

- **Disciplina:** Interface Web II
- **Turma:** 2º C — M-Tec Informática para Internet · ETEC Taboão da Serra
- **Professor:** Clayton de Almeida Souza
- **Grupo:** Conscious Knowledge (CK)

> ⚠️ **Projeto acadêmico.** Sem vínculo com a Justiça Eleitoral, com partidos ou com campanhas.
> Veja a seção [Avisos](#avisos) antes de usar qualquer informação daqui.

---

## O que a atividade pedia, e onde está cumprido

| Enunciado | Onde está | Arquivo |
| --- | --- | --- |
| Trocar `<piada>` por `<cargo titulo="…" poder="…">` com `<descricao>` interna | Bloco `<cargos>` do XML | `js/dados-xml.js` |
| Ler o XML com `DOMParser` e montar a interface | `parseFromString` + `querySelectorAll` | `js/xml.js` |
| Badge colorido pelo atributo `poder`, com *fallback* | `CLASSE_PODER[poder] \|\| "badge-legislativo"` | `js/dados-xml.js`, `js/xml.js` |
| CSV com cabeçalho `Cargo;Poder;Descrição` | `exportarCargosParaPlanilha()` | `js/exportar.js` |
| Manter o BOM `﻿` no CSV | primeira linha da string do CSV | `js/exportar.js` |
| Limpeza `replace(/;/g, ",")` | função `limpar()`, aplicada a todo campo | `js/exportar.js` |
| Baixar o XML original sem servidor | `Blob` + `URL.createObjectURL` | `js/exportar.js` |
| `<select>` de cargo → `fetch` → JSON → cards | fluxo assíncrono da Parte 2 | `js/api.js` |
| Resolver o CORS do TSE | **Abordagem 1 (mock local)**, indicada na aula | `dados/*.json` |
| Card de candidato com nome, partido e propostas | card 3D com frente e verso | `js/api.js` |

---

## Estrutura

```
eleicoes-2026/
├── index.html                  página única
├── css/
│   ├── base.css                tokens, reset, cursor
│   ├── layout.css              cenário, cabeçalho, hero, seções, rodapé
│   ├── componentes.css         selo duplo, urna 3D, cards, visor XML
│   └── animacoes.css           tela de carga + keyframes
├── js/
│   ├── dados-xml.js            ⭐ const xmlTexto — a base de dados
│   ├── xml.js                  DOMParser, leitura e render dos cargos
│   ├── exportar.js             Blob → XML e CSV
│   ├── api.js                  fetch + JSON → cards de candidato
│   ├── urna.js                 a urna 3D votando em laço
│   ├── cena.js                 partículas em canvas
│   └── ui.js                   carga animada, tilt 3D, contadores
├── dados/                      recortes JSON no formato do TSE
│   ├── indice.json
│   └── candidatos-*.json       (5 arquivos, um por cargo)
└── assets/
    ├── logo-ck.png
    ├── logo-ck-remaster.png
    └── candidatos/             15 retratos
```

---

## A urna 3D do topo

O objeto principal do hero é uma urna eletrônica montada só com transforms 3D
— corpo em caixa de seis faces, painel inclinado e teclado numérico deitado.
Nenhuma imagem: é CSS.

E ela não é enfeite. O `js/urna.js` executa uma votação de verdade, em laço,
com os candidatos lidos do XML da Parte 1:

```
mostra o cargo
   ↓
digita o número dígito a dígito, acendendo a tecla de cada um
   ↓
revela nome, partido e foto
   ↓
pisca "aperte confirma" e acende a tecla CONFIRMA
   ↓
FIM  →  próximo candidato
```

O roteiro intercala os cargos, então a urna passa por Presidente, Governador,
Senador e os dois deputados antes de repetir alguém. A animação congela quando
a urna sai da tela ou a aba perde o foco, e com `prefers-reduced-motion` ela
nem começa: mostra uma ficha parada e já preenchida.

---

## Como o dado flui

### Parte 1 — XML local (nada de rede)

```
const xmlTexto            js/dados-xml.js
      ↓
new DOMParser()
  .parseFromString(xmlTexto, "text/xml")
      ↓
xmlDoc.querySelectorAll("cargos > cargo")
      ↓
getAttribute("titulo") · getAttribute("poder")
querySelector("descricao").textContent
      ↓
CLASSE_PODER[poder] || "badge-legislativo"
      ↓
cards no DOM
```

### Parte 2 — fetch + JSON

```
<select> cargo
      ↓
fetch("dados/candidatos-<cargo>.json")
      ↓
await resposta.json()
      ↓
dados.candidatos.map(...)
      ↓
cards 3D  ←  propostas cruzadas do XML da Parte 1
```

O cruzamento das duas partes é proposital: o **JSON** traz a ficha de candidatura
(nome de urna, número, situação, coligação) e o **XML** traz as propostas.
Os dois paradigmas da aula se encontram no mesmo card.

---

## Sobre o CORS

O endpoint público do TSE não envia `Access-Control-Allow-Origin`, então o navegador
bloqueia a leitura da resposta a partir de outra origem. Das três saídas apresentadas na
aula — *mock*, *proxy* e *backend próprio* — esta entrega usa a **abordagem 1 (mock)**,
que o próprio enunciado indica como opção válida e "à prova de falhas".

Os arquivos em `dados/` reproduzem o **formato** da resposta do DivulgaCandContas
(`dadosGerais` + `candidatos[]`). Para apontar para o TSE real depois, basta trocar
a constante `ORIGEM_DADOS` no topo de `js/api.js`.

---

## Rodando localmente

O `fetch` da Parte 2 exige HTTP — abrir o `index.html` direto do disco (`file://`) faz a
Parte 2 falhar (a Parte 1, que é só XML em memória, continua funcionando).

```bash
# a partir da raiz do repositório
python3 -m http.server 8000
# depois abra:
# http://localhost:8000/atividades/eleicoes-2026/
```

---

## Candidatos apresentados

Três por cargo, quinze no total — recorte suficiente para demonstrar o XML, o `fetch`,
os filtros e os cards, sem virar um portal eleitoral.

| Cargo | Candidatos |
| --- | --- |
| Presidente | Lula (PT) · Flávio Bolsonaro (PL) · Ronaldo Caiado (PSD) |
| Governador | Tarcísio de Freitas (Republicanos) · Fernando Haddad (PT) · Vera Lúcia (PSTU) |
| Senador | Guilherme Derrite (PP) · Marina Silva (Rede) · Simone Tebet (PSB) |
| Deputado Federal | Guilherme Boulos (PSOL) · Tabata Amaral (PSB) · Nikolas Ferreira (PL) |
| Deputado Estadual | Bruna Furlan (PSDB) · Major Mecca (PL) · Carlos Giannazi (PSOL) |

---

## Avisos

1. **Trabalho escolar.** Nenhum vínculo com a Justiça Eleitoral, com partidos ou com campanhas.
2. **As propostas são resumos editoriais escritos pelo grupo**, a partir da trajetória pública
   de cada candidato. **Não são transcrição de programa de governo registrado.** Antes de
   apresentar, confira cada texto contra o programa oficial no
   [DivulgaCandContas](https://divulgacandcontas.tse.jus.br) e ajuste o que for necessário.
3. **O número exibido é o número do partido**, que corresponde ao número de urna nas disputas
   majoritárias (Presidente e Governador). Nas proporcionais, o número individual do candidato
   é definido no registro da candidatura.
4. **Os arquivos em `dados/` são simulações de formato**, não retornos oficiais do TSE.
   Cada um traz um campo `_aviso` dizendo isso.
5. As fotos foram fornecidas para uso neste trabalho escolar.

Fontes oficiais: [divulgacandcontas.tse.jus.br](https://divulgacandcontas.tse.jus.br) ·
[dadosabertos.tse.jus.br](https://dadosabertos.tse.jus.br)

---

## Tecnologias

HTML5 semântico · CSS puro com transforms 3D · JavaScript sem framework ·
`DOMParser` · `fetch` + `async/await` · `Blob` + CSV com BOM · Canvas 2D ·
`IntersectionObserver` · `prefers-reduced-motion`

Sem build, sem dependências, sem backend.
