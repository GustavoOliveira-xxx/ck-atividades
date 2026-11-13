$(document).ready(function () {

  const LIMITE_DESTAQUE = 0.5;
  const ESPORTE = "Futebol";
  let jogadores = [];
  let busca = "";
  let filtroPosicao = "Todas";
  let ordenado = false;
  let grafico = null;
  let metrica = "gols";

  function demonstrarTipos() {
    console.log(typeof ESPORTE, typeof LIMITE_DESTAQUE, typeof ordenado, typeof jogadores, typeof null);

    if (true) {
      let soNoBloco = "visível só aqui";
      var vazaDoBloco = "var ignora o bloco";
    }
    console.log(vazaDoBloco);
  }
  demonstrarTipos();

  function salvarCookie(nome, valor, dias) {
    const d = new Date();
    d.setTime(d.getTime() + dias * 24 * 60 * 60 * 1000);
    document.cookie = nome + "=" + valor + "; expires=" + d.toUTCString() + "; path=/";
  }

  function lerCookie(nome) {
    const partes = document.cookie.split("; ");
    for (let i = 0; i < partes.length; i++) {
      const par = partes[i].split("=");
      if (par[0] === nome) { return par[1]; }
    }
    return null;
  }

  function aplicarTema(tema) {
    $("body").toggleClass("escuro", tema === "escuro");
    salvarCookie("tema", tema, 7);
    if (grafico !== null) { atualizarGrafico(grafico.listaAtual); }
  }
  aplicarTema(lerCookie("tema") || "escuro");

  function mediaGols(j) {
    if (j.jogos === 0) { return 0; }
    return Number((j.gols / j.jogos).toFixed(2));
  }

  function mostrar(texto, tipo) {
    $("#mensagem").text(texto).attr("class", tipo);
  }

  function renderizar() {
    $("#tabelaCorpo").empty();
    let lista = jogadores.slice();
    if (ordenado) {
      lista.sort(function (a, b) { return mediaGols(b) - mediaGols(a); });
    }

    let somaGols = 0;
    let exibidos = 0;
    const listaGrafico = [];

    lista.forEach(function (j) {
      const naBusca = j.nome.toLowerCase().includes(busca.toLowerCase());
      const naPosicao = filtroPosicao === "Todas" || j.posicao === filtroPosicao;
      if (!naBusca || !naPosicao) { return; }

      const linha = $("<tr>").toggleClass("destaque", mediaGols(j) >= LIMITE_DESTAQUE);
      [j.nome, j.posicao, j.jogos, j.gols, mediaGols(j)].forEach(function (valor) {
        linha.append($("<td>").text(valor));
      });
      linha.append($("<td>").append(
        $("<button>").text("X").addClass("btn-remover").attr("data-indice", jogadores.indexOf(j))
      ));
      $("#tabelaCorpo").append(linha);
      somaGols += j.gols;
      exibidos++;
      listaGrafico.push(j);
    });

    let artilheiro = null;
    for (let i = 0; i < jogadores.length; i++) {
      if (artilheiro === null || jogadores[i].gols > artilheiro.gols) {
        artilheiro = jogadores[i];
      }
    }

    const media = exibidos ? (somaGols / exibidos).toFixed(1) : 0;
    const nomeArtilheiro = artilheiro ? artilheiro.nome : "-";
    $("#resumoTexto").text(ESPORTE + ": " + exibidos + " jogadores | " + somaGols +
      " gols | média por jogador: " + media + " | artilheiro: " + nomeArtilheiro);

    atualizarGrafico(listaGrafico);
  }

  $("#busca").on("input", function () {
    busca = $(this).val();
    renderizar();
  });

  $("#filtroPosicao").on("change", function () {
    filtroPosicao = $(this).val();
    renderizar();
  });

  $("#btnOrdenar").on("click", function () {
    ordenado = !ordenado;
    renderizar();
  });

  $("#btnTema").on("click", function () {
    aplicarTema($("body").hasClass("escuro") ? "claro" : "escuro");
  });

  $("#tabelaCorpo").on("click", ".btn-remover", function () {
    jogadores.splice(Number($(this).attr("data-indice")), 1);
    renderizar();
  });

  function lerNumero(texto) {
    const n = Number(texto);
    if (texto === "" || isNaN(n) || n < 0) {
      throw new Error("Número inválido: " + texto);
    }
    return n;
  }

  function adicionar() {
    try {
      const nome = $("#novoNome").val().trim();
      if (nome === "") { throw new Error("Digite o nome do jogador."); }
      const jogos = lerNumero($("#novoJogos").val());
      const gols = lerNumero($("#novoGols").val());
      if (jogos === 0) { throw new Error("O jogador precisa ter ao menos 1 jogo."); }

      jogadores.push({ nome: nome, posicao: $("#novaPosicao").val(), jogos: jogos, gols: gols });
      renderizar();
      mostrar("Jogador adicionado!", "ok");
      $("#novoNome, #novoJogos, #novoGols").val("");
    } catch (erro) {
      mostrar(erro.message, "erro");
    } finally {
      $("#novoNome").focus();
    }
  }
  $("#btnAdicionar").on("click", adicionar);
  $("#novoGols").on("keypress", function (e) {
    if (e.key === "Enter") { adicionar(); }
  });

  $("#btnJson").on("click", function () {
    $.getJSON("jogadores.json")
      .done(function (dados) {
        jogadores = dados;
        renderizar();
        mostrar("JSON carregado: " + dados.length + " jogadores.", "ok");
      })
      .fail(function () {
        mostrar("Falha ao carregar o JSON. Use o Live Server.", "erro");
      });
  });

  $("#btnXml").on("click", function () {
    $.ajax({ url: "jogadores.xml", dataType: "xml" })
      .done(function (xml) {
        jogadores = [];
        $(xml).find("jogador").each(function () {
          jogadores.push({
            nome: $(this).find("nome").text(),
            posicao: $(this).find("posicao").text(),
            jogos: Number($(this).find("jogos").text()),
            gols: Number($(this).find("gols").text())
          });
        });
        renderizar();
        mostrar("XML carregado: " + jogadores.length + " jogadores.", "ok");
      })
      .fail(function () {
        mostrar("Falha ao carregar o XML. Use o Live Server.", "erro");
      });
  });

  $("#btnExportar").on("click", function () {
    const texto = JSON.stringify(jogadores, null, 2);
    $("#saidaJson").text(texto);
    const volta = JSON.parse(texto);
    console.log("Ida e volta OK:", volta.length, "jogadores");
  });

  function corDoTema(nomeVariavel) {
    return getComputedStyle(document.body).getPropertyValue(nomeVariavel).trim();
  }

  function atualizarGrafico(lista) {
    try {
      if (typeof Chart === "undefined") {
        throw new Error("Gráfico indisponível: a biblioteca Chart.js não carregou (sem internet e sem o arquivo chart.umd.min.js).");
      }

      const nomes = lista.map(function (j) { return j.nome; });
      const valores = lista.map(function (j) { return metrica === "gols" ? j.gols : mediaGols(j); });
      const cores = lista.map(function (j) { return mediaGols(j) >= LIMITE_DESTAQUE ? corDoTema("--barra-ouro") : corDoTema("--campo"); });
      const corTexto = corDoTema("--texto");
      const corGrade = "rgba(163, 8, 200, 0.16)";

      if (grafico === null) {
        grafico = new Chart(document.getElementById("graficoGols"), {
          type: "bar",
          data: { labels: [], datasets: [{ label: "Gols", data: [], backgroundColor: [], borderRadius: 10, maxBarThickness: 64 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: {}, grid: {} },
              y: { beginAtZero: true, ticks: {}, grid: {} }
            }
          }
        });
      }

      grafico.listaAtual = lista;
      grafico.data.labels = nomes;
      grafico.data.datasets[0].data = valores;
      grafico.data.datasets[0].backgroundColor = cores;
      grafico.data.datasets[0].label = metrica === "gols" ? "Gols" : "Média de gols por jogo";
      grafico.options.scales.y.ticks.precision = metrica === "gols" ? 0 : 2;
      ["x", "y"].forEach(function (eixo) {
        grafico.options.scales[eixo].ticks.color = corTexto;
        grafico.options.scales[eixo].grid.color = corGrade;
      });
      grafico.update();

      const resumo = lista.map(function (j, i) { return j.nome + " " + valores[i]; }).join(", ");
      $("#graficoGols").attr("aria-label", "Gráfico de " + (metrica === "gols" ? "gols" : "média de gols") + " por jogador: " + (resumo || "sem jogadores"));

      if (lista.length === 0) {
        $("#graficoAviso").text("Nenhum jogador para mostrar no gráfico.").attr("class", "erro");
      } else {
        $("#graficoAviso").text("").attr("class", "");
      }
    } catch (erro) {
      $("#graficoAviso").text(erro.message).attr("class", "erro");
      console.error("[Gráfico]", erro.message);
    }
  }

  $("#btnMetrica").on("click", function () {
    metrica = metrica === "gols" ? "media" : "gols";
    $(this).text(metrica === "gols" ? "Ver média por jogo" : "Ver total de gols")
           .attr("aria-pressed", metrica === "media");
    $("#tituloGrafico").text(metrica === "gols" ? "Gols por jogador" : "Média de gols por jogo");
    renderizar();
  });

  $("#btnJson").trigger("click");

});
