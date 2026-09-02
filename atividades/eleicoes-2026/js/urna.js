/* ============================================================================
   CK ELEIÇÕES 2026 — A URNA 3D VOTANDO
   ----------------------------------------------------------------------------
   A urna do hero não é enfeite: ela executa uma votação de verdade, em laço,
   com dados lidos do XML da Parte 1.

   Cada volta do laço faz o que uma urna real faz:

     1. mostra o cargo na tela
     2. digita o número dígito a dígito, acendendo a tecla correspondente
     3. revela nome, partido e foto do candidato
     4. pisca a instrução e aperta CONFIRMA
     5. mostra FIM
     6. limpa e passa para o próximo

   A animação pausa sozinha quando a urna sai da tela ou quando a aba perde o
   foco, e nem começa se o usuário pedir menos movimento.
   ========================================================================== */

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

  /* Um pixel transparente serve de estado "sem foto": deixar a <img> sem
     src faria o navegador tratá-la como imagem quebrada. */
  const VAZIO = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     O roteiro: um candidato de cada cargo, na ordem em que aparecem no XML.
     Assim a urna passa por Presidente, Governador, Senador e os dois
     deputados antes de repetir alguém.
     -------------------------------------------------------------------- */
  const montarRoteiro = () => {
    const porCargo = new Map();

    candidatosData.forEach((c) => {
      if (!porCargo.has(c.cargo)) porCargo.set(c.cargo, []);
      porCargo.get(c.cargo).push(c);
    });

    const roteiro = [];
    let rodada = 0;
    let achouAlgum = true;

    /* Intercala: 1º de cada cargo, depois 2º de cada cargo, e assim por diante */
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

  /* --------------------------------------------------------------------------
     Controle de execução: pausa fora da tela e com a aba escondida
     -------------------------------------------------------------------- */
  let naTela = true;
  let abaVisivel = true;
  let parado = false;

  const podeRodar = () => naTela && abaVisivel && !parado;

  /* Espera que só conta o tempo enquanto a urna está visível: se o usuário
     rolar para longe, a animação congela no ponto em que estava. */
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

  /* --------------------------------------------------------------------------
     Peças da animação
     -------------------------------------------------------------------- */
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

  /* Desenha as casas vazias do número, para o dígito ter onde cair */
  const prepararDigitos = (quantidade) => {
    elDigitos.innerHTML = Array.from(
      { length: quantidade },
      () => '<span class="urna3d__digito"></span>'
    ).join("");
    return $$(".urna3d__digito", elDigitos);
  };

  /* --------------------------------------------------------------------------
     Uma votação completa
     -------------------------------------------------------------------- */
  const votar = async (candidato) => {
    limparTela();

    elCargo.textContent = candidato.cargo;
    elInstrucao.textContent = "digite o número";
    await esperar(700);

    /* 1) Digita o número, acendendo a tecla de cada dígito */
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

    /* 2) Revela a ficha do candidato */
    await esperar(320);
    elNome.textContent = candidato.nome;
    elPartido.textContent = candidato.partido;
    elFoto.src = candidato.foto;
    elFoto.alt = "";
    tela.classList.add("is-revelada");

    /* 3) Pede confirmação */
    elInstrucao.textContent = "aperte confirma";
    elInstrucao.classList.add("is-piscando");
    await esperar(1500);

    if (parado) return;

    /* 4) CONFIRMA */
    elInstrucao.classList.remove("is-piscando");
    await acender("confirma", 420);

    /* 5) FIM */
    tela.classList.add("is-fim");
    elInstrucao.textContent = "voto registrado";
    await esperar(1400);

    /* 6) Limpa e respira antes do próximo */
    tela.classList.remove("is-fim");
    await esperar(420);
  };

  /* --------------------------------------------------------------------------
     O laço
     -------------------------------------------------------------------- */
  const rodar = async () => {
    let i = 0;
    while (!parado) {
      await votar(roteiro[i % roteiro.length]);
      i += 1;
    }
  };

  if (semMovimento) {
    /* Sem animação: a urna mostra uma ficha parada, já preenchida */
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
