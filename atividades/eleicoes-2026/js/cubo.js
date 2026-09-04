(() => {
  "use strict";

  const { helpers } = window.CK_ELEICOES;
  const { $ } = helpers;

  const palco = $("[data-cubo]");
  const cubo = $("[data-cubo-corpo]");
  if (!palco || !cubo) return;

  const rotulo = $("[data-cubo-rotulo] span");
  const dica = $("[data-cubo-dica]");
  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const FACES = {
    xml: "Parte 1 — o texto XML guardado em xmlTexto",
    parser: "Parte 1 — o DOMParser transforma o texto em árvore",
    json: "Parte 2 — o recorte JSON no formato do TSE",
    fetch: "Parte 2 — o fetch assíncrono que busca o recorte",
    csv: "Parte 1.1 — a exportação que o Excel abre direto",
    ck: "Conscious Knowledge — autoria do projeto",
  };

  let gx = -18;
  let gy = -28;
  let velocidade = 0.25;
  let arrastando = false;
  let idPonteiro = null;
  let ultimoX = 0;
  let ultimoY = 0;
  let inercia = 0;
  let naTela = true;

  const aplicar = () => {
    cubo.style.setProperty("--gx", `${gx.toFixed(2)}deg`);
    cubo.style.setProperty("--gy", `${gy.toFixed(2)}deg`);
  };

  const faceDaFrente = () => {
    const y = ((gy % 360) + 360) % 360;
    const x = ((gx % 360) + 360) % 360;

    if (x > 50 && x < 130) return "ck";
    if (x > 230 && x < 310) return "csv";

    if (y < 45 || y >= 315) return "xml";
    if (y < 135) return "fetch";
    if (y < 225) return "json";
    return "parser";
  };

  let ultimoRotulo = "";

  const narrar = () => {
    if (!rotulo) return;
    const face = faceDaFrente();
    if (face === ultimoRotulo) return;
    ultimoRotulo = face;
    rotulo.textContent = FACES[face] || "";

    cubo.dataset.faceAtiva = face;
  };

  const passo = () => {
    if (!arrastando && naTela) {
      gy += velocidade + inercia;
      inercia *= 0.94;
      if (Math.abs(inercia) < 0.01) inercia = 0;

      gx += (-18 - gx) * 0.02;

      aplicar();
      narrar();
    }
    requestAnimationFrame(passo);
  };

  const pegar = (e) => {
    arrastando = true;
    idPonteiro = e.pointerId;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    inercia = 0;
    palco.classList.add("is-arrastando");
    palco.setPointerCapture?.(e.pointerId);
    dica?.classList.add("is-oculta");
  };

  const mover = (e) => {
    if (!arrastando || e.pointerId !== idPonteiro) return;

    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;
    ultimoX = e.clientX;
    ultimoY = e.clientY;

    gy += dx * 0.55;

    gx = Math.max(-70, Math.min(70, gx - dy * 0.45));

    inercia = dx * 0.09;
    aplicar();
    narrar();
  };

  const soltar = (e) => {
    if (!arrastando) return;
    arrastando = false;
    palco.classList.remove("is-arrastando");
    palco.releasePointerCapture?.(e.pointerId);
  };

  palco.addEventListener("pointerdown", pegar);
  palco.addEventListener("pointermove", mover);
  palco.addEventListener("pointerup", soltar);
  palco.addEventListener("pointercancel", soltar);
  palco.addEventListener("pointerleave", soltar);

  palco.setAttribute("tabindex", "0");
  palco.setAttribute("role", "img");
  palco.setAttribute(
    "aria-label",
    "Cubo com as seis etapas do dado: XML, DOMParser, JSON, fetch, CSV e a marca Conscious Knowledge. Use as setas para girar."
  );

  palco.addEventListener("keydown", (e) => {
    const passoTecla = 15;
    if (e.key === "ArrowLeft") gy -= passoTecla;
    else if (e.key === "ArrowRight") gy += passoTecla;
    else if (e.key === "ArrowUp") gx = Math.min(70, gx + passoTecla);
    else if (e.key === "ArrowDown") gx = Math.max(-70, gx - passoTecla);
    else return;

    e.preventDefault();
    dica?.classList.add("is-oculta");
    aplicar();
    narrar();
  });

  aplicar();
  narrar();

  if (semMovimento) {
    dica.textContent = "use as setas ou arraste";
  } else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entradas) => { naTela = entradas[0].isIntersecting; },
        { threshold: 0.2 }
      ).observe(palco);
    }
    requestAnimationFrame(passo);
  }

  window.CK_CUBO = { faceDaFrente, definir: (x, y) => { gx = x; gy = y; aplicar(); narrar(); } };
})();
