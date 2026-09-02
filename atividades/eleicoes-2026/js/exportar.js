/* ============================================================================
   CK ELEIÇÕES 2026 — PARTE 1.1 · EXPORTAÇÃO (Blob + URL.createObjectURL)
   ----------------------------------------------------------------------------
   Mesmo recurso do código-base: o navegador gera o arquivo "na hora", sem
   nenhum servidor por trás. Muda o conteúdo — em vez de piadas, o mapa
   eleitoral de São Paulo.

   Passo 1.3 da atividade, cumprido aqui:
     · o BOM "﻿" continua no começo do CSV (acentos corretos no Excel);
     · o cabeçalho virou "Cargo;Poder;Descrição";
     · a limpeza de dados com replace(/;/g, ",") continua valendo — sem ela,
       um ponto e vírgula dentro da descrição quebraria a coluna no Excel.
   ========================================================================== */

(() => {
  "use strict";

  const { xmlTexto } = window.CK_XML;
  const { cargosData, candidatosData, helpers } = window.CK_ELEICOES;
  const { $ } = helpers;

  /* --------------------------------------------------------------------------
     Função genérica: recebe um conteúdo de texto e "baixa" como arquivo.
     -------------------------------------------------------------------- */
  function baixarArquivo(conteudo, nomeArquivo, tipoMime) {
    /* Cria um Blob (um "arquivo" em memória) com o conteúdo e o tipo informados */
    const blob = new Blob([conteudo], { type: tipoMime });

    /* Cria uma URL temporária apontando para esse Blob */
    const url = URL.createObjectURL(blob);

    /* Cria um link invisível, "clica" nele para iniciar o download e remove */
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* Libera a URL temporária da memória */
    URL.revokeObjectURL(url);
  }

  /* --------------------------------------------------------------------------
     Limpeza de dados para CSV.
     Troca ";" por "," e remove quebras de linha, para não bagunçar as colunas.
     -------------------------------------------------------------------- */
  const limpar = (texto) => String(texto ?? "")
    .replace(/;/g, ",")
    .replace(/\r?\n/g, " ")
    .trim();

  /* --------------------------------------------------------------------------
     Botão 1 — baixa o XML original, exatamente como está na variável xmlTexto
     -------------------------------------------------------------------- */
  function exportarXML() {
    baixarArquivo(xmlTexto, "eleicoes-sp-2026.xml", "application/xml");
    avisar("XML do mapa eleitoral baixado.");
  }

  /* --------------------------------------------------------------------------
     Botão 2 — converte os CARGOS lidos do XML para CSV.
     Cabeçalho exigido no Passo 1.3: Cargo;Poder;Descrição
     -------------------------------------------------------------------- */
  function exportarCargosParaPlanilha() {
    /* "﻿" no início é o BOM: garante que acentos (é, ç, ã…) fiquem
       corretos ao abrir o CSV no Excel.
       Usamos ";" como separador de colunas, padrão do Excel em pt-BR. */
    let csv = "﻿Cargo;Poder;Descrição\n";

    cargosData.forEach((cargo) => {
      csv += `${limpar(cargo.titulo)};${limpar(cargo.poder)};${limpar(cargo.descricao)}\n`;
    });

    baixarArquivo(csv, "cargos-sp-2026.csv", "text/csv;charset=utf-8");
    avisar(`Planilha de cargos gerada com ${cargosData.length} linhas.`);
  }

  /* --------------------------------------------------------------------------
     Botão 3 — extra do grupo: os CANDIDATOS em planilha, com as propostas.
     Mesma disciplina de limpeza aplicada a todos os campos de texto.
     -------------------------------------------------------------------- */
  function exportarCandidatosParaPlanilha() {
    let csv = "﻿Cargo;Candidato;Partido;Número;Proposta 1;Proposta 2;Proposta 3\n";

    candidatosData.forEach((candidato) => {
      const propostas = [0, 1, 2]
        .map((i) => limpar(candidato.propostas[i]?.texto || ""))
        .join(";");

      csv += [
        limpar(candidato.cargo),
        limpar(candidato.nome),
        limpar(candidato.partido),
        limpar(candidato.numero),
        propostas,
      ].join(";") + "\n";
    });

    baixarArquivo(csv, "candidatos-sp-2026.csv", "text/csv;charset=utf-8");
    avisar(`Planilha de candidatos gerada com ${candidatosData.length} linhas.`);
  }

  /* --------------------------------------------------------------------------
     Recado curto na tela, para o clique não parecer que "não fez nada".
     -------------------------------------------------------------------- */
  let tempoAviso;

  function avisar(mensagem) {
    const alvo = $("[data-aviso-exportacao]");
    if (!alvo) return;

    alvo.textContent = mensagem;
    alvo.classList.add("is-visivel");

    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(() => alvo.classList.remove("is-visivel"), 4000);
  }

  /* --------------------------------------------------------------------------
     Liga os botões do HTML às funções de exportação
     -------------------------------------------------------------------- */
  $("[data-exportar-xml]")?.addEventListener("click", exportarXML);
  $("[data-exportar-csv-cargos]")?.addEventListener("click", exportarCargosParaPlanilha);
  $("[data-exportar-csv-candidatos]")?.addEventListener("click", exportarCandidatosParaPlanilha);
})();
