/* ============================================================================
   CK ELEIÇÕES 2026 — O CUBO DE DADOS
   ----------------------------------------------------------------------------
   Um cubo 3D com as seis etapas do caminho do dado na atividade. Ele gira
   sozinho, mas o usuário pode agarrar e girar com o mouse ou com o dedo —
   ao soltar, o giro automático volta a partir de onde parou.

   A rotação é aplicada em duas variáveis CSS (--gx e --gy) escritas aqui,
   então o CSS cuida da aparência e o JavaScript só cuida do ângulo.
   ========================================================================== */

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

  /* O que cada face representa, na ordem em que aparece ao girar */
  const FACES = {
    xml: "Parte 1 — o texto XML guardado em xmlTexto",
    parser: "Parte 1 — o DOMParser transforma o texto em árvore",
    json: "Parte 2 — o recorte JSON no formato do TSE",
    fetch: "Parte 2 — o fetch assíncrono que busca o recorte",
    csv: "Parte 1.1 — a exportação que o Excel abre direto",
    ck: "Conscious Knowledge — autoria do projeto",
  };

  /* --------------------------------------------------------------------------
     Estado da rotação
     -------------------------------------------------------------------- */
  let gx = -18;   /* inclinação (eixo X) */
  let gy = -28;   /* giro (eixo Y)       */
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

  /* Descobre qual face está virada para o observador.

     Girar o cubo em rotateY(+90deg) traz para a frente a face que está
     posicionada em rotateY(-90deg) — ou seja, a face "esq". O mesmo vale
     para rotateX: inclinar +90deg mostra a face que mora em rotateX(-90deg),
     a "base". Por isso os quadrantes abaixo apontam para a face oposta. */
  const faceDaFrente = () => {
    const y = ((gy % 360) + 360) % 360;
    const x = ((gx % 360) + 360) % 360;

    /* Muito inclinado: quem aparece é o topo ou a base */
    if (x > 50 && x < 130) return "ck";    /* base, a face da marca */
    if (x > 230 && x < 310) return "csv";  /* topo */

    if (y < 45 || y >= 315) return "xml";  /* frente */
    if (y < 135) return "fetch";           /* esq */
    if (y < 225) return "json";            /* trás */
    return "parser";                       /* dir */
  };

  let ultimoRotulo = "";

  const narrar = () => {
    if (!rotulo) return;
    const face = faceDaFrente();
    if (face === ultimoRotulo) return;
    ultimoRotulo = face;
    rotulo.textContent = FACES[face] || "";

    /* Marca a face ativa, para o CSS poder destacá-la */
    cubo.dataset.faceAtiva = face;
  };

  /* --------------------------------------------------------------------------
     Giro automático
     -------------------------------------------------------------------- */
  const passo = () => {
    if (!arrastando && naTela) {
      /* A inércia do arrasto se soma ao giro base e vai morrendo */
      gy += velocidade + inercia;
      inercia *= 0.94;
      if (Math.abs(inercia) < 0.01) inercia = 0;

      /* Volta devagar para a inclinação de repouso */
      gx += (-18 - gx) * 0.02;

      aplicar();
      narrar();
    }
    requestAnimationFrame(passo);
  };

  /* --------------------------------------------------------------------------
     Arrasto
     -------------------------------------------------------------------- */
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
    /* A inclinação tem limite, senão o cubo capota e fica ilegível */
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

  /* --------------------------------------------------------------------------
     Ligações

     A interação vale sempre — quem pede menos movimento não está pedindo
     menos controle. O que o prefers-reduced-motion desliga é só o giro
     automático: o cubo fica parado até alguém girá-lo.
     -------------------------------------------------------------------- */
  palco.addEventListener("pointerdown", pegar);
  palco.addEventListener("pointermove", mover);
  palco.addEventListener("pointerup", soltar);
  palco.addEventListener("pointercancel", soltar);
  palco.addEventListener("pointerleave", soltar);

  /* Teclado: setas giram o cubo, para quem não usa mouse */
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
    /* Parado numa pose que mostra três faces; segue girável na mão */
    dica.textContent = "use as setas ou arraste";
  } else {
    /* Pausa o giro automático quando o cubo sai da tela */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entradas) => { naTela = entradas[0].isIntersecting; },
        { threshold: 0.2 }
      ).observe(palco);
    }
    requestAnimationFrame(passo);
  }

  /* Exposto só para os testes conferirem o mapeamento de faces */
  window.CK_CUBO = { faceDaFrente, definir: (x, y) => { gx = x; gy = y; aplicar(); narrar(); } };
})();
