(() => {
  "use strict";

  const { candidatosData, helpers } = window.CK_ELEICOES;
  const { $, $$ } = helpers;

  const urna = $("[data-urna3d]");
  if (!urna) return;

  const tela = $(".urna3d__tela", urna);
  const elCargo = $("[data-urna-cargo]", urna);
  const elDigitos = $("[data-urna-digitos]", urna);
  const elNome = $("[data-urna-nome]", urna);
  const elPartido = $("[data-urna-partido]", urna);
  const elFoto = $("[data-urna-foto]", urna);
  const elInstrucao = $("[data-urna-instrucao]", urna);

  const teclas = new Map(
    $$("[data-tecla]", urna).map((t) => [t.dataset.tecla, t])
  );

  const VAZIO = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const montarRoteiro = () => {
    const porCargo = new Map();

    candidatosData.forEach((c) => {
      if (!porCargo.has(c.cargo)) porCargo.set(c.cargo, []);
      porCargo.get(c.cargo).push(c);
    });

    const roteiro = [];
    let rodada = 0;
    let achouAlgum = true;

    while (achouAlgum) {
      achouAlgum = false;
      porCargo.forEach((lista) => {
        if (lista[rodada]) {
          roteiro.push(lista[rodada]);
          achouAlgum = true;
        }
      });
      rodada += 1;
    }

    return roteiro;
  };

  const roteiro = montarRoteiro();
  if (!roteiro.length) return;

  let naTela = true;
  let abaVisivel = true;
  let parado = false;

  const podeRodar = () => naTela && abaVisivel && !parado;

  const esperar = (ms) => new Promise((resolve) => {
    let restante = ms;
    let ultimo = performance.now();

    const tique = (agora) => {
      if (parado) return resolve();
      if (podeRodar()) restante -= agora - ultimo;
      ultimo = agora;
      if (restante <= 0) return resolve();
      requestAnimationFrame(tique);
    };

    requestAnimationFrame(tique);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entradas) => { naTela = entradas[0].isIntersecting; },
      { threshold: 0.15 }
    ).observe(urna);
  }

  document.addEventListener("visibilitychange", () => {
    abaVisivel = !document.hidden;
  });

  const acender = async (chave, ms = 190) => {
    const tecla = teclas.get(chave);
    if (!tecla) return;
    tecla.classList.add("is-apertada");
    await esperar(ms);
    tecla.classList.remove("is-apertada");
  };

  const limparTela = () => {
    tela.classList.remove("is-revelada", "is-fim");
    elDigitos.innerHTML = "";
    elNome.textContent = "";
    elPartido.textContent = "";
    elInstrucao.textContent = "";
    elInstrucao.classList.remove("is-piscando");
    elFoto.src = VAZIO;
  };

  const prepararDigitos = (quantidade) => {
    elDigitos.innerHTML = Array.from(
      { length: quantidade },
      () => '<span class="urna3d__digito"></span>'
    ).join("");
    return $$(".urna3d__digito", elDigitos);
  };

  const votar = async (candidato) => {
    limparTela();

    elCargo.textContent = candidato.cargo;
    elInstrucao.textContent = "digite o número";
    await esperar(700);

    const numero = String(candidato.numero);
    const casas = prepararDigitos(numero.length);

    for (let i = 0; i < numero.length; i += 1) {
      if (parado) return;
      const digito = numero[i];
      acender(digito);
      casas[i].textContent = digito;
      casas[i].classList.add("is-cheio");
      await esperar(360);
    }

    await esperar(320);
    elNome.textContent = candidato.nome;
    elPartido.textContent = candidato.partido;
    elFoto.src = candidato.foto;
    elFoto.alt = "";
    tela.classList.add("is-revelada");

    elInstrucao.textContent = "aperte confirma";
    elInstrucao.classList.add("is-piscando");
    await esperar(1500);

    if (parado) return;

    elInstrucao.classList.remove("is-piscando");
    await acender("confirma", 420);

    tela.classList.add("is-fim");
    elInstrucao.textContent = "voto registrado";
    await esperar(1400);

    tela.classList.remove("is-fim");
    await esperar(420);
  };

  const rodar = async () => {
    let i = 0;
    while (!parado) {
      await votar(roteiro[i % roteiro.length]);
      i += 1;
    }
  };

  if (semMovimento) {
    const c = roteiro[0];
    elCargo.textContent = c.cargo;
    const casas = prepararDigitos(String(c.numero).length);
    [...String(c.numero)].forEach((d, i) => {
      casas[i].textContent = d;
      casas[i].classList.add("is-cheio");
    });
    elNome.textContent = c.nome;
    elPartido.textContent = c.partido;
    elFoto.src = c.foto;
    elInstrucao.textContent = "aperte confirma";
    tela.classList.add("is-revelada");
  } else {
    rodar();
  }

  window.addEventListener("pagehide", () => { parado = true; });
})();
