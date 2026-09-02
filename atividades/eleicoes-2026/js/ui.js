/* ============================================================================
   CK ELEIÇÕES 2026 — INTERFACE
   Tela de carga animada, revelação ao rolar, contadores, tilt 3D, cursor,
   parallax do palco, faixa de aviso e navegação ativa.
   ========================================================================== */

(() => {
  "use strict";

  const { cargosData, candidatosData, helpers } = window.CK_ELEICOES;
  const { xmlTexto } = window.CK_XML;
  const { $, $$, esc } = helpers;

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const limitar = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ==========================================================================
     1) TELA DE CARGA
     O progresso não é falso: acompanha o carregamento real da página e as
     quatro etapas do boot (XML → parse → cargos → fetch).
     ====================================================================== */

  const carga = $("[data-carga]");

  if (carga) {
    const aro = $("[data-carga-aro]", carga);
    const percent = $("[data-carga-percent]", carga);
    const fase = $("[data-carga-fase]", carga);
    const titulo = $("[data-carga-titulo]", carga);
    const etapas = $$("[data-carga-etapas] li", carga);
    const CIRCUNFERENCIA = 2 * Math.PI * 92;

    const FASES = [
      "lendo xmlTexto",
      "montando a árvore",
      "desenhando cargos",
      "consultando candidatos",
      "pronto",
    ];

    document.body.classList.add("is-travado");

    /* Título letra a letra */
    if (titulo && !semMovimento) {
      const texto = titulo.textContent.trim();
      titulo.innerHTML = [...texto]
        .map((letra, i) => `<span style="--i:${i}">${letra === " " ? "&nbsp;" : esc(letra)}</span>`)
        .join("");
    }

    const encerrar = () => {
      carga.classList.add("is-aberta");
      document.body.classList.remove("is-travado");
      setTimeout(() => {
        carga.classList.add("is-encerrada");
        carga.remove();
      }, 1100);
    };

    if (semMovimento) {
      window.addEventListener("load", encerrar, { once: true });
    } else {
      const INICIO = performance.now();
      const MINIMO = 900;
      const LIMITE = 2600;

      let atual = 0;
      let teto = 90;
      let ultimo = INICIO;
      let vivo = true;

      const marcarEtapa = (indice) => {
        etapas.forEach((li, i) => {
          li.classList.toggle("is-feita", i < indice);
          li.classList.toggle("is-ativa", i === indice);
        });
      };

      const finalizar = () => {
        if (!vivo) return;
        vivo = false;
        if (percent) percent.textContent = "100";
        if (aro) aro.style.strokeDashoffset = "0";
        if (fase) fase.textContent = FASES[4];
        marcarEtapa(etapas.length);
        setTimeout(encerrar, 340);
      };

      window.addEventListener("load", () => {
        teto = 100;
      }, { once: true });

      const passo = (agora) => {
        const delta = Math.min((agora - ultimo) / 1000, 0.1);
        ultimo = agora;
        const decorrido = agora - INICIO;

        /* Avança em direção ao teto, desacelerando perto dele */
        atual += (teto - atual) * delta * 1.9;

        if (decorrido > LIMITE) atual = 100;

        const mostrado = Math.min(Math.floor(atual), 100);

        if (percent) percent.textContent = String(mostrado).padStart(3, "0");
        if (aro) {
          aro.style.strokeDashoffset =
            String(CIRCUNFERENCIA - (CIRCUNFERENCIA * mostrado) / 100);
        }

        const indiceFase = limitar(Math.floor(mostrado / 25), 0, 3);
        if (fase) fase.textContent = FASES[indiceFase];
        marcarEtapa(indiceFase);

        if (mostrado >= 100 && decorrido >= MINIMO) {
          finalizar();
          return;
        }

        requestAnimationFrame(passo);
      };

      requestAnimationFrame(passo);
      setTimeout(finalizar, LIMITE + 700);
    }
  }

  /* ==========================================================================
     2) CONTADORES DO HERO
     ====================================================================== */

  const totalPropostas = candidatosData.reduce((soma, c) => soma + c.propostas.length, 0);

  const VALORES = {
    cargos: cargosData.length,
    candidatos: candidatosData.length,
    propostas: totalPropostas,
    linhas: xmlTexto.trim().split("\n").length,
  };

  const animarNumero = (el, alvo) => {
    if (semMovimento) {
      el.textContent = String(alvo);
      return;
    }

    const DURACAO = 1300;
    const inicio = performance.now();

    const passo = (agora) => {
      const t = limitar((agora - inicio) / DURACAO, 0, 1);
      /* easeOutExpo */
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = String(Math.round(alvo * eased));
      if (t < 1) requestAnimationFrame(passo);
    };

    requestAnimationFrame(passo);
  };

  /* ==========================================================================
     3) REVELAÇÃO AO ROLAR + disparo dos contadores
     ====================================================================== */

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("is-visivel");
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  const observarRevelaveis = () => {
    $$("[data-revelar]:not(.is-visivel)").forEach((el) => observador.observe(el));
  };

  observarRevelaveis();
  document.addEventListener("ck:candidatos-renderizados", () => {
    observarRevelaveis();
    aplicarTilt();
  });

  /* Contadores disparam quando o bloco entra na tela */
  const blocoNumeros = $(".hero__numeros");

  if (blocoNumeros) {
    const obsNumeros = new IntersectionObserver((entradas) => {
      if (!entradas[0].isIntersecting) return;
      $$("[data-contador]", blocoNumeros).forEach((el) => {
        animarNumero(el, VALORES[el.dataset.contador] ?? 0);
      });
      obsNumeros.disconnect();
    }, { threshold: 0.4 });

    obsNumeros.observe(blocoNumeros);
  }

  /* ==========================================================================
     4) TILT 3D NOS CARTÕES
     ====================================================================== */

  const MAX_TILT = 9;

  const ligarTilt = (el) => {
    if (el.dataset.tiltLigado) return;
    el.dataset.tiltLigado = "1";

    const mover = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;

      el.style.transform =
        `perspective(900px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) ` +
        `rotateY(${(px * MAX_TILT).toFixed(2)}deg) translateY(-5px)`;
    };

    const sair = () => {
      el.style.transform = "";
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", sair);
  };

  const aplicarTilt = () => {
    if (!temHover || semMovimento) return;
    $$("[data-tilt]").forEach(ligarTilt);
  };

  aplicarTilt();

  /* ==========================================================================
     5) PARALLAX DO PALCO 3D
     ====================================================================== */

  const camera = $("[data-palco-camera]");

  if (camera && temHover && !semMovimento) {
    window.addEventListener("pointermove", (e) => {
      const r = camera.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = limitar((e.clientX - cx) / (window.innerWidth / 2), -1, 1);
      const ny = limitar((e.clientY - cy) / (window.innerHeight / 2), -1, 1);

      camera.style.setProperty("--ry", `${-18 + nx * 18}deg`);
      camera.style.setProperty("--rx", `${-22 + ny * 10}deg`);
    }, { passive: true });
  }

  /* ==========================================================================
     6) EFEITO DE DIGITAÇÃO
     ====================================================================== */

  const typed = $("[data-typed]");

  if (typed && !semMovimento) {
    const alvo = $(".typed__texto", typed);
    const palavras = typed.dataset.palavras.split("|");

    let iPalavra = 0;
    let iLetra = 0;
    let apagando = false;

    const ciclo = () => {
      const palavra = palavras[iPalavra];

      iLetra += apagando ? -1 : 1;
      alvo.textContent = palavra.slice(0, iLetra);

      let espera = apagando ? 42 : 82;

      if (!apagando && iLetra === palavra.length) {
        apagando = true;
        espera = 1900;
      } else if (apagando && iLetra === 0) {
        apagando = false;
        iPalavra = (iPalavra + 1) % palavras.length;
        espera = 420;
      }

      setTimeout(ciclo, espera);
    };

    ciclo();
  }

  /* ==========================================================================
     7) FAIXA DE AVISO
     ====================================================================== */

  const faixa = $("[data-faixa]");

  if (faixa) {
    const RECADOS = [
      "Projeto acadêmico — sem vínculo com a Justiça Eleitoral",
      "Propostas: resumos editoriais do grupo, não programas oficiais",
      "Dados de candidatura: consulte o TSE · DivulgaCandContas",
      "Parte 1 · XML local lido com DOMParser",
      "Parte 2 · fetch + JSON no formato do TSE",
      "Interface Web II — ETEC Taboão da Serra · 2º C",
    ];

    const bloco = RECADOS
      .map((txt) => `<span class="faixa-aviso__item"><i></i>${esc(txt)}</span>`)
      .join("");

    /* Duplicado para o laço da animação não ter emenda visível */
    faixa.innerHTML = bloco + bloco;
  }

  /* ==========================================================================
     8) CABEÇALHO E NAVEGAÇÃO ATIVA
     ====================================================================== */

  const topo = $("[data-topo]");

  if (topo) {
    const aoRolar = () => topo.classList.toggle("is-fixo", window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
  }

  const secoes = $$("main section[id]");
  const linksNav = $$(".topo__nav a");

  if (secoes.length && linksNav.length) {
    const obsSecao = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const id = entrada.target.id;
        linksNav.forEach((a) => {
          a.classList.toggle("is-ativo", a.getAttribute("href") === `#${id}`);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    secoes.forEach((s) => obsSecao.observe(s));
  }

  /* ==========================================================================
     9) CURSOR PERSONALIZADO
     ====================================================================== */

  const cursor = $("[data-cursor]");
  const halo = $("[data-cursor-halo]");

  if (cursor && halo && temHover && !semMovimento) {
    let alvoX = 0, alvoY = 0, haloX = 0, haloY = 0;

    window.addEventListener("pointermove", (e) => {
      alvoX = e.clientX;
      alvoY = e.clientY;
      cursor.style.transform = `translate(${alvoX}px, ${alvoY}px) translate(-50%, -50%)`;
      cursor.classList.add("is-ativo");
      halo.classList.add("is-ativo");
    }, { passive: true });

    const seguir = () => {
      haloX += (alvoX - haloX) * 0.16;
      haloY += (alvoY - haloY) * 0.16;
      halo.style.transform = `translate(${haloX}px, ${haloY}px) translate(-50%, -50%)`;
      requestAnimationFrame(seguir);
    };

    requestAnimationFrame(seguir);

    document.addEventListener("pointerover", (e) => {
      const interativo = e.target.closest("a, button, select, [data-tilt], .candidato");
      halo.classList.toggle("is-crescido", Boolean(interativo));
    });

    document.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-ativo");
      halo.classList.remove("is-ativo");
    });
  }

  /* ==========================================================================
     10) BOTÕES MAGNÉTICOS
     ====================================================================== */

  if (temHover && !semMovimento) {
    $$("[data-magnetico]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
        el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });

      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }
})();
