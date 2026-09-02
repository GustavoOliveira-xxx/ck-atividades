/* ============================================================================
   CK ELEIÇÕES 2026 — PARTE 2 · CONSUMINDO UMA API COM FETCH (JSON)
   ----------------------------------------------------------------------------
   No código-base, a Parte 2 buscava piadas na JokeAPI e traduzia com a
   MyMemory. Aqui o alvo é o sistema DivulgaCandContas do TSE.

   SOBRE O CORS
   O endpoint público do TSE não devolve o cabeçalho Access-Control-Allow-Origin,
   então o navegador bloqueia a leitura da resposta a partir de outra origem —
   é o erro 403/CORS mostrado na aula. Das três saídas apresentadas
   (Mock, Proxy, Backend próprio), esta entrega usa a ABORDAGEM 1 — MOCK:
   recortes locais em `dados/*.json`, com o MESMO formato do retorno do TSE.

   O mecanismo exercitado é idêntico ao de uma API remota:

       select cargo → fetch(url) → await resposta.json() → dados.candidatos
                    → forEach/map → cards no DOM

   Trocar para o TSE real depois é mudar uma constante: basta apontar
   ORIGEM_DADOS para o proxy ou para o backend próprio.
   ========================================================================== */

(() => {
  "use strict";

  const { candidatosData, helpers } = window.CK_ELEICOES;
  const { $, esc, slug } = helpers;

  /* URL base dos recortes. Em produção acadêmica, é a pasta local.
     Para usar o TSE de verdade, troque por um proxy CORS ou backend próprio:
       const ORIGEM_DADOS = "https://SEU-PROXY/divulgacandcontas.tse.jus.br/..."; */
  const ORIGEM_DADOS = "dados";

  /* Mapa cargo → arquivo, no lugar do parâmetro de URL da API real. */
  const ARQUIVO_POR_CARGO = {
    "Presidente": "candidatos-presidente.json",
    "Governador": "candidatos-governador.json",
    "Senador": "candidatos-senador.json",
    "Deputado Federal": "candidatos-deputado-federal.json",
    "Deputado Estadual": "candidatos-deputado-estadual.json",
  };

  /* Cache em memória: consultar o mesmo cargo duas vezes não refaz o fetch. */
  const cache = new Map();

  const selectCargo = $("[data-select-cargo]");
  const botaoBuscar = $("[data-btn-buscar]");
  const areaResultado = $("[data-resultado-api]");
  const areaStatus = $("[data-status-api]");
  const areaMeta = $("[data-meta-api]");

  /* --------------------------------------------------------------------------
     A CHAMADA ASSÍNCRONA
     -------------------------------------------------------------------- */
  async function buscarCandidatosDoCargo(cargo) {
    if (cache.has(cargo)) return cache.get(cargo);

    const arquivo = ARQUIVO_POR_CARGO[cargo];
    if (!arquivo) throw new Error(`Cargo sem recorte mapeado: ${cargo}`);

    const resposta = await fetch(`${ORIGEM_DADOS}/${arquivo}`, { cache: "no-cache" });

    /* fetch() só rejeita em falha de rede. Um 404 chega como resposta "ok: false",
       então a checagem abaixo é obrigatória. */
    if (!resposta.ok) {
      throw new Error(`A consulta respondeu ${resposta.status} (${resposta.statusText}).`);
    }

    const dados = await resposta.json();

    if (!dados || !Array.isArray(dados.candidatos)) {
      throw new Error("A resposta chegou, mas não traz a lista de candidatos.");
    }

    cache.set(cargo, dados);
    return dados;
  }

  /* --------------------------------------------------------------------------
     Cruza o retorno "da API" com as propostas que vieram do XML (Parte 1).
     É aqui que os dois paradigmas da atividade se encontram.
     -------------------------------------------------------------------- */
  const arquivoDaFoto = (caminho) => String(caminho).split("/").pop();

  const casarComXML = (registro) => candidatosData.find((c) =>
    arquivoDaFoto(c.foto) === arquivoDaFoto(registro.foto)
  );

  /* --------------------------------------------------------------------------
     DESENHO DOS CARDS — card 3D que vira ao clique
     Frente: foto, nome de urna, partido, número.
     Verso : perfil + as três propostas lidas do XML.
     -------------------------------------------------------------------- */
  const cartaoCandidato = (registro, i) => {
    const doXML = casarComXML(registro) || {};
    const cor = doXML.cor || "#25f0a2";
    const propostas = doXML.propostas || [];

    const listaPropostas = propostas.length
      ? propostas.map((p) => `
          <li>
            <span class="proposta__eixo">${esc(p.eixo)}</span>
            <p>${esc(p.texto)}</p>
          </li>`).join("")
      : '<li><p>Propostas não informadas neste recorte.</p></li>';

    return `
    <article class="candidato" style="--cor-partido:${esc(cor)};--atraso:${i * 110}ms"
             data-candidato="${esc(slug(registro.nomeUrna))}" data-revelar>
      <div class="candidato__moldura">

        <div class="candidato__face candidato__face--frente">
          <span class="candidato__glow" aria-hidden="true"></span>

          <div class="candidato__retrato">
            <img src="${esc(registro.foto)}" alt="Retrato de ${esc(registro.nomeUrna)}"
                 width="600" height="800" loading="lazy" decoding="async">
            <span class="candidato__vinheta" aria-hidden="true"></span>
            <span class="candidato__situacao">${esc(registro.situacao)}</span>
          </div>

          <div class="candidato__dados">
            <p class="candidato__urna">${esc(registro.nomeUrna)}</p>
            <p class="candidato__completo">${esc(registro.nomeCompleto)}</p>

            <div class="candidato__rodape">
              <span class="candidato__partido">${esc(registro.siglaPartido)}</span>
              <span class="candidato__numero" aria-label="Número na urna">
                ${esc(registro.numero)}
              </span>
            </div>
          </div>

          <button type="button" class="candidato__virar" data-virar>
            Ver propostas
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3a9 9 0 1 1-9 9"/><path d="M3 3v6h6"/>
            </svg>
          </button>
        </div>

        <div class="candidato__face candidato__face--verso">
          <p class="candidato__verso-nome">${esc(registro.nomeUrna)}</p>
          <p class="candidato__perfil">${esc(doXML.perfil || "")}</p>

          <ul class="candidato__propostas">${listaPropostas}</ul>

          <p class="candidato__coligacao">
            <strong>Coligação:</strong> ${esc(registro.coligacao)}
          </p>

          <button type="button" class="candidato__virar candidato__virar--voltar" data-virar>
            Voltar
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21a9 9 0 1 0-9-9"/><path d="M3 21v-6h6"/>
            </svg>
          </button>
        </div>

      </div>
    </article>`;
  };

  /* --------------------------------------------------------------------------
     ESTADOS DA TELA
     -------------------------------------------------------------------- */
  const esqueletos = (quantidade = 3) => Array.from({ length: quantidade }, (_, i) => `
    <div class="candidato-esqueleto" style="--atraso:${i * 140}ms" aria-hidden="true">
      <span class="candidato-esqueleto__retrato"></span>
      <span class="candidato-esqueleto__linha"></span>
      <span class="candidato-esqueleto__linha candidato-esqueleto__linha--curta"></span>
    </div>`).join("");

  const definirStatus = (texto, tipo = "") => {
    if (!areaStatus) return;
    areaStatus.textContent = texto;
    areaStatus.className = `api-status${tipo ? ` api-status--${tipo}` : ""}`;
  };

  /* --------------------------------------------------------------------------
     O FLUXO COMPLETO (o "Novo Fluxo Assíncrono do Candidato" da aula)
     -------------------------------------------------------------------- */
  async function consultarCargo() {
    const cargoEscolhido = selectCargo.value;

    /* Desabilita o botão e avisa o usuário que está carregando */
    botaoBuscar.disabled = true;
    botaoBuscar.classList.add("is-carregando");
    definirStatus(`Consultando candidatos a ${cargoEscolhido}…`, "carregando");
    areaResultado.innerHTML = esqueletos();
    if (areaMeta) areaMeta.innerHTML = "";

    try {
      const dados = await buscarCandidatosDoCargo(cargoEscolhido);
      const { dadosGerais, candidatos } = dados;

      /* Uma pequena espera deixa o estado de carregamento visível mesmo em
         arquivo local — importante para demonstrar o assíncrono na apresentação. */
      await new Promise((resolve) => setTimeout(resolve, 420));

      /* Percorre a matriz de objetos e monta os cards (forEach/map) */
      areaResultado.innerHTML = candidatos.map(cartaoCandidato).join("");

      if (areaMeta) {
        areaMeta.innerHTML = `
          <span><strong>${dadosGerais.totalNesteRecorte}</strong> exibidos</span>
          <span><strong>${dadosGerais.totalCandidatosRegistrados}</strong> registrados no TSE</span>
          <span><strong>${dadosGerais.vagas}</strong> ${dadosGerais.vagas === 1 ? "vaga" : "vagas"}</span>
          <span>${esc(dadosGerais.abrangencia)}</span>`;
      }

      definirStatus(
        `${candidatos.length} candidatos a ${cargoEscolhido} carregados via fetch.`,
        "ok"
      );

      document.dispatchEvent(new CustomEvent("ck:candidatos-renderizados"));
    } catch (erro) {
      /* Se algo der errado (sem rede, arquivo movido, JSON inválido), avisamos */
      areaResultado.innerHTML = `
        <div class="api-erro">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/>
          </svg>
          <div>
            <strong>Não foi possível carregar os candidatos.</strong>
            <p>Abra o console do navegador para ver o detalhe técnico. Se estiver
               abrindo o arquivo direto do disco (<code>file://</code>), rode a
               pasta em um servidor local — o <code>fetch</code> exige HTTP.</p>
          </div>
        </div>`;
      definirStatus("Falha na consulta.", "erro");
      console.error("Falha ao buscar candidatos:", erro);
    } finally {
      /* Aconteça o que acontecer, o botão volta a funcionar */
      botaoBuscar.disabled = false;
      botaoBuscar.classList.remove("is-carregando");
    }
  }

  /* --------------------------------------------------------------------------
     LIGAÇÕES
     -------------------------------------------------------------------- */
  if (selectCargo && botaoBuscar && areaResultado) {
    botaoBuscar.addEventListener("click", consultarCargo);
    selectCargo.addEventListener("change", consultarCargo);

    /* Atalho vindo dos cards da Parte 1: "Ver candidatos" já dispara a consulta */
    document.addEventListener("click", (e) => {
      const gatilho = e.target.closest("[data-ir-cargo]");
      if (!gatilho) return;

      selectCargo.value = gatilho.dataset.irCargo;
      document.getElementById("candidatos")?.scrollIntoView({ behavior: "smooth" });
      consultarCargo();
    });

    /* Virar o card 3D */
    areaResultado.addEventListener("click", (e) => {
      const botao = e.target.closest("[data-virar]");
      if (!botao) return;
      botao.closest(".candidato")?.classList.toggle("is-virado");
    });

    /* Primeira carga automática, para a página nunca abrir vazia */
    consultarCargo();
  }
})();
