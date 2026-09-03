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
│   ├── cubo.js                 o cubo de dados arrastável
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

## O cubo de dados

Na seção do XML há um cubo 3D **arrastável**: cada uma das seis faces é uma
etapa do caminho que a informação percorre na atividade.

| Face | Etapa |
| --- | --- |
| XML | o texto guardado em `xmlTexto` |
| DOMParser | o texto virando árvore navegável |
| JSON | o recorte no formato do TSE |
| fetch | a busca assíncrona do recorte |
| CSV | a exportação que o Excel abre direto |
| CK | a marca do grupo, autoria do projeto |

Ele gira sozinho, mas dá para agarrar com o mouse ou com o dedo e girar — ao
soltar, a inércia continua e o giro automático volta. Também responde às setas
do teclado, para quem não usa mouse, e a legenda abaixo narra qual face está
virada para a frente. Com `prefers-reduced-motion` ele para numa pose que mostra
três faces de uma vez.

No rodapé há ainda a **placa de assinatura** do grupo, em relevo, com a logo
remasterizada da CK, a identificação da turma e o link de volta para o acervo.

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

| Cargo | Nome de urna | Nome completo | Partido | Nº | Propostas |
| --- | --- | --- | --- | ---: | ---: |
| Presidente | Lula | Luiz Inácio Lula da Silva | PT | 13 | 6 |
| Presidente | Flávio Bolsonaro | Flávio Nantes Bolsonaro | PL | 22 | 7 |
| Presidente | Ronaldo Caiado | Ronaldo Ramos Caiado | PSD | 55 | 7 |
| Governador | Tarcísio de Freitas | Tarcísio Gomes de Freitas | Republicanos | 10 | 7 |
| Governador | Fernando Haddad | Fernando Haddad | PT | 13 | 8 |
| Governador | Vera | Vera Lúcia Pereira da Silva Salgado | PSTU | 16 | 7 |
| Senador | Derrite | Guilherme Muraro Derrite | PP | 111 | 6 |
| Senador | Marina Silva | Maria Osmarina Marina Silva Vaz de Lima | REDE | 180 | 7 |
| Senador | Simone Tebet | Simone Nassar Tebet | PSB | 400 | 7 |
| Dep. Federal | Guilherme Boulos | Guilherme Castro Boulos | PSOL | 5010 | 7 |
| Dep. Federal | Tabata Amaral | Tabata Claudia Amaral de Pontes | PSB | 4040 | 7 |
| Dep. Federal | Major Mecca | Dimas Mecca Sampaio | PL | 2288 | 7 |
| Dep. Estadual | Bruna Furlan | Bruna Dias Furlan Vicente | Republicanos | 10010 | 6 |
| Dep. Estadual | Professor Carlos Giannazi | Carlos Giannazi | PSOL | 50789 | 7 |
| Dep. Estadual | Caio Aoqui | Caio Kanji Pardo Aoqui | PSD | 55300 | 1 ⚠️ |

**97 propostas no total.** Todas as candidaturas constam como **Deferido**.

### Regra de dígitos do número de urna

| Cargo | Dígitos | Confere? |
| --- | ---: | --- |
| Presidente e Governador | 2 (o número do partido) | ✅ 6 de 6 |
| Senador | 3 | ✅ 3 de 3 |
| Deputado Federal | 4 | ✅ 3 de 3 |
| Deputado Estadual | 5 | ✅ 3 de 3 |

Todos os números começam pelo número do partido, como manda a regra do TSE.

⚠️ **Caio Aoqui** entrou com a ficha de candidatura completa, mas as pautas ainda
não foram levantadas pelo grupo. O XML o marca com `conferir="pautas"` e o card
mostra o selo **a catalogar** — preencha antes de apresentar.

### Correções da auditoria de 11/09

| Candidato | Antes | Depois |
| --- | --- | --- |
| Guilherme Boulos | nº 5050 | nº **5010** |
| Major Mecca | Dep. **Estadual**, nº 22288 | Dep. **Federal**, nº **2288** |
| Bruna Furlan | PSDB, nome curto | **Republicanos**, Bruna Dias Furlan Vicente |
| Nikolas Ferreira | Dep. Federal por SP | **removido** — concorre por Minas Gerais |
| Caio Aoqui | — | **incluído** como 3º Dep. Estadual (PSD, 55300) |

A foto do Nikolas Ferreira saiu de `assets/candidatos/`, já que ele não faz mais
parte do recorte paulista.

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
3. **As pautas de Caio Aoqui ainda não foram levantadas.** Ele está marcado com
   `conferir="pautas"` no XML e o card mostra o selo **a catalogar**. Todos os
   números de urna foram auditados e conferem com a regra de dígitos do TSE.
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
