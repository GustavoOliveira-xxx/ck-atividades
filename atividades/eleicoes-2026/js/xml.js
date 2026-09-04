(() => {
  "use strict";

  const { xmlTexto, CLASSE_PODER, COR_PARTIDO } = window.CK_XML;

  const cargosData = [];
  const candidatosData = [];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const esc = (txt) => String(txt ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

  const slug = (txt) => String(txt)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const xmlDoc = new DOMParser().parseFromString(xmlTexto, "text/xml");

  const falhaParse = xmlDoc.querySelector("parsererror");

  if (falhaParse) {
    console.error("XML inválido em xmlTexto:", falhaParse.textContent);
  }

  const lerCargos = () => {
    const cargos = xmlDoc.querySelectorAll("cargos > cargo");

    cargos.forEach((cargo) => {
      const titulo = cargo.getAttribute("titulo");
      const poder = cargo.getAttribute("poder");
      const ambito = cargo.getAttribute("ambito");
      const vagas = Number(cargo.getAttribute("vagas")) || 0;
      const mandato = cargo.getAttribute("mandato");
      const icone = cargo.getAttribute("icone");

      const descricao = cargo.querySelector("descricao").textContent.trim();

      cargosData.push({
        titulo, poder, ambito, vagas, mandato, icone, descricao,
        id: slug(titulo),

        classeBadge: CLASSE_PODER[poder] || "badge-legislativo",
      });
    });
  };

  const lerCandidatos = () => {
    const candidatos = xmlDoc.querySelectorAll("candidatos > candidato");

    candidatos.forEach((candidato, indice) => {
      const cargo = candidato.getAttribute("cargo");
      const partido = candidato.getAttribute("partido");
      const numero = candidato.getAttribute("numero");
      const foto = candidato.getAttribute("foto");

      const nome = candidato.querySelector("nome").textContent.trim();
      const partidoNome = candidato.querySelector("partido").textContent.trim();
      const perfil = candidato.querySelector("perfil").textContent.trim();

      const propostas = [...candidato.querySelectorAll("propostas > proposta")]
        .map((proposta) => ({
          eixo: proposta.getAttribute("eixo"),
          texto: proposta.textContent.trim(),
        }));

      const tipoPropostas =
        candidato.querySelector("propostas")?.getAttribute("tipo") || "pautas";

      const conferir = candidato.getAttribute("conferir") || "";

      candidatosData.push({
        indice, cargo, partido, numero, nome, partidoNome, perfil, propostas,
        tipoPropostas, conferir,
        id: slug(nome),
        cargoId: slug(cargo),
        foto: `assets/candidatos/${foto}.png`,
        cor: COR_PARTIDO[partido] || "#25f0a2",
      });
    });
  };

  const ICONES = {
    planalto: '<path d="M3 20h18M5 20v-7l7-4 7 4v7"/><path d="M9 20v-4h6v4"/><path d="M12 5V3"/>',
    bandeirantes: '<path d="M3 20h18"/><path d="M5 20V9l4-3 4 3v11"/><path d="M13 20v-6l3-2 3 2v6"/><path d="M8 12h2M8 16h2"/>',
    senado: '<path d="M3 20h18M4 20V9m4 11V9m4 11V9m4 11V9m4 11V9"/><path d="M2 9l10-6 10 6"/>',
    camara: '<path d="M3 20h18"/><path d="M4 20v-6a8 8 0 0 1 16 0v6"/><path d="M12 6V3"/><circle cx="12" cy="14" r="2.5"/>',
    alesp: '<path d="M3 20h18M6 20V8h12v12"/><path d="M9 20v-5h6v5"/><path d="M6 8l6-5 6 5"/>',
  };

  const cartaoCargo = (cargo, i) => `
    <article class="cargo-card" data-tilt data-poder="${esc(cargo.poder)}"
             style="--atraso:${i * 90}ms" data-revelar>
      <span class="cargo-card__brilho" aria-hidden="true"></span>

      <header class="cargo-card__topo">
        <span class="cargo-card__icone" aria-hidden="true">
          <svg viewBox="0 0 24 24">${ICONES[cargo.icone] || ICONES.camara}</svg>
        </span>
        <span class="badge ${cargo.classeBadge}">${esc(cargo.poder)}</span>
      </header>

      <h3 class="cargo-card__titulo">${esc(cargo.titulo)}</h3>
      <p class="cargo-card__ambito">${esc(cargo.ambito)} · mandato de ${esc(cargo.mandato)}</p>
      <p class="cargo-card__desc">${esc(cargo.descricao)}</p>

      <footer class="cargo-card__base">
        <span class="cargo-card__vagas">
          <strong>${cargo.vagas}</strong>
          ${cargo.vagas === 1 ? "vaga em disputa" : "vagas em disputa"}
        </span>
        <button type="button" class="cargo-card__link" data-ir-cargo="${esc(cargo.titulo)}">
          Ver candidatos
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </footer>
    </article>`;

  const desenharCargos = () => {
    const grade = $("[data-grade-cargos]");
    if (!grade) return;
    grade.innerHTML = cargosData.map(cartaoCargo).join("");
  };

  const destacarXML = (txt) => esc(txt)
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-com">$1</span>')
    .replace(/(&lt;\?[\s\S]*?\?&gt;)/g, '<span class="xml-decl">$1</span>')
    .replace(/(&lt;\/?)([\w_-]+)/g, '$1<span class="xml-tag">$2</span>')
    .replace(/([\w_-]+)=(&quot;.*?&quot;)/g, '<span class="xml-attr">$1</span>=<span class="xml-val">$2</span>');

  const desenharFonteXML = () => {
    const alvo = $("[data-xml-fonte]");
    if (!alvo) return;
    alvo.innerHTML = destacarXML(xmlTexto.trim());

    const linhas = $("[data-xml-linhas]");
    if (linhas) linhas.textContent = String(xmlTexto.trim().split("\n").length);
  };

  lerCargos();
  lerCandidatos();
  desenharCargos();
  desenharFonteXML();

  window.CK_ELEICOES = {
    xmlDoc,
    cargosData,
    candidatosData,
    helpers: { $, $$, esc, slug },
  };
})();
