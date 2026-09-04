(() => {
  "use strict";

  const { xmlTexto } = window.CK_XML;
  const { cargosData, candidatosData, helpers } = window.CK_ELEICOES;
  const { $ } = helpers;

  function baixarArquivo(conteudo, nomeArquivo, tipoMime) {
    const blob = new Blob([conteudo], { type: tipoMime });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const limpar = (texto) => String(texto ?? "")
    .replace(/;/g, ",")
    .replace(/\r?\n/g, " ")
    .trim();

  function exportarXML() {
    baixarArquivo(xmlTexto, "eleicoes-sp-2026.xml", "application/xml");
    avisar("XML do mapa eleitoral baixado.");
  }

  function exportarCargosParaPlanilha() {
    let csv = "﻿Cargo;Poder;Descrição\n";

    cargosData.forEach((cargo) => {
      csv += `${limpar(cargo.titulo)};${limpar(cargo.poder)};${limpar(cargo.descricao)}\n`;
    });

    baixarArquivo(csv, "cargos-sp-2026.csv", "text/csv;charset=utf-8");
    avisar(`Planilha de cargos gerada com ${cargosData.length} linhas.`);
  }

  function exportarCandidatosParaPlanilha() {
    const maxPropostas = candidatosData.reduce(
      (maior, c) => Math.max(maior, c.propostas.length), 0
    );

    const colunasPropostas = Array.from(
      { length: maxPropostas },
      (_, i) => `Proposta ${i + 1}`
    ).join(";");

    let csv = `﻿Cargo;Candidato;Partido;Número;Tipo;${colunasPropostas}\n`;

    candidatosData.forEach((candidato) => {
      const propostas = Array.from(
        { length: maxPropostas },
        (_, i) => limpar(candidato.propostas[i]?.texto || "")
      ).join(";");

      const tipo = candidato.tipoPropostas === "programa"
        ? "Programa de governo"
        : "Pautas parlamentares";

      csv += [
        limpar(candidato.cargo),
        limpar(candidato.nome),
        limpar(candidato.partido),
        limpar(candidato.numero),
        limpar(tipo),
        propostas,
      ].join(";") + "\n";
    });

    baixarArquivo(csv, "candidatos-sp-2026.csv", "text/csv;charset=utf-8");
    avisar(`Planilha de candidatos gerada com ${candidatosData.length} linhas.`);
  }

  let tempoAviso;

  function avisar(mensagem) {
    const alvo = $("[data-aviso-exportacao]");
    if (!alvo) return;

    alvo.textContent = mensagem;
    alvo.classList.add("is-visivel");

    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(() => alvo.classList.remove("is-visivel"), 4000);
  }

  $("[data-exportar-xml]")?.addEventListener("click", exportarXML);
  $("[data-exportar-csv-cargos]")?.addEventListener("click", exportarCargosParaPlanilha);
  $("[data-exportar-csv-candidatos]")?.addEventListener("click", exportarCandidatosParaPlanilha);
})();
