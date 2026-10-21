// =========================================================
// Minha Lista de Estudos · Interfaces Web II
// Autor: Gustavo Oliveira dos Santos
//
// PARTE 1: lógica da atividade com jQuery (o que o professor pediu)
// PARTE 2: efeitos visuais do tema CK (não mudam a lógica)
// =========================================================

// Se o jQuery não carregou (sem internet, por exemplo), avisa na tela
// em vez de só mostrar "$ is not defined" no console.
if (!window.jQuery) {
  document.addEventListener("DOMContentLoaded", function () {
    const aviso = document.getElementById("mensagem");
    aviso.textContent = "O jQuery não carregou. Verifique sua conexão com a internet e recarregue a página.";
    aviso.className = "erro";
  });
} else {

  // ---------------------------------------------------------
  // PARTE 1: lógica da atividade
  // ---------------------------------------------------------
  $(document).ready(function () {
    // Guarda quantas atividades já foram adicionadas
    let total = 0;

    // Função que faz todo o trabalho de adicionar uma atividade.
    // Fica separada para ser usada pelo clique E pela tecla Enter,
    // sem repetir o código (pedido do desafio extra).
    function adicionarAtividade() {
      // 1. Captura: pega o texto do campo e tira os espaços das pontas
      const atividade = $("#campoAtividade").val().trim();

      // 2. Validação: se estiver vazio, mostra a mensagem e para aqui
      if (atividade === "") {
        $("#mensagem").text("Digite uma atividade antes de adicionar.")
                      .attr("class", "erro");
        $("#campoAtividade").focus();
        return;
      }

      // 3. Criação: monta um <li> novo e coloca no fim da lista
      const novoItem = $("<li>").text(atividade);
      $("#listaAtividades").append(novoItem);

      // 4. Contador: soma 1 e atualiza o texto na tela
      total++;
      $("#contador").text("Atividades: " + total);

      // 5. Retorno para o usuário e campo limpo para a próxima
      $("#mensagem").text("Atividade adicionada!")
                    .attr("class", "ok");
      $("#campoAtividade").val("").focus();
    }

    // Evento de clique no botão Adicionar
    $("#btnAdicionar").on("click", adicionarAtividade);

    // Desafio extra: adicionar apertando Enter dentro do campo
    $("#campoAtividade").on("keydown", function (evento) {
      if (evento.key === "Enter") {
        adicionarAtividade();
      }
    });
  });
}


