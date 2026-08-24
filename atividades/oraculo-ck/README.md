# Oráculo CK — Assistente de Jogos Mobile

Interface web **100% client-side** que consulta uma **API de IA generativa** para
devolver dicas, builds e estratégias de jogos mobile.

Projeto de **Interface Web II** — 2º C, M-Tec em Informática para Internet,
ETEC Taboão da Serra. Grupo **CK — Conscious Knowledge**.

> HTML, CSS e JavaScript puro. Sem backend, sem banco de dados, sem framework,
> sem etapa de build. O que está aqui é exatamente o que roda no navegador.

---

## O que tem nesta pasta

| Arquivo | O que é |
| --- | --- |
| `index.html` | A aplicação |
| `apresentacao-oraculo-ck.html` | Apresentação de 14 slides (arquivo único, funciona offline) |
| `documentacao-oraculo-ck.docx` | Documentação técnica completa |
| `css/` | `base` · `layout` · `componentes` · `animacoes` |
| `js/` | `config` · `armazenamento` · `prompt` · `api` · `cena` · `ui` · `app` |
| `assets/` | Logo da Conscious Knowledge |

---

## Como rodar

### Opção A — abrir direto

Duplo clique em `index.html`. É só isso.

Funciona porque o projeto usa scripts clássicos com `defer` em vez de módulos ES6 —
`import`/`export` seriam bloqueados por CORS no protocolo `file://`.

### Opção B — servidor local

```bash
python3 -m http.server 5500      # ou:  npx serve .
# depois abra http://localhost:5500
```

---

## Onde colocar a chave da API

A aplicação usa a **Google Gemini API** (Generative Language API).

1. Pegue uma chave gratuita em <https://aistudio.google.com/app/apikey>.
2. Com a aplicação aberta, clique no selo no canto superior direito
   (*Sem chave* / *Modo demo*).
3. Cole a chave e clique em **Salvar e testar**.

A chave fica **apenas no `localStorage` daquele navegador**, sob a chave
`oraculo-ck:chave`, e vai para a API no cabeçalho `x-goog-api-key` — nunca na URL.
O botão **Apagar chave** remove-a a qualquer momento.

Para fixar a chave no código (só em cópia local, nunca no repositório), edite
`CHAVE_EMBUTIDA` em [`js/config.js`](js/config.js).

### Modo demonstração

Sem chave, a aplicação continua funcionando com respostas locais de exemplo,
sempre identificadas como demonstração. É o plano B para apresentar sem internet
ou em rede que bloqueie a API.

---

## Arquitetura

```
Usuário ──submit──► Frontend ──HTTPS POST──► API de IA
   ▲                (navegador)                  │
   └──────── painel ◄── parser ◄── JSON ─────────┘
```

| Módulo | Responsabilidade |
| --- | --- |
| `config.js` | Endpoint, modelos e catálogo (jogos, conselhos, níveis) |
| `armazenamento.js` | Camada sobre o `localStorage` (chave, modelo, histórico) |
| `prompt.js` | Valida os campos e monta a instrução de sistema + o prompt |
| `api.js` | `fetch` com `async/await`, tempo limite, cancelamento e erros |
| `cena.js` | Fundo animado em `<canvas>` |
| `ui.js` | Monta os controles, formata a resposta e troca os estados |
| `app.js` | Orquestra: liga a interface à camada de rede |

A regra: `ui.js` não sabe o que é uma API, `api.js` não sabe o que é um botão,
e `app.js` é o único que conhece os dois. Trocar o Gemini por outra API mexeria
em um arquivo só.

---

## Tratamento de erros

Nenhuma falha chega crua na tela. Cada uma vira um objeto com código, título,
explicação e dica de ação, em português:

`SEM_CHAVE` · `HTTP 400` · `HTTP 401` · `HTTP 403` · `HTTP 404` · `HTTP 429` ·
`HTTP 5xx` · `TEMPO_ESGOTADO` · `SEM_CONEXAO` · `BLOQUEADO_*` ·
`RESPOSTA_FILTRADA` · `CANCELADO`

Um `404` nem chega ao usuário: a fila de modelos em `config.js` tenta o próximo
automaticamente.

---

## Equipe

| Integrante | Frente |
| --- | --- |
| Gustavo Oliveira dos Santos | Líder · integração com a API |
| Éric Estrela Vieira | Interface e componentes |
| Gabriel Heanna dos Reis | Estilos e responsividade |
| Paulo Henrique de Lima Silva | Engenharia de prompt |
| Pedro Alcantara dos Santos Fialho | Erros e testes |
| Thiago Wilson Vieira Serbino | Documentação e apresentação |

O domínio do projeto é coletivo: todos sabem explicar qualquer parte do código.

---

## Aviso

O conteúdo das respostas é gerado por Inteligência Artificial e pode conter
imprecisões — o meta dos jogos muda a cada temporada. Confira antes de usar.
