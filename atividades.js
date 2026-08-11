/* ============================================================
   ACERVO CK — base de dados das atividades
   ============================================================

   Este é o ÚNICO arquivo que precisa ser editado para publicar
   uma nova atividade no arquivo. Copie o modelo abaixo, cole no
   começo da lista (a mais recente fica em primeiro lugar) e
   pronto: cartão, filtros, contadores e carrossel 3D se
   atualizam sozinhos.

   ------------------------------------------------------------
   MODELO
   ------------------------------------------------------------
   {
     id:         "slug-sem-acento",        // usado na URL (#acervo) e como chave
     titulo:     "Nome da atividade",
     subtitulo:  "Linha de apoio curta",
     disciplina: "Educação Física",        // vira um filtro automaticamente
     sigla:      "EF",                     // 2–3 letras, aparece no selo do cartão
     tipo:       "Apresentação de slides",
     data:       "2026-08-18",             // AAAA-MM-DD — ordena e formata sozinho
     turma:      "2º C — M-Tec Informática para Internet",
     resumo:     "Um parágrafo curto sobre a entrega.",
     destaques:  ["12 slides", "6 integrantes"],
     tags:       ["Seminário", "HTML"],
     cor:        "#E50914",                // cor de acento própria da atividade
     href:       "atividades/slug/arquivo.html",
     status:     "pronta"                  // "pronta" | "andamento" | "apresentada"
   }
   ============================================================ */

window.ACERVO_CK = [

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
    status: "pronta"
  }

];
