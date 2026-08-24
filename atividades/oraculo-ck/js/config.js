/* ============================================================================
   ORÁCULO CK — config.js
   Ponto único de configuração: endpoint da API, modelos, catálogo de jogos,
   tipos de conselho, níveis e dados da equipe.

   >>> A CHAVE DA API NÃO FICA AQUI. <<<
   Ela é digitada pelo usuário no diálogo "Chave da API" e guardada apenas no
   localStorage do próprio navegador (ver js/armazenamento.js). Se você preferir
   deixar uma chave fixa para a apresentação, escreva-a em CHAVE_EMBUTIDA logo
   abaixo — mas lembre: qualquer pessoa que abrir o código-fonte da página vai
   enxergá-la, porque a aplicação é 100% client-side.
   ========================================================================== */

window.CK = window.CK || {};

CK.config = (() => {
  "use strict";

  /* ---------- API ---------- */

  // Deixe "" para exigir que o usuário informe a chave pelo diálogo.
  const CHAVE_EMBUTIDA = "";

  const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

  // Ordem de tentativa: se o primeiro modelo não existir mais (HTTP 404),
  // o cliente tenta o próximo automaticamente.
  const MODELOS = [
    { id: "gemini-2.5-flash", rotulo: "Gemini 2.5 Flash — equilibrado" },
    { id: "gemini-2.5-flash-lite", rotulo: "Gemini 2.5 Flash Lite — mais rápido" },
    { id: "gemini-2.0-flash", rotulo: "Gemini 2.0 Flash — alternativa" },
  ];

  const MODELO_PADRAO = MODELOS[0].id;

  const GERACAO = {
    temperature: 0.85,
    topP: 0.95,
    maxOutputTokens: 1100,
  };

  const TEMPO_LIMITE = 30000; // ms — corta a requisição com AbortController

  /* ---------- catálogo de jogos ---------- */

  const JOGOS = [
    { id: "free-fire", nome: "Free Fire", genero: "Battle Royale", h: 78, icone: "mira" },
    { id: "brawl-stars", nome: "Brawl Stars", genero: "Arena 3v3", h: 96, icone: "estrela" },
    { id: "cod-mobile", nome: "CoD: Mobile", genero: "FPS", h: 112, icone: "mira" },
    { id: "clash-of-clans", nome: "Clash of Clans", genero: "Estratégia", h: 128, icone: "escudo" },
    { id: "mobile-legends", nome: "Mobile Legends", genero: "MOBA", h: 148, icone: "espadas" },
    { id: "clash-royale", nome: "Clash Royale", genero: "Cartas + Arena", h: 162, icone: "cartas" },
    { id: "pubg-mobile", nome: "PUBG Mobile", genero: "Battle Royale", h: 172, icone: "mira" },
    { id: "genshin", nome: "Genshin Impact", genero: "RPG de mundo aberto", h: 184, icone: "elemento" },
    { id: "outro", nome: "Outro jogo", genero: "Você escolhe", h: 88, icone: "mais" },
  ];

  /* ---------- tipos de conselho ---------- */

  const TIPOS = [
    {
      id: "iniciante",
      rotulo: "Primeiros passos",
      icone: "bussola",
      foco: "o que fazer nas primeiras horas de jogo, erros comuns de quem começa e a ordem de prioridade para evoluir",
    },
    {
      id: "meta",
      rotulo: "Meta e builds",
      icone: "grafico",
      foco: "personagens, cartas, armas ou itens fortes no momento, e como montar uma build coerente",
    },
    {
      id: "estrategia",
      rotulo: "Estratégia de partida",
      icone: "mapa",
      foco: "posicionamento, rotação, leitura de mapa e tomada de decisão durante a partida",
    },
    {
      id: "counter",
      rotulo: "Como counterar",
      icone: "escudo",
      foco: "como responder a uma composição, carta ou personagem específico que está dando trabalho",
    },
    {
      id: "recursos",
      rotulo: "Economia de recursos",
      icone: "moeda",
      foco: "onde gastar moedas, gemas, energia e tempo sem desperdício, e o que evitar comprar",
    },
    {
      id: "config",
      rotulo: "Ajustes e sensibilidade",
      icone: "engrenagem",
      foco: "configurações de HUD, sensibilidade, gráficos e controles para ganhar consistência",
    },
  ];

  /* ---------- níveis ---------- */

  const NIVEIS = [
    { id: "iniciante", rotulo: "Iniciante", descricao: "está começando agora" },
    { id: "intermediario", rotulo: "Intermediário", descricao: "já joga com regularidade" },
    { id: "avancado", rotulo: "Avançado", descricao: "disputa ranqueadas de elo alto" },
  ];

  /* ---------- sugestões rápidas por tipo ---------- */

  const SUGESTOES = {
    iniciante: [
      "Por onde eu começo?",
      "Quais erros devo evitar nas primeiras partidas?",
      "O que priorizar na primeira semana?",
    ],
    meta: [
      "Qual a build mais forte agora?",
      "O que está dominando o meta?",
      "Vale a pena investir neste personagem?",
    ],
    estrategia: [
      "Como melhorar meu posicionamento?",
      "Qual a melhor rotação no mapa?",
      "Como fechar uma partida que estou ganhando?",
    ],
    counter: [
      "Como counterar quem joga muito agressivo?",
      "O que uso contra a composição mais popular?",
      "Estou perdendo sempre para o mesmo tipo de jogador — o que fazer?",
    ],
    recursos: [
      "Onde gasto minhas gemas primeiro?",
      "Vale a pena o passe de temporada?",
      "Como evoluir sem gastar dinheiro?",
    ],
    config: [
      "Qual sensibilidade devo usar?",
      "Como configurar o HUD para melhorar minha mira?",
      "Que ajustes reduzem travamento em celular fraco?",
    ],
  };

  /* ---------- equipe ---------- */

  const EQUIPE = [
    { nome: "Gustavo Oliveira dos Santos", papel: "Líder · integração com a API", lider: true },
    { nome: "Éric Estrela Vieira", papel: "Interface e componentes" },
    { nome: "Gabriel Heanna dos Reis", papel: "Estilos e responsividade" },
    { nome: "Paulo Henrique de Lima Silva", papel: "Engenharia de prompt" },
    { nome: "Pedro Alcantara dos Santos Fialho", papel: "Tratamento de erros e testes" },
    { nome: "Thiago Wilson Vieira Serbino", papel: "Documentação e apresentação" },
  ];

  /* ---------- frases do ticker ---------- */

  const TICKER = [
    "Oráculo CK",
    "Interface Web II · Projeto de IA",
    "HTML5 · CSS3 · JavaScript puro",
    "fetch + async/await",
    "Sem backend · sem banco de dados",
    "Grupo CK — Conscious Knowledge",
    "2º C · M-Tec Informática para Internet",
    "ETEC Taboão da Serra",
  ];

  /* ---------- mensagens do carregamento ---------- */

  const PASSOS_CARGA = [
    "montando o prompt",
    "abrindo o grimório",
    "enviando a requisição",
    "o modelo está pensando",
    "recebendo o pergaminho",
    "formatando a resposta",
  ];

  return {
    CHAVE_EMBUTIDA,
    BASE,
    MODELOS,
    MODELO_PADRAO,
    GERACAO,
    TEMPO_LIMITE,
    JOGOS,
    TIPOS,
    NIVEIS,
    SUGESTOES,
    EQUIPE,
    TICKER,
    PASSOS_CARGA,
  };
})();
