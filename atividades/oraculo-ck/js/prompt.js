/* ============================================================================
   ORÁCULO CK — prompt.js
   Transforma as escolhas do usuário (jogo, tipo de conselho, nível e pergunta)
   no texto que será enviado ao modelo de IA.

   Manter isso separado da camada de rede é de propósito: dá para ajustar a
   "personalidade" e o formato da resposta sem tocar em uma linha de fetch.
   ========================================================================== */

window.CK = window.CK || {};

CK.prompt = (() => {
  "use strict";

  /* ------------------------------------------------------------------------
     Instrução de sistema — define quem o modelo é e como deve responder.
     ---------------------------------------------------------------------- */
  const montarInstrucao = () => [
    "Você é o Oráculo CK, assistente de jogos mobile do grupo Conscious Knowledge.",
    "Responda SEMPRE em português do Brasil, com tom direto, prático e amigável.",
    "",
    "Formato obrigatório da resposta:",
    "1. Um parágrafo curto de resumo (no máximo 2 frases).",
    "2. De 2 a 4 blocos, cada um começando com '## ' e um título curto.",
    "3. Dentro de cada bloco, de 2 a 4 itens em lista começando com '- '.",
    "4. Uma última linha começando com '> ' contendo o conselho principal.",
    "",
    "Regras:",
    "- Nada de introduções do tipo 'claro!' ou 'com certeza!'; comece pelo conteúdo.",
    "- Seja específico: cite nomes, números e situações do jogo sempre que possível.",
    "- Se o meta pode ter mudado, diga isso em uma frase curta em vez de inventar.",
    "- Nunca sugira trapaça, script, hack, conta pirata ou qualquer burla dos termos de uso.",
    "- Não recomende gastar dinheiro real como primeira solução.",
    "- Limite a resposta a mais ou menos 300 palavras.",
  ].join("\n");

  /* ------------------------------------------------------------------------
     Prompt do usuário — junta o contexto escolhido na interface à pergunta.
     ---------------------------------------------------------------------- */
  const montarPergunta = ({ jogo, tipo, nivel, pergunta }) => {
    const { rotulo: rotuloTipo, foco } = tipo;
    const { rotulo: rotuloNivel, descricao } = nivel;

    return [
      `Jogo: ${jogo}`,
      `Tipo de conselho: ${rotuloTipo} — foque em ${foco}.`,
      `Nível do jogador: ${rotuloNivel} (${descricao}).`,
      "",
      `Pergunta: ${pergunta}`,
    ].join("\n");
  };

  /* ------------------------------------------------------------------------
     Resumo legível da consulta — usado no histórico e no painel de resposta.
     ---------------------------------------------------------------------- */
  const descrever = ({ jogo, tipo, nivel }) =>
    `${jogo} · ${tipo.rotulo} · ${nivel.rotulo}`;

  /* ------------------------------------------------------------------------
     Validação dos campos antes de gastar uma requisição.
     ---------------------------------------------------------------------- */
  const validar = ({ jogo, pergunta }) => {
    if (!jogo) {
      return { valido: false, motivo: "Escolha um jogo antes de consultar." };
    }

    const texto = String(pergunta || "").trim();

    if (texto.length < 6) {
      return { valido: false, motivo: "Escreva uma pergunta com pelo menos 6 caracteres." };
    }

    return { valido: true, motivo: "" };
  };

  return { montarInstrucao, montarPergunta, descrever, validar };
})();
