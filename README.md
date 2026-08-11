# Acervo CK — Arquivo de Atividades

Arquivo público das atividades escolares feitas em HTML pelo **Grupo CK — Conscious
Knowledge** (2º C · M-Tec Informática para Internet · ETEC Taboão da Serra).

Cada atividade entra como uma **página autossuficiente** — com as imagens embutidas,
funcionando offline — e ganha um cartão na página inicial que leva direto para ela.

- **Site:** https://gustavooliveira-xxx.github.io/ck-atividades/
- **Site institucional da CK:** https://gustavooliveira-xxx.github.io/ck-group/

---

## Estrutura

```
ck-atividades/
├── index.html            página do acervo (hub)
├── style.css             estilos do hub
├── script.js             comportamento do hub
├── atividades.js         ← a LISTA de atividades (o único arquivo a editar)
├── assets/
│   └── logo-ck.png       logotipo da Conscious Knowledge
└── atividades/
    └── mma/
        └── apresentacao-mma.html    Educação Física · 18.08.2026
```

---

## Como adicionar uma atividade nova

### 1. Coloque a página da atividade em `atividades/`

Crie uma pasta com o nome curto da atividade e jogue o HTML dentro:

```
atividades/nome-da-atividade/pagina.html
```

Se a apresentação tiver as imagens embutidas (base64), **um arquivo só basta** — não
precisa subir a pasta `assets` da atividade.

### 2. Acrescente a ficha em `atividades.js`

Abra `atividades.js` e cole um objeto novo **no começo da lista** (a mais recente fica
em primeiro lugar):

```js
{
  id:         "nome-da-atividade",
  titulo:     "Nome da atividade",
  subtitulo:  "Linha de apoio curta",
  disciplina: "História",                 // vira um filtro automaticamente
  sigla:      "HI",                       // 2–3 letras, aparece no selo
  tipo:       "Apresentação de slides",
  data:       "2026-09-14",               // AAAA-MM-DD
  turma:      "2º C — M-Tec Informática para Internet",
  resumo:     "Um parágrafo curto sobre a entrega.",
  destaques:  ["10 slides", "4 integrantes"],
  tags:       ["Seminário", "HTML"],
  cor:        "#3B82F6",                  // cor de acento própria da atividade
  href:       "atividades/nome-da-atividade/pagina.html",
  status:     "pronta"                    // "pronta" | "andamento" | "apresentada"
}
```

### 3. Pronto

Não há build, nem dependência, nem passo de publicação. Ao salvar, a página inicial
já reflete a mudança sozinha:

- o **cartão** aparece na grade do acervo;
- o **filtro** da disciplina é criado (ou tem a contagem atualizada);
- os **contadores** do topo e a **data da última entrega** se ajustam;
- o **ticker** e a **vitrine 3D** passam a incluir a atividade;
- a **busca** já encontra pelo título, tema, tipo ou tag.

---

## O que tem na página

| Recurso | O que faz |
| --- | --- |
| **Abertura** | Tela de carregamento com anel de progresso; ao terminar, o arquivo "se abre" em duas folhas. |
| **Fundo em campo de fluxo** | Partículas em `<canvas>` que seguem os ângulos de um campo de ruído e deixam rastro; o ponteiro empurra o fluxo. |
| **Marca 3D** | O logotipo é extrudado em 14 camadas empilhadas no eixo Z, com anéis e satélites em órbita, reagindo ao ponteiro. |
| **Vitrine 3D** | Carrossel cilíndrico de fichas que gira sozinho, aceita arrasto e encaixa na ficha mais próxima. Guarda sempre um espaço vago para a próxima atividade. |
| **Acervo** | Grade de cartões com tilt 3D, filtro por disciplina e busca que ignora acento. |

Cada atividade define a **própria cor de acento**, e o cartão, o selo e a ficha da
vitrine se pintam com ela (o MMA usa o vermelho do tema UFC/Netflix da apresentação).

---

## Acessibilidade e desempenho

- `prefers-reduced-motion` desliga o campo de fluxo, o giro da vitrine e as animações.
- Navegação por teclado, foco visível e marcação semântica.
- Sem framework, sem build, sem dependência externa além das fontes do Google Fonts.
- A aba em segundo plano pausa a animação do fundo.
- Há um `<noscript>` com os links das atividades, para o caso de o JavaScript estar
  desligado.

---

## Créditos

Projeto do **Grupo CK — Conscious Knowledge**, idealizado por Gustavo Oliveira dos Santos.
ETEC Taboão da Serra — 2026.