// ---------------------------------------------------------
// PARTE 2: efeitos visuais (tema Conscious Knowledge)
// Usa JavaScript puro e só "observa" a página. Se esta parte
// for apagada, a lista continua funcionando igual.
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouseFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const aparelhoModesto = (navigator.hardwareConcurrency || 4) <= 2 ||
                          (navigator.connection && navigator.connection.saveData);

  const painel = document.getElementById("painel");
  const entrada = document.getElementById("entrada");
  const campo = document.getElementById("campoAtividade");
  const botao = document.getElementById("btnAdicionar");
  const mensagem = document.getElementById("mensagem");
  const contador = document.getElementById("contador");

  // --- Cubos 3D no fundo -----------------------------------
  const cena = document.getElementById("cena3d");
  const cubos = [
    { x: "8%",  y: "18%", tam: 70, tempo: 26, dourado: false },
    { x: "84%", y: "12%", tam: 46, tempo: 20, dourado: true  },
    { x: "90%", y: "58%", tam: 84, tempo: 32, dourado: false },
    { x: "4%",  y: "68%", tam: 40, tempo: 18, dourado: true  },
    { x: "70%", y: "82%", tam: 30, tempo: 16, dourado: false },
    { x: "22%", y: "88%", tam: 54, tempo: 24, dourado: false }
  ];
  // Em aparelho mais simples, desenha só metade dos cubos
  const quantidade = aparelhoModesto ? 3 : cubos.length;

  for (let i = 0; i < quantidade; i++) {
    const dados = cubos[i];
    const cubo = document.createElement("div");
    cubo.className = dados.dourado ? "cubo dourado" : "cubo";
    cubo.style.left = dados.x;
    cubo.style.top = dados.y;
    cubo.style.setProperty("--tam", dados.tam + "px");
    cubo.style.setProperty("--tempo", dados.tempo + "s");
    cubo.style.setProperty("--atraso", (-i * 3) + "s");
    cubo.style.setProperty("--cor", dados.dourado ? "rgba(254, 200, 0, .7)" : "rgba(168, 85, 247, .75)");
    for (let f = 0; f < 6; f++) {
      cubo.appendChild(document.createElement("span"));
    }
    cena.appendChild(cubo);
  }

  // --- Painel inclina em 3D seguindo o mouse ----------------
  if (mouseFino && !menosMovimento) {
    let pedido = null;

    painel.addEventListener("pointermove", function (e) {
      const caixa = painel.getBoundingClientRect();
      const px = (e.clientX - caixa.left) / caixa.width;   // 0 a 1
      const py = (e.clientY - caixa.top) / caixa.height;   // 0 a 1

      if (pedido) cancelAnimationFrame(pedido);
      pedido = requestAnimationFrame(function () {
        painel.style.setProperty("--ry", ((px - 0.5) * 8).toFixed(2) + "deg");
        painel.style.setProperty("--rx", ((0.5 - py) * 6).toFixed(2) + "deg");
        painel.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        painel.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
    });

    painel.addEventListener("pointerleave", function () {
      painel.style.setProperty("--rx", "0deg");
      painel.style.setProperty("--ry", "0deg");
    });
  }

  // --- Reage à mensagem: tremida no erro, faíscas no acerto --
  function reiniciarAnimacao(elemento, classe) {
    elemento.classList.remove(classe);
    void elemento.offsetWidth; // força o navegador a recomeçar a animação
    elemento.classList.add(classe);
  }

  function soltarFaiscas() {
    if (menosMovimento) return;
    const caixa = botao.getBoundingClientRect();
    const cores = ["#fec800", "#a855f7", "#c084fc", "#ffd95c"];

    for (let i = 0; i < 14; i++) {
      const faisca = document.createElement("span");
      const angulo = (Math.PI * 2 * i) / 14;
      const distancia = 40 + Math.random() * 50;
      faisca.className = "faisca";
      faisca.style.left = (caixa.left + caixa.width / 2) + "px";
      faisca.style.top = (caixa.top + caixa.height / 2) + "px";
      faisca.style.background = cores[i % cores.length];
      faisca.style.setProperty("--dx", (Math.cos(angulo) * distancia).toFixed(0) + "px");
      faisca.style.setProperty("--dy", (Math.sin(angulo) * distancia).toFixed(0) + "px");
      faisca.style.setProperty("--giro", (Math.random() * 360).toFixed(0) + "deg");
      document.body.appendChild(faisca);
      faisca.addEventListener("animationend", function () {
        faisca.remove();
      });
    }
  }

  // O MutationObserver avisa sempre que o texto da mensagem muda.
  // Como a mesma mensagem pode se repetir, observa também o "class".
  new MutationObserver(function () {
    if (mensagem.className === "erro") {
      campo.setAttribute("aria-invalid", "true");
      if (!menosMovimento) reiniciarAnimacao(entrada, "tremer");
    } else if (mensagem.className === "ok") {
      campo.removeAttribute("aria-invalid");
      soltarFaiscas();
    }
  }).observe(mensagem, { childList: true, characterData: true, subtree: true, attributes: true });

  // Quando a pessoa volta a digitar, o campo deixa de ficar marcado como inválido
  campo.addEventListener("input", function () {
    campo.removeAttribute("aria-invalid");
  });

  new MutationObserver(function () {
    if (!menosMovimento) reiniciarAnimacao(contador, "pulo");
  }).observe(contador, { childList: true });

  // --- Na impressão, abre todas as respostas ----------------
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll(".pergunta").forEach(function (item) {
      item.open = true;
    });
  });
});
