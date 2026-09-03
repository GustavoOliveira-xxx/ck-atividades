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

| Cargo | Candidato | Partido | Nº | Propostas |
| --- | --- | --- | ---: | ---: |
| Presidente | Luiz Inácio Lula da Silva | PT | 13 | 6 |
| Presidente | Flávio Bolsonaro | PL | 22 | 7 |
| Presidente | Ronaldo Caiado | PSD | 55 | 7 |
| Governador | Tarcísio de Freitas | Republicanos | 10 | 7 |
| Governador | Fernando Haddad | PT | 13 | 8 |
| Governador | Vera Lúcia | PSTU | 16 | 7 |
| Senador | Guilherme Derrite | PP | 111 | 6 |
| Senador | Marina Silva | REDE | 180 | 7 |
| Senador | Simone Tebet | PSB | 400 | 7 |
| Dep. Federal | Guilherme Boulos | PSOL | 5050 ⚠️ | 7 |
| Dep. Federal | Tabata Amaral | PSB | 4040 | 7 |
| Dep. Federal | Nikolas Ferreira | PL | 2222 | 7 |
| Dep. Estadual | Bruna Furlan | Republicanos | 10010 | 6 |
| Dep. Estadual | Major Mecca | PL | 22288 ⚠️ | 7 |
| Dep. Estadual | Carlos Giannazi | PSOL | 50789 | 7 |

**103 propostas no total.** Os números seguem a regra do TSE: majoritário usa o
número do partido, senador tem 3 dígitos, deputado federal 4 e deputado estadual 5,
todos começando pelo número do partido.

⚠️ Os dois marcados carregam `conferir="numero"` no XML e aparecem na interface com
um selo **a conferir**: o número de Boulos não constava na fonte usada e o de Major
Mecca veio com 4 dígitos, o que não fecha com a regra de 5 do cargo estadual.
Confirme os dois no DivulgaCandContas antes de apresentar.

---

## Programa de governo × pauta parlamentar

A atividade trata os dois casos de forma diferente, de propósito:

| | Executivo (Presidente, Governador) | Legislativo (Senador, deputados) |
| --- | --- | --- |
| Existe plano de governo registrado? | Sim, no DivulgaCandContas | Não |
| Atributo no XML | `<propostas tipo="programa">` | `<propostas tipo="pautas">` |
| Rótulo no card | **Propostas de campanha** | **Pautas e atuação** |
| Nota no card | "Resumo do programa de governo e de declarações públicas de campanha." | "Pautas e posições públicas do parlamentar — não é programa de governo." |
| Coluna *Tipo* no CSV | `Programa de governo` | `Pautas parlamentares` |

Parlamentar não registra plano de governo. Apresentar a pauta de um deputado como se
fosse promessa de campanha seria impreciso, então a interface nomeia cada coisa pelo
que ela é.

---

## Avisos

1. **Trabalho escolar.** Nenhum vínculo com a Justiça Eleitoral, com partidos ou com
   campanhas. Nada aqui é recomendação de voto: os textos descrevem posições, não as
   endossam nem as comparam.
2. **As propostas são resumos editoriais escritos pelo grupo.** Não são transcrição
   literal de documento oficial. Para Presidente e Governador, o resumo parte do programa
   de governo registrado e de declarações públicas de campanha; para Senador e deputados,
   parte de pautas, projetos e posições públicas — ver a seção acima.
3. **Dois números de urna ainda precisam de conferência** (Guilherme Boulos e Major Mecca).
   Estão marcados no XML e sinalizados na interface.
4. **Os arquivos em `dados/` são simulações de formato**, não retornos oficiais do TSE.
   Cada um traz um campo `_aviso` dizendo isso.
5. As fotos foram fornecidas para uso neste trabalho escolar.

**Antes de entregar**, confira nome de urna, partido, número e propostas de cada candidato
no [DivulgaCandContas](https://divulgacandcontas.tse.jus.br) — o portal publica tanto o
registro das candidaturas quanto os arquivos de proposta de governo.

Fontes oficiais: [divulgacandcontas.tse.jus.br](https://divulgacandcontas.tse.jus.br) ·
[dadosabertos.tse.jus.br](https://dadosabertos.tse.jus.br)

---

## Tecnologias

HTML5 semântico · CSS puro com transforms 3D · JavaScript sem framework ·
`DOMParser` · `fetch` + `async/await` · `Blob` + CSV com BOM · Canvas 2D ·
`IntersectionObserver` · `prefers-reduced-motion`

Sem build, sem dependências, sem backend.
