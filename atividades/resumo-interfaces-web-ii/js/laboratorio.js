if (window.jQuery) {
  $(document).ready(function () {
    let total = 0;
    let proximoId = 1;
    const CHAVE = "ck-revisao-lista";

    function registrar(metodo, detalhe) {
      const item = $("<li>");
      item.append($("<b>").text(metodo)).append(document.createTextNode(" " + detalhe));
      $("#registro").prepend(item);
      $("#registro li").slice(8).remove();
    }

    function atualizarContador() {
      $("#contador").text("Atividades: " + total);
      registrar(".text()", "#contador agora mostra " + total);
    }

    function linhaVazia() {
      if ($("#corpoTabela tr").not(".vazio").length === 0) {
        $("#corpoTabela").html('<tr class="vazio"><td colspan="5">Nenhuma atividade ainda. Que tal a primeira?</td></tr>');
      }
    }

    function salvar() {
      const itens = [];
      $("#corpoTabela tr").not(".vazio").each(function () {
        const linha = $(this);
        itens.push({
          id: linha.data("id"),
          texto: linha.find("td").eq(1).text(),
          parte: linha.find("td").eq(2).text(),
          feita: linha.hasClass("is-feita"),
        });
      });
      try {
        localStorage.setItem(CHAVE, JSON.stringify(itens));
      } catch (erro) {

      }
    }

    function criarLinha(item, animar) {
      $("#corpoTabela .vazio").remove();

      const linha = $("<tr>").attr("data-id", item.id);
      if (item.feita) linha.addClass("is-feita");
      if (animar) linha.addClass("is-nova");

      const botaoFeita = $("<button>")
        .attr({ type: "button", class: "acao", "aria-pressed": String(item.feita) })
        .text(item.feita ? "Desfazer" : "Concluir")
        .attr("aria-label", (item.feita ? "Marcar como pendente: " : "Concluir: ") + item.texto);

      const botaoRemover = $("<button>")
        .attr({ type: "button", class: "acao", "aria-label": "Remover: " + item.texto })
        .text("Remover");

      linha.append($("<td>").text(item.id));
      linha.append($("<td>").text(item.texto));
      linha.append($("<td>").text(item.parte));
      linha.append($("<td>").append($("<span>").addClass("situacao").text(item.feita ? "Feita" : "Pendente")));
      linha.append($("<td>").append($("<div>").addClass("acoes").append(botaoFeita, botaoRemover)));

      $("#corpoTabela").append(linha);
    }

    function adicionarAtividade() {
      const atividade = $("#campoAtividade").val().trim();
      registrar(".val().trim()", '"' + atividade + '"');

      if (atividade === "") {
        $("#mensagem").text("Digite uma atividade antes de adicionar.").attr("class", "mensagem erro");
        $("#campoAtividade").addClass("is-invalido").attr("aria-invalid", "true").focus();
        registrar("if", "campo vazio, a função parou no return");
        setTimeout(function () {
          $("#campoAtividade").removeClass("is-invalido");
        }, 400);
        return;
      }

      const item = { id: proximoId, texto: atividade, parte: $("#campoParte").val(), feita: false };
      proximoId++;
      criarLinha(item, true);
      registrar(".append()", "nova linha no fim da tabela");

      total++;
      atualizarContador();

      $("#mensagem").text("Atividade adicionada!").attr("class", "mensagem ok");
      registrar(".attr()", 'class="mensagem ok"');
      $("#campoAtividade").val("").removeAttr("aria-invalid").focus();
      registrar(".val(\"\").focus()", "campo limpo, cursor de volta");

      if (window.CK && typeof window.CK.novoNo === "function") window.CK.novoNo(atividade);
      salvar();
    }

    $("#btnAdicionar").on("click", adicionarAtividade);

    $("#campoAtividade").on("keydown", function (evento) {
      if (evento.key === "Enter") {
        evento.preventDefault();
        registrar('on("keydown")', "tecla Enter");
        adicionarAtividade();
      }
    });

    $("#formLista").on("submit", function (evento) {
      evento.preventDefault();
    });

    $("#corpoTabela").on("click", ".acao", function () {
      const botao = $(this);
      const linha = botao.closest("tr");
      const texto = linha.find("td").eq(1).text();

      if (botao.text() === "Remover") {
        linha.remove();
        total--;
        atualizarContador();
        registrar(".remove()", "linha apagada");
        $("#mensagem").text("Atividade removida.").attr("class", "mensagem ok");
        linhaVazia();
      } else {
        const feita = !linha.hasClass("is-feita");
        linha.toggleClass("is-feita", feita);
        linha.find(".situacao").text(feita ? "Feita" : "Pendente");
        botao
          .text(feita ? "Desfazer" : "Concluir")
          .attr("aria-pressed", String(feita))
          .attr("aria-label", (feita ? "Marcar como pendente: " : "Concluir: ") + texto);
        registrar(".toggleClass()", feita ? "is-feita adicionada" : "is-feita removida");
      }
      salvar();
    });

    $("#btnLimpar").on("click", function () {
      if (total === 0) {
        $("#mensagem").text("A lista já está vazia.").attr("class", "mensagem erro");
        return;
      }
      $("#corpoTabela tr").not(".vazio").remove();
      total = 0;
      atualizarContador();
      linhaVazia();
      registrar(".remove()", "todas as linhas");
      $("#mensagem").text("Lista limpa.").attr("class", "mensagem ok");
      salvar();
    });

    $(".seletores").on("click", ".chip", function () {
      const seletor = $(this).data("seletor");
      const alvo = $("#laboratorio").find(seletor).not(".vazio");

      $(".realce").removeClass("realce");
      $(".seletores .chip").attr("aria-pressed", "false");
      $(this).attr("aria-pressed", "true");
      alvo.addClass("realce");

      const quantidade = alvo.length;
      let texto = '$("' + seletor + '") encontrou ' + quantidade + (quantidade === 1 ? " elemento." : " elementos.");
      if (seletor === ".erro" && quantidade === 0) {
        texto += " Tente adicionar com o campo vazio: a mensagem ganha a classe erro.";
      }
      $("#resultadoSeletor").text(texto);
      registrar("$()", seletor + " → " + quantidade);

      setTimeout(function () {
        alvo.removeClass("realce");
      }, 2200);
    });

    try {
      const salvos = JSON.parse(localStorage.getItem(CHAVE) || "[]");
      salvos.forEach(function (item) {
        criarLinha(item, false);
        proximoId = Math.max(proximoId, Number(item.id) + 1);
      });
      total = salvos.length;
      $("#contador").text("Atividades: " + total);
    } catch (erro) {

    }
  });
} else {
  document.getElementById("avisoJquery").hidden = false;
}
