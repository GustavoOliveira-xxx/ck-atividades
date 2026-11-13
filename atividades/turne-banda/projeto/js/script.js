const CAMINHO_DADOS_TURNE = "dados/turne.json";

const SHOWS_CONTINGENCIA_LABORATORIO = [
  { id: 1, cidade: "São Paulo", estado: "SP", local: "Allianz Parque", data_formatada: "21/11/2026", horario: "21:00", capacidade_total: 45000, ingressos_vendidos: 45000, preco_medio: 280, status: "Esgotado" },
  { id: 2, cidade: "Campinas", estado: "SP", local: "Estádio Brinco de Ouro", data_formatada: "22/11/2026", horario: "20:00", capacidade_total: 29000, ingressos_vendidos: 26100, preco_medio: 190, status: "Últimos Ingressos" },
  { id: 3, cidade: "Rio de Janeiro", estado: "RJ", local: "Jeunesse Arena", data_formatada: "28/11/2026", horario: "21:30", capacidade_total: 15000, ingressos_vendidos: 15000, preco_medio: 260, status: "Esgotado" },
  { id: 4, cidade: "Belo Horizonte", estado: "MG", local: "Arena MRV", data_formatada: "29/11/2026", horario: "20:00", capacidade_total: 46000, ingressos_vendidos: 31280, preco_medio: 220, status: "Confirmado" },
  { id: 5, cidade: "Curitiba", estado: "PR", local: "Pedreira Paulo Leminski", data_formatada: "05/12/2026", horario: "21:00", capacidade_total: 25000, ingressos_vendidos: 23500, preco_medio: 210, status: "Últimos Ingressos" },
  { id: 6, cidade: "Porto Alegre", estado: "RS", local: "Arena do Grêmio", data_formatada: "06/12/2026", horario: "20:00", capacidade_total: 55000, ingressos_vendidos: 30250, preco_medio: 200, status: "Confirmado" },
  { id: 7, cidade: "Brasília", estado: "DF", local: "Ginásio Nilson Nelson", data_formatada: "12/12/2026", horario: "21:00", capacidade_total: 16000, ingressos_vendidos: 16000, preco_medio: 230, status: "Esgotado" },
  { id: 8, cidade: "Salvador", estado: "BA", local: "Arena Fonte Nova", data_formatada: "19/12/2026", horario: "21:00", capacidade_total: 50000, ingressos_vendidos: 28500, preco_medio: 180, status: "Confirmado" }
];

const COORDENADAS_CIDADES = {
  "São Paulo": [-23.55, -46.63],
  "Campinas": [-22.91, -47.06],
  "Rio de Janeiro": [-22.91, -43.17],
  "Belo Horizonte": [-19.92, -43.94],
  "Curitiba": [-25.43, -49.27],
  "Porto Alegre": [-30.03, -51.23],
  "Brasília": [-15.79, -47.88],
  "Salvador": [-12.97, -38.5]
};

const CLASSE_DO_STATUS = {
  "Esgotado": "esgotado",
  "Últimos Ingressos": "ultimos",
  "Confirmado": "confirmado"
};

const MESES_ABREVIADOS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const ESTILO_CONSOLE_OK = "background:#a308c8;color:#fff;padding:3px 8px;border-radius:4px;font-weight:700";
const ESTILO_CONSOLE_AVISO = "background:#fccf02;color:#050407;padding:3px 8px;border-radius:4px;font-weight:700";
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let todosOsShows = [];

