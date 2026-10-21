$(document).ready(function () {
  let total = 0;

  function adicionarAtividade() {
    const atividade = $("#campoAtividade").val().trim();

    if (atividade === "") {
      $("#mensagem").text("Digite uma atividade antes de adicionar.")
                    .attr("class", "erro");
      return;
    }

    const novoItem = $("<li>").text(atividade);
    $("#listaAtividades").append(novoItem);

    total++;
    $("#contador").text("Atividades: " + total);
    $("#mensagem").text("Atividade adicionada!")
                  .attr("class", "ok");
    $("#campoAtividade").val("").focus();
  }

  $("#btnAdicionar").on("click", adicionarAtividade);

  $("#campoAtividade").on("keydown", function (evento) {
    if (evento.key === "Enter") {
      adicionarAtividade();
    }
  });
});
