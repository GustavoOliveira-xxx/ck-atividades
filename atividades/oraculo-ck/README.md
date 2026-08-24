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

1. Abra <https://aistudio.google.com/app/apikey> e entre com uma conta Google
   (na primeira vez, aceite os termos de uso).
2. Clique em **Create API key** → **Create API key in new project**.
3. Copie a chave — começa com `AIza`, ~39 caracteres.
4. Com a aplicação aberta, clique no selo no canto superior direito
   (*Sem chave* / *Modo demo*).
5. Cole a chave e clique em **Salvar e testar**.

> **O tropeço mais comum:** contas de menores de idade e contas escolares
> (Google Workspace for Education) têm o AI Studio bloqueado — o botão de
> criar chave simplesmente não aparece. Use uma conta Google pessoal de
> alguém com 18 anos ou mais. Não há como contornar isso pela aplicação.

A chave é como uma senha: não publique no GitHub, não mostre em slide. Se
vazar, apague no AI Studio e crie outra — a antiga para de funcionar na hora.

Ao salvar, a aplicação pergunta à própria API quais modelos existem naquele
momento, preenche o seletor com os reais e escolhe o melhor. Você não precisa
saber nome de modelo nenhum.

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
| `api.js` | `fetch` com `async/await`, tempo limite, cancelamento, descoberta de modelos e erros |
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

Um `404` nem chega ao usuário: a aplicação tenta os outros modelos da fila e,
se todos falharem, **redescobre o catálogo real na API** e tenta o melhor
modelo novo — dentro da mesma consulta.

A fila avança quando a falha é **do modelo** (404 aposentado, 429 cota daquele
modelo, 500/503 sobrecarga) e para imediatamente quando é **da chave**
(400/401/403), porque aí trocar de modelo não resolveria. Há um teto de 45 s
para a fila inteira.

### Por que isso existe

Nomes de modelo têm prazo de validade — e não é teoria. Quando testamos com
uma chave válida, os três modelos da nossa lista original já retornavam 404:

```
gemini-2.5-flash       404  "no longer available to new users"
gemini-2.5-flash-lite  404  "no longer available to new users"
gemini-2.0-flash       404  não existe mais
```

Sem a descoberta automática, o app teria falhado por completo no dia da
apresentação, sem ninguém ter mexido em nada. A lista em `config.js` é só uma
semente: quem manda é o catálogo que a própria API devolve.

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

## Detalhe de configuração: `maxOutputTokens`

Está em **3000**, e não é arbitrário. Os modelos Gemini 3.x geram tokens
internos de raciocínio antes de escrever, e eles contam no mesmo teto. Medimos:
o raciocínio sozinho consome de **830 a 1070 tokens**. Com o teto em 1100, a
resposta saía cortada no meio (`MAX_TOKENS`), sem o conselho final.

Desligar o raciocínio com `thinkingConfig: { thinkingBudget: 0 }` não serve:
o `gemini-3.6-flash` recusa esse campo com HTTP 400. Como o modelo é escolhido
dinamicamente, aumentar o teto é a solução que funciona em todos.

---

## Aviso

O conteúdo das respostas é gerado por Inteligência Artificial e pode conter
imprecisões — o meta dos jogos muda a cada temporada. Confira antes de usar.
