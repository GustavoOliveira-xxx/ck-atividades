/* ============================================================================
   ACERVO CK — catálogo de atividades
   ----------------------------------------------------------------------------
   Para publicar uma atividade nova, acrescente um objeto a esta lista.
   Cartões, filtros, contadores, ticker e vitrine 3D leem daqui.

   Campos:
     id         identificador curto e único
     titulo     nome da atividade
     subtitulo  linha de apoio (opcional)
     disciplina matéria — vira um filtro automaticamente
     sigla      2 a 3 letras exibidas no selo do cartão
     tipo       formato da entrega
     data       AAAA-MM-DD
     turma      turma e curso
     resumo     parágrafo curto de descrição
     destaques  lista de números/fatos (opcional)
     tags       palavras-chave usadas na busca (opcional)
     cor        cor de acento do cartão (hex)
     href       link principal — é o que a vitrine 3D abre
     recursos   lista de arquivos da atividade (opcional). Cada item:
                  { rotulo, href, tipo, icone, baixar }
                  icone: "app" | "slides" | "doc" | "codigo" | "link"
                  baixar: true força download em vez de abrir
     status     "pronta" | "andamento" | "apresentada"
   ========================================================================== */

window.ACERVO_CK = [
  {
    id: "oraculo-ck",
    titulo: "Oráculo CK",
    subtitulo: "Assistente de Jogos Mobile com IA",
    disciplina: "Interface Web II",
    sigla: "IW",
    tipo: "Aplicação web + apresentação",
    data: "2026-09-18",
    turma: "2º C — M-Tec Informática para Internet",
    resumo:
      "Interface web 100% client-side que conversa com uma API de IA generativa " +
      "direto do navegador. O usuário escolhe o jogo, o tipo de conselho e o nível, " +
      "faz a pergunta e recebe a resposta formatada — com estado de carregamento, " +
      "dez tipos de erro tratados em português e layout responsivo. " +
      "HTML, CSS e JavaScript puro: sem backend, sem banco de dados e sem framework.",
    destaques: [
      "11 arquivos separados",
      "fetch + async/await",
      "9 jogos · 6 conselhos",
      "Modo demonstração offline",
    ],
    tags: ["Projeto", "IA", "API", "JavaScript", "Gemini", "Responsivo", "Jogos mobile"],
    cor: "#35ffa0",
    href: "atividades/oraculo-ck/index.html",
    recursos: [
      {
        rotulo: "Abrir aplicação",
        href: "atividades/oraculo-ck/index.html",
        tipo: "Interface web",
        icone: "app",
      },
      {
        rotulo: "Apresentação",
        href: "atividades/oraculo-ck/apresentacao-oraculo-ck.html",
        tipo: "14 slides",
        icone: "slides",
      },
      {
        rotulo: "Documento Word",
        href: "atividades/oraculo-ck/documentacao-oraculo-ck.docx",
        tipo: "Documentação técnica",
        icone: "doc",
        baixar: true,
      },
    ],
    status: "pronta",
  },
  {
    id: "mma",
    titulo: "MMA — Mixed Martial Arts",
    subtitulo: "Seminário sobre Lutas",
    disciplina: "Educação Física",
    sigla: "EF",
    tipo: "Apresentação de slides",
    data: "2026-08-18",
    turma: "2º C — M-Tec Informática para Internet",
    resumo:
      "Seminário completo sobre artes marciais mistas: da origem no Pankration " +
      "(648 a.C.) e do Vale-Tudo brasileiro até o UFC 1, as Regras Unificadas, " +
      "o sistema de pontuação 10-9 e a importância cultural do esporte.",
    destaques: ["12 slides", "6 integrantes", "Funciona offline"],
    tags: ["Seminário", "Lutas", "UFC", "HTML"],
    cor: "#E50914",
    href: "atividades/mma/apresentacao-mma.html",
    recursos: [
      {
        rotulo: "Abrir apresentação",
        href: "atividades/mma/apresentacao-mma.html",
        tipo: "12 slides",
        icone: "slides",
      },
    ],
    status: "apresentada",
  },
];