$(function () {
  const $gridShows = $("#grid-shows");
  const $inputBusca = $("#input-busca");
  const $filtroStatus = $("#filtro-status");
  const $ordenarPor = $("#ordenar-por");
  const $statusCarregamento = $("#status-carregamento");
  const $dialogo = $("#dialogo-show");

  function formatarNumero(valor) {
    return Math.round(valor).toLocaleString("pt-BR");
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }

  function escaparHtml(texto) {
    return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  function calcularPercentualVendido(show) {
    return Math.round((show.ingressos_vendidos / show.capacidade_total) * 100);
  }

  function converterDataDoShow(show) {
    const [dia, mes, ano] = show.data_formatada.split("/").map(Number);
    const [hora, minuto] = show.horario.split(":").map(Number);
    return new Date(ano, mes - 1, dia, hora, minuto);
  }

  function calcularDiasAteOShow(show) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diaDoShow = converterDataDoShow(show);
    diaDoShow.setHours(0, 0, 0, 0);
    return Math.round((diaDoShow - hoje) / 86400000);
  }

  function descreverContagem(dias) {
    if (dias > 1) return `faltam ${dias} dias`;
    if (dias === 1) return "é amanhã";
    if (dias === 0) return "é hoje";
    return "show realizado";
  }

  function mostrarStatusCarregamento(tipo, mensagem) {
    $statusCarregamento.attr("data-tipo", tipo).text(mensagem);
  }

  function carregarDadosTurne() {
    $.ajax({
      url: CAMINHO_DADOS_TURNE,
      method: "GET",
      dataType: "json",
      cache: false,
      timeout: 5000,
      beforeSend: function () {
        mostrarStatusCarregamento("carregando", "Carregando a agenda da turnê em dados/turne.json...");
        $gridShows.attr("aria-busy", "true").html(criarEsqueletosHtml(8));
        console.log("%c AJAX ", ESTILO_CONSOLE_OK, "Pedido enviado para " + CAMINHO_DADOS_TURNE);
      },
      success: function (shows) {
        console.log("%c SUCESSO ", ESTILO_CONSOLE_OK, `${shows.length} shows carregados do arquivo ${CAMINHO_DADOS_TURNE} via AJAX.`);
        console.table(shows);
        iniciarPainel(shows, "ajax");
      },
      error: function (xhr, situacao) {
        console.warn("%c LABORATÓRIO ETEC ", ESTILO_CONSOLE_AVISO,
          `Não deu para ler ${CAMINHO_DADOS_TURNE} (situação: ${situacao}, código ${xhr.status}). ` +
          "Abrindo pelo botão Play (file:///) o navegador bloqueia a leitura do arquivo local por segurança (CORS). " +
          "Usando a lista de contingência com os mesmos 8 shows.");
        console.table(SHOWS_CONTINGENCIA_LABORATORIO);
        iniciarPainel(SHOWS_CONTINGENCIA_LABORATORIO, "contingencia");
      },
      complete: function () {
        $gridShows.attr("aria-busy", "false");
        console.log("%c COMPLETE ", ESTILO_CONSOLE_OK, "Requisição AJAX finalizada.");
      }
    });
  }

  function iniciarPainel(shows, origem) {
    todosOsShows = shows;
    const mensagens = {
      ajax: `Dados carregados via AJAX de dados/turne.json · ${shows.length} shows`,
      contingencia: `Modo laboratório: lista de contingência ativa · ${shows.length} shows`
    };
    mostrarStatusCarregamento(origem, mensagens[origem]);
    montarChipsStatus();
    montarLetreiro();
    desenharRotaTurne();
    aplicarFiltros();
  }

  function criarEsqueletosHtml(quantidade) {
    return Array.from({ length: quantidade }, () => '<div class="card-esqueleto" aria-hidden="true"></div>').join("");
  }

  function criarCardShowHtml(show, posicao) {
    const percentual = calcularPercentualVendido(show);
    const classeStatus = CLASSE_DO_STATUS[show.status] || "confirmado";
    const data = converterDataDoShow(show);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = MESES_ABREVIADOS[data.getMonth()];
    const restantes = show.capacidade_total - show.ingressos_vendidos;

    return `
      <article class="card-show status-${classeStatus}" style="--atraso:${posicao * 70}ms" data-id="${show.id}">
        <div class="card-brilho" aria-hidden="true"></div>
        <header class="card-topo">
          <div class="card-data" aria-label="${escaparHtml(show.data_formatada)}">
            <span class="card-dia">${dia}</span>
            <span class="card-mes">${mes}</span>
          </div>
          <span class="badge badge-${classeStatus}">${escaparHtml(show.status)}</span>
        </header>
        <p class="card-numero">Show ${String(show.id).padStart(2, "0")}</p>
        <h3 class="card-cidade">${escaparHtml(show.cidade)} <span>${escaparHtml(show.estado)}</span></h3>
        <p class="card-local">${escaparHtml(show.local)} · ${escaparHtml(show.horario)}</p>
        <div class="card-vendas">
          <div class="card-vendas-linha">
            <span>${formatarNumero(show.ingressos_vendidos)} de ${formatarNumero(show.capacidade_total)}</span>
            <strong>${percentual}%</strong>
          </div>
          <div class="barra-progresso" role="progressbar" aria-label="Ingressos vendidos em ${escaparHtml(show.cidade)}"
               aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentual}">
            <span style="--progresso:${percentual}%"></span>
          </div>
          <p class="card-restantes">${restantes > 0 ? `${formatarNumero(restantes)} ingressos restantes` : "Nenhum ingresso restante"}</p>
        </div>
        <footer class="card-rodape">
          <span class="card-preco">${formatarMoeda(show.preco_medio)} <small>preço médio</small></span>
          <button class="btn-detalhes" type="button" data-id="${show.id}">Detalhes</button>
        </footer>
      </article>`;
  }

  function criarEstadoVazioHtml() {
    return `
      <div class="estado-vazio">
        <p class="estado-vazio-titulo">Nenhum show encontrado</p>
        <p>Tente outra cidade ou limpe os filtros.</p>
        <button class="botao botao-ouro" type="button" id="btn-vazio-limpar">Limpar filtros</button>
      </div>`;
  }

  function renderizarGradeShows(lista) {
    $gridShows.empty();
    if (lista.length === 0) {
      $gridShows.append(criarEstadoVazioHtml());
      return;
    }
    lista.forEach(function (show, posicao) {
      const cardHtml = criarCardShowHtml(show, posicao);
      $gridShows.append(cardHtml);
    });
  }

  function correspondeBusca(show, termo) {
    if (termo === "") return true;
    const textoDoShow = normalizarTexto(`${show.cidade} ${show.estado} ${show.local}`);
    return textoDoShow.includes(termo);
  }

  function correspondeStatus(show, status) {
    return status === "Todos" || show.status === status;
  }

  function ordenarShows(lista, criterio) {
    const comparadores = {
      data: (a, b) => converterDataDoShow(a) - converterDataDoShow(b),
      vendidos: (a, b) => b.ingressos_vendidos - a.ingressos_vendidos,
      ocupacao: (a, b) => calcularPercentualVendido(b) - calcularPercentualVendido(a) || b.ingressos_vendidos - a.ingressos_vendidos,
      cidade: (a, b) => a.cidade.localeCompare(b.cidade, "pt-BR")
    };
    return lista.slice().sort(comparadores[criterio] || comparadores.data);
  }

  function aplicarFiltros() {
    const termo = normalizarTexto($inputBusca.val());
    const status = $filtroStatus.val();
    const showsFiltrados = todosOsShows.filter((show) => correspondeBusca(show, termo) && correspondeStatus(show, status));
    const showsOrdenados = ordenarShows(showsFiltrados, $ordenarPor.val());

    renderizarGradeShows(showsOrdenados);
    atualizarPainelMetricas(showsOrdenados);
    atualizarContadorResultados(showsOrdenados.length, termo, status);
    destacarChipAtivo(status);
    destacarPontosDaRota(showsOrdenados);
  }

  function atualizarContadorResultados(quantidade, termo, status) {
    const partes = [];
    if (termo !== "") partes.push(`busca “${$inputBusca.val().trim()}”`);
    if (status !== "Todos") partes.push(`status ${status}`);
    const filtros = partes.length ? ` com ${partes.join(" e ")}` : "";
    const plural = quantidade === 1 ? "show" : "shows";
    $("#contador-resultados").text(`${quantidade} ${plural} na tela${filtros}.`);
    $("#resumo-filtro").text(partes.length ? `Números dos shows filtrados${filtros}.` : "Números da turnê completa.");
  }

  function animarNumero($elemento, valorFinal, formatar) {
    const valorInicial = Number($elemento.data("valor")) || 0;
    const animacaoAnterior = $elemento.data("animacao");
    if (animacaoAnterior) animacaoAnterior.stop();
    $elemento.data("valor", valorFinal);

    if (reduzirMovimento) {
      $elemento.text(formatar(valorFinal));
      return;
    }
    const animacao = $({ valor: valorInicial }).animate({ valor: valorFinal }, {
      duration: 900,
      easing: "swing",
      step: (valor) => $elemento.text(formatar(valor)),
      complete: () => $elemento.text(formatar(valorFinal))
    });
    $elemento.data("animacao", animacao);
  }

  function atualizarPainelMetricas(lista) {
    const totalVendidos = lista.reduce((soma, show) => soma + show.ingressos_vendidos, 0);
    const totalCapacidade = lista.reduce((soma, show) => soma + show.capacidade_total, 0);
    const receitaEstimada = lista.reduce((soma, show) => soma + show.ingressos_vendidos * show.preco_medio, 0);
    const cidades = lista.reduce((unicas, show) => unicas.add(show.cidade), new Set()).size;
    const estados = lista.reduce((unicos, show) => unicos.add(show.estado), new Set()).size;
    const ocupacao = totalCapacidade > 0 ? Math.round((totalVendidos / totalCapacidade) * 100) : 0;

    animarNumero($("#metrica-shows"), lista.length, formatarNumero);
    animarNumero($("#metrica-cidades"), cidades, formatarNumero);
    animarNumero($("#metrica-ingressos"), totalVendidos, formatarNumero);
    animarNumero($("#metrica-ocupacao"), ocupacao, (v) => `${Math.round(v)}%`);
    animarNumero($("#metrica-receita"), receitaEstimada, formatarMoeda);

    $("#metrica-shows-extra").text(`de ${todosOsShows.length} na agenda`);
    $("#metrica-estados").text(`${estados} ${estados === 1 ? "estado" : "estados"}`);
    $("#metrica-capacidade").text(`de ${formatarNumero(totalCapacidade)} lugares`);
    $("#metrica-ocupacao-barra").css("width", `${ocupacao}%`);
  }

  function contarShowsPorStatus() {
    return todosOsShows.reduce((contagem, show) => {
      contagem[show.status] = (contagem[show.status] || 0) + 1;
      return contagem;
    }, { Todos: todosOsShows.length });
  }

  function montarChipsStatus() {
    const contagem = contarShowsPorStatus();
    const chips = ["Todos", "Esgotado", "Últimos Ingressos", "Confirmado"].map((status) => `
      <button class="chip chip-${CLASSE_DO_STATUS[status] || "todos"}" type="button" data-status="${status}" aria-pressed="false">
        ${status} <b>${contagem[status] || 0}</b>
      </button>`);
    $("#chips-status").html(chips.join(""));
  }

  function destacarChipAtivo(status) {
    $("#chips-status .chip").each(function () {
      const ativo = $(this).data("status") === status;
      $(this).toggleClass("ativo", ativo).attr("aria-pressed", String(ativo));
    });
  }

  function montarLetreiro() {
    const roteiro = ordenarShows(todosOsShows, "data")
      .map((show) => `<span>${escaparHtml(show.cidade.toUpperCase())} <em>${show.data_formatada.slice(0, 5)}</em></span>`)
      .join('<i aria-hidden="true">✦</i>');
    $("#letreiro").html(`<div>${roteiro}<i aria-hidden="true">✦</i></div><div>${roteiro}<i aria-hidden="true">✦</i></div>`);
  }

  function projetarCoordenada(latitude, longitude) {
    const limites = { oeste: -54, leste: -36, norte: -11, sul: -32 };
    const x = ((longitude - limites.oeste) / (limites.leste - limites.oeste)) * 600;
    const y = ((limites.norte - latitude) / (limites.norte - limites.sul)) * 560;
    return { x: Math.round(x), y: Math.round(y) };
  }

  function desenharRotaTurne() {
    const roteiro = ordenarShows(todosOsShows, "data").filter((show) => COORDENADAS_CIDADES[show.cidade]);
    const pontos = roteiro.map((show) => ({ show, ...projetarCoordenada(...COORDENADAS_CIDADES[show.cidade]) }));
    const caminho = pontos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

    const grade = Array.from({ length: 13 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="560"/>`).join("") +
      Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="600" y2="${i * 50}"/>`).join("");

    const ladoDoRotulo = { "Campinas": "esquerda", "Curitiba": "esquerda", "Porto Alegre": "esquerda", "Brasília": "esquerda" };
    const marcadores = pontos.map((p, i) => {
      const esquerda = ladoDoRotulo[p.show.cidade] === "esquerda";
      return `
      <g class="ponto-rota status-${CLASSE_DO_STATUS[p.show.status]}" data-id="${p.show.id}" transform="translate(${p.x} ${p.y})"
         tabindex="0" role="button" aria-label="${escaparHtml(`${p.show.cidade}, ${p.show.data_formatada}, ${p.show.status}`)}">
        <circle class="ponto-onda" r="10"/>
        <circle class="ponto-nucleo" r="7"/>
        <text class="ponto-ordem" y="3.5">${i + 1}</text>
        <text class="ponto-nome" x="${esquerda ? -16 : 16}" y="-2" text-anchor="${esquerda ? "end" : "start"}">${escaparHtml(p.show.cidade)}</text>
        <text class="ponto-data" x="${esquerda ? -16 : 16}" y="13" text-anchor="${esquerda ? "end" : "start"}">${p.show.data_formatada.slice(0, 5)}</text>
      </g>`;
    }).join("");

    $("#rota-turne").html(`
      <svg viewBox="-20 -20 640 600" role="group" aria-label="Mapa da rota da turnê com ${pontos.length} cidades">
        <defs>
          <linearGradient id="gradiente-rota" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#fccf02"/><stop offset="1" stop-color="#a308c8"/>
          </linearGradient>
        </defs>
        <g class="rota-grade">${grade}</g>
        <path class="rota-sombra" d="${caminho}"/>
        <path class="rota-caminho" d="${caminho}" pathLength="1"/>
        ${marcadores}
      </svg>`);
  }

  function destacarPontosDaRota(listaVisivel) {
    const idsVisiveis = new Set(listaVisivel.map((show) => show.id));
    $("#rota-turne .ponto-rota").each(function () {
      $(this).toggleClass("apagado", !idsVisiveis.has(Number($(this).data("id"))));
    });
  }

  function criarDetalhesHtml(show) {
    const percentual = calcularPercentualVendido(show);
    const classeStatus = CLASSE_DO_STATUS[show.status] || "confirmado";
    const restantes = show.capacidade_total - show.ingressos_vendidos;
    const dias = calcularDiasAteOShow(show);
    const circunferencia = 2 * Math.PI * 52;

    return `
      <div class="ingresso-corpo status-${classeStatus}">
        <p class="ingresso-banda">ECO LUNAR · TURNÊ BRASIL 2026</p>
        <h2 id="dialogo-titulo">${escaparHtml(show.cidade)} <span>${escaparHtml(show.estado)}</span></h2>
        <p class="ingresso-local">${escaparHtml(show.local)}</p>
        <div class="ingresso-meio">
          <svg class="anel-ocupacao" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" class="anel-trilha"/>
            <circle cx="60" cy="60" r="52" class="anel-valor" style="--total:${circunferencia.toFixed(1)};--resto:${(circunferencia * (1 - percentual / 100)).toFixed(1)}"/>
          </svg>
          <p class="anel-texto"><strong>${percentual}%</strong><span>vendido</span></p>
        </div>
        <dl class="ingresso-dados">
          <div><dt>Data</dt><dd>${escaparHtml(show.data_formatada)}</dd></div>
          <div><dt>Horário</dt><dd>${escaparHtml(show.horario)}</dd></div>
          <div><dt>Status</dt><dd><span class="badge badge-${classeStatus}">${escaparHtml(show.status)}</span></dd></div>
          <div><dt>Contagem</dt><dd>${descreverContagem(dias)}</dd></div>
          <div><dt>Vendidos</dt><dd>${formatarNumero(show.ingressos_vendidos)}</dd></div>
          <div><dt>Restantes</dt><dd>${formatarNumero(restantes)}</dd></div>
          <div><dt>Preço médio</dt><dd>${formatarMoeda(show.preco_medio)}</dd></div>
          <div><dt>Receita estimada</dt><dd>${formatarMoeda(show.ingressos_vendidos * show.preco_medio)}</dd></div>
        </dl>
      </div>
      <div class="ingresso-canhoto" aria-hidden="true">
        <span>SHOW ${String(show.id).padStart(2, "0")}</span>
        <span class="codigo-barras"></span>
      </div>`;
  }

  function abrirDetalhesDoShow(idDoShow) {
    const show = todosOsShows.find((item) => item.id === Number(idDoShow));
    if (!show) return;
    $("#dialogo-conteudo").html(criarDetalhesHtml(show));
    const dialogo = $dialogo.get(0);
    if (typeof dialogo.showModal === "function") {
      dialogo.showModal();
    } else {
      $dialogo.attr("open", "");
    }
  }

  function fecharDetalhes() {
    const dialogo = $dialogo.get(0);
    if (typeof dialogo.close === "function") {
      dialogo.close();
    } else {
      $dialogo.removeAttr("open");
    }
  }

  function limparFiltros() {
    $inputBusca.val("");
    $filtroStatus.val("Todos");
    $ordenarPor.val("data");
    aplicarFiltros();
    $inputBusca.trigger("focus");
  }

  $inputBusca.on("input", aplicarFiltros);
  $filtroStatus.on("change", aplicarFiltros);
  $ordenarPor.on("change", aplicarFiltros);
  $("#btn-limpar").on("click", limparFiltros);
  $gridShows.on("click", "#btn-vazio-limpar", limparFiltros);
  $("#btn-recarregar").on("click", carregarDadosTurne);

  $("#chips-status").on("click", ".chip", function () {
    $filtroStatus.val($(this).data("status"));
    aplicarFiltros();
  });

  $gridShows.on("click", ".btn-detalhes", function () {
    abrirDetalhesDoShow($(this).data("id"));
  });

  $("#rota-turne").on("click", ".ponto-rota", function () {
    abrirDetalhesDoShow($(this).data("id"));
  });

  $("#rota-turne").on("keydown", ".ponto-rota", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      abrirDetalhesDoShow($(this).data("id"));
    }
  });

  $("#dialogo-fechar").on("click", fecharDetalhes);
  $dialogo.on("click", function (evento) {
    if (evento.target === this) fecharDetalhes();
  });

  $(document).on("keydown", function (evento) {
    const digitando = $(evento.target).is("input, select, textarea");
    if (evento.key === "/" && !digitando) {
      evento.preventDefault();
      $inputBusca.trigger("focus");
    }
  });

  carregarDadosTurne();
});
