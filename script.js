(() => {
  "use strict";

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

  const esc = (valor) =>
    String(valor ?? "").replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));

  const paraData = (iso) => {
    const [a, m, d] = String(iso || "").split("-").map(Number);
    return a && m && d ? new Date(a, m - 1, d) : null;
  };

  const fmtLongo = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const fmtCurto = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const semAcento = (texto) =>
    String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const hexParaRgb = (hex) => {
    const limpo = String(hex || "").trim().replace("#", "");
    const cheio = limpo.length === 3
      ? limpo.split("").map((c) => c + c).join("")
      : limpo;

    if (!/^[0-9a-f]{6}$/i.test(cheio)) return "168, 85, 247";

    const n = parseInt(cheio, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  };

  const estiloAcento = (cor) =>
    `--acento:${esc(cor || "#a855f7")};--acento-rgb:${hexParaRgb(cor)}`;

  const ROTULO_ESTADO = {
    pronta: "Pronta",
    andamento: "Em andamento",
    apresentada: "Apresentada",
  };

  const atividades = (Array.isArray(window.ACERVO_CK) ? window.ACERVO_CK : [])
    .map((item) => {
      const data = paraData(item.data);
      return {
        ...item,
        _data: data,
        _dataLonga: data ? fmtLongo.format(data) : "",
        _dataCurta: data ? fmtCurto.format(data).replace(".", "") : "",
        _busca: semAcento([
          item.titulo, item.subtitulo, item.disciplina, item.tipo,
          item.resumo, (item.tags || []).join(" "), (item.destaques || []).join(" "),
        ].join(" ")),
      };
    })
    .sort((a, b) => (b._data?.getTime() || 0) - (a._data?.getTime() || 0));

  const disciplinas = [...new Set(atividades.map((a) => a.disciplina).filter(Boolean))];

  const grade = $("[data-grade]");

  const ICONE_RECURSO = {
    app: '<path d="M3 5h18v14H3z"/><path d="M3 9h18"/><circle cx="6" cy="7" r=".6"/>',
    slides: '<rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M12 16v4M8 20h8"/>',
    doc: '<path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    codigo: '<path d="m9 17-5-5 5-5M15 7l5 5-5 5"/>',
    link: '<path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/>',
  };

  const svgRecurso = (nome) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONE_RECURSO[nome] || ICONE_RECURSO.link}</svg>`;

  const recursosDe = (item) => {
    if (Array.isArray(item.recursos) && item.recursos.length) return item.recursos;
    return [{ rotulo: "Abrir atividade", href: item.href, tipo: item.tipo, icone: "link" }];
  };

  const montarRecursos = (item) => {
    const lista = recursosDe(item);

    return `
      <ul class="ficha__recursos">
        ${lista.map(({ rotulo, href, tipo, icone, baixar }, i) => `
          <li>
            <a class="recurso${i === 0 ? " recurso--principal" : ""}"
               href="${esc(href)}"${baixar ? " download" : ""}>
              <span class="recurso__icone" aria-hidden="true">${svgRecurso(icone)}</span>
              <span class="recurso__texto">
                <strong>${esc(rotulo)}</strong>
                ${tipo ? `<small>${esc(tipo)}</small>` : ""}
              </span>
              <svg class="recurso__seta" viewBox="0 0 24 24" aria-hidden="true">
                ${baixar
                  ? '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14"/>'
                  : '<path d="M5 12h14M13 6l6 6-6 6"/>'}
              </svg>
            </a>
          </li>`).join("")}
      </ul>`;
  };

  const montarFicha = (item) => `
    <article class="ficha" style="${estiloAcento(item.cor)}"
             data-disciplina="${esc(item.disciplina)}" data-tilt>
      <div class="ficha__topo">
        <span class="ficha__selo" aria-hidden="true">${esc(item.sigla || "CK")}</span>
        <span class="ficha__rotulos">
          <span class="ficha__disciplina">${esc(item.disciplina)}</span>
          <span class="ficha__data">${esc(item._dataLonga)}</span>
        </span>
        <span class="ficha__estado" data-estado="${esc(item.status || "pronta")}">
          <i aria-hidden="true"></i>${esc(ROTULO_ESTADO[item.status] || "Pronta")}
        </span>
      </div>

      <h3>${esc(item.titulo)}</h3>
      ${item.subtitulo ? `<p class="ficha__subtitulo">${esc(item.subtitulo)}</p>` : ""}
      ${item.resumo ? `<p class="ficha__resumo">${esc(item.resumo)}</p>` : ""}

      ${(item.destaques || []).length ? `
      <ul class="ficha__destaques">
        ${item.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}
      </ul>` : ""}

      ${(item.tags || []).length ? `
      <ul class="ficha__tags">
        ${item.tags.map((t) => `<li>${esc(t)}</li>`).join("")}
      </ul>` : ""}

      ${montarRecursos(item)}

      <div class="ficha__rodape">
        <span class="ficha__tipo">${esc(item.tipo || "")}</span>
        <span class="ficha__contagem">
          ${recursosDe(item).length} ${recursosDe(item).length === 1 ? "arquivo" : "arquivos"}
        </span>
      </div>
    </article>`;

  const fichaVagaGrade = `
    <article class="ficha ficha--vaga" data-vaga aria-hidden="true">
      <i>+</i>
      <strong>Próxima atividade</strong>
      <p>O espaço já está guardado — é só a próxima entrega chegar.</p>
    </article>`;

  if (grade) {
    grade.innerHTML = atividades.map(montarFicha).join("") + fichaVagaGrade;
  }

  const caixaFiltros = $("[data-filtros]");

  if (caixaFiltros) {
    const botoes = [
      `<button type="button" class="filtro is-ativo" data-filtro="todas">
         Todas<span class="filtro__n">${atividades.length}</span>
       </button>`,
      ...disciplinas.map((d) => {
        const n = atividades.filter((a) => a.disciplina === d).length;
        return `<button type="button" class="filtro" data-filtro="${esc(d)}">
                  ${esc(d)}<span class="filtro__n">${n}</span>
                </button>`;
      }),
    ];
    caixaFiltros.innerHTML = botoes.join("");
  }

  const campoBusca = $("[data-busca]");
  const avisoVazio = $("[data-vazio]");
  const contagem = $("[data-contagem]");
  let filtroAtivo = "todas";

  const aplicarFiltros = () => {
    if (!grade) return;

    const termo = semAcento(campoBusca?.value.trim() || "");
    let visiveis = 0;

    $$(".ficha:not([data-vaga])", grade).forEach((card, i) => {
      const item = atividades[i];
      if (!item) return;

      const casaDisciplina = filtroAtivo === "todas" || item.disciplina === filtroAtivo;
      const casaBusca = !termo || item._busca.includes(termo);
      const mostrar = casaDisciplina && casaBusca;

      card.classList.toggle("is-oculta", !mostrar);
      if (mostrar) visiveis += 1;
    });

    const vaga = $("[data-vaga]", grade);
    if (vaga) vaga.classList.toggle("is-oculta", !!termo || filtroAtivo !== "todas");

    if (avisoVazio) avisoVazio.hidden = visiveis > 0;

    if (contagem) {
      const total = atividades.length;
      contagem.textContent = visiveis === total
        ? `${total} ${total === 1 ? "atividade arquivada" : "atividades arquivadas"}`
        : `${visiveis} de ${total} ${total === 1 ? "atividade" : "atividades"}`;
    }
  };

  caixaFiltros?.addEventListener("click", (e) => {
    const botao = e.target.closest(".filtro");
    if (!botao) return;

    filtroAtivo = botao.dataset.filtro;
    $$(".filtro", caixaFiltros).forEach((b) => b.classList.toggle("is-ativo", b === botao));
    aplicarFiltros();
  });

  campoBusca?.addEventListener("input", aplicarFiltros);

  $("[data-limpar]")?.addEventListener("click", () => {
    filtroAtivo = "todas";
    if (campoBusca) campoBusca.value = "";
    $$(".filtro", caixaFiltros).forEach((b, i) => b.classList.toggle("is-ativo", i === 0));
    aplicarFiltros();
  });

  aplicarFiltros();

  const animarNumero = (el, alvo) => {
    if (semMovimento || alvo === 0) {
      el.textContent = String(alvo);
      return;
    }

    const duracao = 1200;
    const inicio = performance.now();

    const passo = (agora) => {
      const t = limitar((agora - inicio) / duracao, 0, 1);
      el.textContent = String(Math.round(alvo * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(passo);
    };

    requestAnimationFrame(passo);
  };

  $$("[data-contador-acervo]").forEach((el) => {
    const chave = el.dataset.contadorAcervo;

    if (chave === "ultima") {
      el.textContent = atividades[0]?._dataCurta || "—";
      return;
    }

    const alvo = chave === "disciplinas" ? disciplinas.length : atividades.length;

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entradas, o) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          animarNumero(el, alvo);
          o.unobserve(entrada.target);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    } else {
      animarNumero(el, alvo);
    }
  });

  const ticker = $("[data-ticker]");

  if (ticker) {
    const frases = [
      "Acervo CK",
      "Arquivo de atividades",
      "2º C · M-Tec Informática para Internet",
      "ETEC Taboão da Serra",
      ...atividades.map((a) => `${a.disciplina} · ${a.titulo}`),
    ];
    const bloco = frases.map((f) => `<span>${esc(f)}</span><i>◆</i>`).join("");

    ticker.innerHTML = bloco + bloco;
  }

  const palcoVitrine = $("[data-vitrine]");
  const anelVitrine = $("[data-vitrine-anel]");

  if (palcoVitrine && anelVitrine) {
    const vagas = Math.max(6, atividades.length + 1);
    const passoAng = 360 / vagas;

    const calcularRaio = () => {
      const largura = anelVitrine.getBoundingClientRect().width || 220;
      return Math.round((largura / 2) / Math.tan(Math.PI / vagas) + largura * 0.18);
    };

    let raio = calcularRaio();

    const fichaCheia = (item, i) => `
      <a class="vitrine-ficha" href="${esc(item.href)}"
         style="--a:${i * passoAng}deg;--r:${raio}px;${estiloAcento(item.cor)}">
        <span class="vitrine-ficha__selo" aria-hidden="true">${esc(item.sigla || "CK")}</span>
        <span class="vitrine-ficha__disciplina">${esc(item.disciplina)}</span>
        <h3>${esc(item.titulo)}</h3>
        <span class="vitrine-ficha__data">${esc(item._dataLonga)}</span>
        <span class="vitrine-ficha__acao">
          Abrir
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>`;

    const fichaVaga = (i) => `
      <div class="vitrine-ficha vitrine-ficha--vaga" style="--a:${i * passoAng}deg;--r:${raio}px"
           aria-hidden="true">
        <i>+</i>
        <span>Próxima atividade</span>
      </div>`;

    anelVitrine.innerHTML = Array.from({ length: vagas }, (_, i) =>
      atividades[i] ? fichaCheia(atividades[i], i) : fichaVaga(i)
    ).join("");

    let ajustando;
    window.addEventListener("resize", () => {
      clearTimeout(ajustando);
      ajustando = setTimeout(() => {
        raio = calcularRaio();
        $$(".vitrine-ficha", anelVitrine).forEach((f) => {
          f.style.setProperty("--r", `${raio}px`);
        });
      }, 180);
    });

    const rotulo = $("[data-vitrine-rotulo]");
    let angulo = 0;
    let alvo = null;
    let arrastando = false;
    let pausado = false;
    let inicioX = 0;
    let anguloInicial = 0;
    let ultimoQuadro = performance.now();
    let frenteAtual = -1;

    const indiceNaFrente = () => {
      const bruto = Math.round(-angulo / passoAng) % vagas;
      return (bruto + vagas) % vagas;
    };

    const atualizarRotulo = () => {
      const i = indiceNaFrente();
      if (i === frenteAtual || !rotulo) return;
      frenteAtual = i;
      const item = atividades[i];
      rotulo.textContent = item ? item.titulo : "Espaço reservado";
    };

    const quadro = (agora) => {
      const dt = Math.min((agora - ultimoQuadro) / 1000, 0.05);
      ultimoQuadro = agora;

      if (alvo !== null) {
        angulo += (alvo - angulo) * Math.min(dt * 6, 1);
        if (Math.abs(alvo - angulo) < 0.05) {
          angulo = alvo;
          alvo = null;
        }
      } else if (!arrastando && !pausado && !semMovimento) {
        angulo += dt * 7;
      }

      anelVitrine.style.setProperty("--gy", `${angulo}deg`);
      atualizarRotulo();
      requestAnimationFrame(quadro);
    };

    requestAnimationFrame(quadro);

    palcoVitrine.addEventListener("pointerdown", (e) => {
      arrastando = true;
      alvo = null;
      inicioX = e.clientX;
      anguloInicial = angulo;
      palcoVitrine.classList.add("is-arrastando");
      palcoVitrine.setPointerCapture?.(e.pointerId);
    });

    palcoVitrine.addEventListener("pointermove", (e) => {
      if (!arrastando) return;
      angulo = anguloInicial + (e.clientX - inicioX) * 0.35;
    });

    const soltar = (e) => {
      if (!arrastando) return;
      arrastando = false;
      palcoVitrine.classList.remove("is-arrastando");
      palcoVitrine.releasePointerCapture?.(e.pointerId);

      alvo = Math.round(angulo / passoAng) * passoAng;
    };

    palcoVitrine.addEventListener("pointerup", soltar);
    palcoVitrine.addEventListener("pointercancel", soltar);

    if (temHover) {
      palcoVitrine.addEventListener("pointerenter", () => { pausado = true; });
      palcoVitrine.addEventListener("pointerleave", () => { pausado = false; });
    }

    const girarPara = (delta) => {
      const base = alvo ?? Math.round(angulo / passoAng) * passoAng;
      alvo = base + delta * passoAng;
    };

    $("[data-vitrine-anterior]")?.addEventListener("click", () => girarPara(-1));
    $("[data-vitrine-proxima]")?.addEventListener("click", () => girarPara(1));
  }

  const MARCAS = {
    origem: {
      src: "assets/logo-ck.png",
      alt: "Logo original Conscious Knowledge",
      w: 720,
      h: 1080,
    },
    futuro: {
      src: "assets/logo-ck-remaster.png",
      alt: "Logo remasterizada Conscious Knowledge",
      w: 1080,
      h: 720,
    },
  };

  $$("[data-duo-astro]").forEach((astro) => {
    const marca = MARCAS[astro.dataset.duoAstro];
    if (!marca) return;

    const CAMADAS = 12;
    const PROFUNDIDADE = 30;
    const partes = [];

    for (let i = 0; i < CAMADAS; i += 1) {
      const z = (PROFUNDIDADE / 2) - (i * (PROFUNDIDADE / (CAMADAS - 1)));
      const frente = i === 0 ? " duo3d__fatia--frente" : "";

      partes.push(
        `<img src="${marca.src}" alt="${i === 0 ? marca.alt : ""}"
              class="duo3d__fatia${frente}" style="--i:${i};--z:${z.toFixed(2)}"
              width="${marca.w}" height="${marca.h}" decoding="async"${i === 0 ? "" : ' aria-hidden="true"'}>`
      );
    }

    astro.innerHTML = partes.join("");
  });

  const parallax3d = (el, maxX, maxY, repousoX = 6, repousoY = -18) => {
    if (!el || !temHover || semMovimento) return;

    window.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = limitar((e.clientX - cx) / (window.innerWidth / 2), -1, 1);
      const ny = limitar((e.clientY - cy) / (window.innerHeight / 2), -1, 1);

      el.style.setProperty("--ry", `${repousoY + nx * maxY}deg`);
      el.style.setProperty("--rx", `${repousoX - ny * maxX}deg`);
    }, { passive: true });
  };

  parallax3d($("[data-duo-palco]"), 12, 18, 8, -14);

  const abertura = $("[data-abertura]");

  if (abertura) {
    const aro = $("[data-abertura-aro]", abertura);
    const percent = $("[data-abertura-percent]", abertura);
    const estado = $("[data-abertura-estado]", abertura);
    const titulo = $("[data-abertura-titulo]", abertura);
    const eclipse = $("[data-abertura-eclipse]", abertura);
    const CIRCUNFERENCIA = 2 * Math.PI * 54;

    const moverEclipse = (progresso) => {
      if (eclipse) eclipse.style.setProperty("--eclipse", progresso.toFixed(3));
    };

    if (titulo && !semMovimento) {
      const texto = titulo.textContent.trim();
      titulo.innerHTML = [...texto]
        .map((letra, i) =>
          `<span style="--i:${i}">${letra === " " ? "&nbsp;" : esc(letra)}</span>`
        )
        .join("");
    }

    const encerrar = () => {
      abertura.classList.add("is-aberta");
      setTimeout(() => {
        abertura.classList.add("is-encerrada");
        abertura.remove();
      }, 1100);
    };

    if (semMovimento) {
      moverEclipse(1);
      window.addEventListener("load", encerrar, { once: true });
    } else {
      const INICIO = performance.now();
      const MINIMO = 700;
      const LIMITE = 2600;

      let atual = 0;
      let teto = 88;
      let carregou = false;
      let ultimo = INICIO;
      let vivo = true;

      const finalizar = () => {
        if (!vivo) return;
        vivo = false;
        if (percent) percent.textContent = "100";
        if (aro) aro.style.strokeDashoffset = "0";
        moverEclipse(1);
        setTimeout(encerrar, 300);
      };

      window.addEventListener("load", () => {
        carregou = true;
        teto = 100;
        if (estado) estado.textContent = "pronto";
      }, { once: true });

      setTimeout(finalizar, 7000);

      const avancar = (agora) => {
        if (!vivo) return;

        const dt = Math.min(agora - ultimo, 120);
        ultimo = agora;

        const aproxima = teto + (atual - teto) * Math.pow(2, -dt / 260);
        atual = Math.min(teto, aproxima + (dt / 1000) * 18);

        if (percent) percent.textContent = String(Math.floor(atual)).padStart(3, "0");
        if (aro) aro.style.strokeDashoffset = String(CIRCUNFERENCIA * (1 - atual / 100));
        moverEclipse(atual / 100);

        const decorrido = agora - INICIO;
        if (carregou && decorrido > MINIMO && (atual >= 99.4 || decorrido > LIMITE)) {
          finalizar();
          return;
        }

        requestAnimationFrame(avancar);
      };

      requestAnimationFrame(avancar);
    }
  }

  const header = $("body > header");
  const nav = header && $("nav", header);
  const navLinks = nav ? $$("a[href^='#']", nav) : [];
  const secoes = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  let toggle = null;

  if (header && nav) {
    toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span>";
    header.appendChild(toggle);

    const fecharMenu = () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const aberto = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", aberto);
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    navLinks.forEach((link) => link.addEventListener("click", fecharMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fecharMenu();
    });
  }

  const progresso = document.createElement("div");
  progresso.className = "scroll-progress";
  document.body.appendChild(progresso);

  let ultimoY = window.scrollY;
  let esperando = false;

  const aoRolar = () => {
    const y = window.scrollY;

    header?.classList.toggle("is-scrolled", y > 20);

    if (header && !nav?.classList.contains("is-open")) {
      header.classList.toggle("is-hidden", y > ultimoY && y > 320);
    }
    ultimoY = y;

    const alturaDoc = document.documentElement.scrollHeight - window.innerHeight;
    progresso.style.width = `${alturaDoc > 0 ? (y / alturaDoc) * 100 : 0}%`;
    esperando = false;
  };

  window.addEventListener("scroll", () => {
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(aoRolar);
  }, { passive: true });

  aoRolar();

  if (secoes.length && "IntersectionObserver" in window) {
    const marcarAtivo = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("is-ativo", link.getAttribute("href") === `#${id}`);
      });
    };

    const espiao = new IntersectionObserver((entradas) => {
      entradas
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .forEach((e) => marcarAtivo(e.target.id));
    }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] });

    secoes.forEach((s) => espiao.observe(s));
  }

  const alvosReveal = [
    ["#inicio .hero-metrics .metric-card", ""],
    [".painel", ""],
    [".ficha", ""],
    [".vitrine-palco", "reveal--zoom"],
    [".vitrine-controles", ""],
    [".sobre-grade article", "reveal--esq"],
    [".pilar", "reveal--dir"],
    [".fluxo__passo", ""],
    [".titulo-bloco", ""],
    ["main > section > header", ""],
  ];

  const elementosReveal = [];

  alvosReveal.forEach(([sel, variante]) => {
    $$(sel).forEach((el, i) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      if (variante) el.classList.add(variante);
      el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
      elementosReveal.push(el);
    });
  });

  if ("IntersectionObserver" in window && !semMovimento) {
    const obsReveal = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    elementosReveal.forEach((el) => obsReveal.observe(el));
  } else {
    elementosReveal.forEach((el) => el.classList.add("is-visible"));
  }

  const telaFluxo = $("[data-fluxo]");

  if (telaFluxo && !semMovimento) {
    const ctx = telaFluxo.getContext("2d", { alpha: true });
    const ponteiro = { x: -9999, y: -9999 };
    let particulas = [];
    let largura = 0;
    let altura = 0;
    let animando = true;
    let tempo = 0;

    const CORES = ["168, 85, 247", "192, 132, 252", "254, 200, 0"];

    const campo = (x, y, t) => {
      const a = Math.sin(x * 0.0016 + t) + Math.cos(y * 0.0019 - t * 0.8);
      const b = Math.sin((x + y) * 0.0011 + t * 1.4);
      return (a + b * 0.6) * Math.PI;
    };

    const nascer = () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vida: 60 + Math.random() * 220,
      idade: 0,
      velocidade: 0.35 + Math.random() * 0.85,
      cor: CORES[Math.random() < 0.12 ? 2 : Math.random() < 0.5 ? 0 : 1],
      espessura: Math.random() < 0.2 ? 1.5 : 0.8,
    });

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = window.innerWidth;
      altura = window.innerHeight;

      telaFluxo.width = Math.floor(largura * dpr);
      telaFluxo.height = Math.floor(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const quantidade = limitar(Math.round((largura * altura) / 11000), 40, 150);
      particulas = Array.from({ length: quantidade }, nascer);
    };

    const desenhar = () => {
      if (!animando) return;

      tempo += 0.0016;

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.055)";
      ctx.fillRect(0, 0, largura, altura);

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particulas.length; i += 1) {
        const p = particulas[i];
        const anterior = { x: p.x, y: p.y };
        const angulo = campo(p.x, p.y, tempo);

        p.x += Math.cos(angulo) * p.velocidade;
        p.y += Math.sin(angulo) * p.velocidade;

        const dx = p.x - ponteiro.x;
        const dy = p.y - ponteiro.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 150) {
          const forca = (150 - dist) / 150 * 1.6;
          p.x += (dx / (dist || 1)) * forca;
          p.y += (dy / (dist || 1)) * forca;
        }

        p.idade += 1;

        const foraDaTela = p.x < -20 || p.x > largura + 20 || p.y < -20 || p.y > altura + 20;
        if (p.idade > p.vida || foraDaTela) {
          particulas[i] = nascer();
          continue;
        }

        const t = p.idade / p.vida;
        const alpha = Math.sin(t * Math.PI) * 0.42;

        ctx.strokeStyle = `rgba(${p.cor}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = p.espessura;
        ctx.beginPath();
        ctx.moveTo(anterior.x, anterior.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(desenhar);
    };

    dimensionar();
    requestAnimationFrame(desenhar);

    let redimensionando;
    window.addEventListener("resize", () => {
      clearTimeout(redimensionando);
      redimensionando = setTimeout(dimensionar, 180);
    });

    window.addEventListener("pointermove", (e) => {
      ponteiro.x = e.clientX;
      ponteiro.y = e.clientY;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      ponteiro.x = -9999;
      ponteiro.y = -9999;
    });

    document.addEventListener("visibilitychange", () => {
      animando = !document.hidden;
      if (animando) requestAnimationFrame(desenhar);
    });
  }

  const cursor = $("[data-cursor]");
  const halo = $("[data-cursor-halo]");

  if (cursor && halo && temHover && !semMovimento) {
    const alvoCursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const suave = { ...alvoCursor };

    document.body.classList.add("cursor-ativo");

    window.addEventListener("pointermove", (e) => {
      alvoCursor.x = e.clientX;
      alvoCursor.y = e.clientY;
      cursor.style.transform = `translate(${e.clientX - 3.5}px, ${e.clientY - 3.5}px)`;
    }, { passive: true });

    const seguir = () => {
      suave.x += (alvoCursor.x - suave.x) * 0.16;
      suave.y += (alvoCursor.y - suave.y) * 0.16;
      halo.style.transform = `translate(${suave.x - 19}px, ${suave.y - 19}px)`;
      requestAnimationFrame(seguir);
    };

    requestAnimationFrame(seguir);

    const interativos = "a, button, input, [data-tilt], .vitrine-palco, .vitrine-ficha";

    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(interativos)) document.body.classList.add("cursor-toque");
    });

    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(interativos)) document.body.classList.remove("cursor-toque");
    });
  }

  if (temHover && !semMovimento) {
    $$("[data-tilt]").forEach((card) => {
      const intensidade = 9;

      const mover = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;

        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
        card.style.transform =
          `perspective(900px) rotateX(${(0.5 - y) * intensidade}deg) ` +
          `rotateY(${(x - 0.5) * intensidade}deg) translateY(-4px)`;
      };

      const sair = () => {
        card.style.transform = "";
        card.style.transition = "transform .6s var(--ease)";
        setTimeout(() => (card.style.transition = ""), 600);
      };

      card.addEventListener("pointermove", mover);
      card.addEventListener("pointerleave", sair);
    });
  }

  if (temHover && !semMovimento) {
    $$("[data-magnetico]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.16}px, ${dy * 0.24 - 2}px)`;
      });

      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  const typed = $("[data-typed]");

  if (typed) {
    const saida = $(".typed__texto", typed);
    const palavras = (typed.dataset.palavras || "").split("|").filter(Boolean);

    if (saida && palavras.length) {
      if (semMovimento) {
        saida.textContent = palavras[0];
      } else {
        let indice = 0;
        let letra = 0;
        let apagando = false;

        const passo = () => {
          const palavra = palavras[indice];
          letra += apagando ? -1 : 1;
          saida.textContent = palavra.slice(0, letra);

          let espera = apagando ? 45 : 85;

          if (!apagando && letra === palavra.length) {
            apagando = true;
            espera = 1900;
          } else if (apagando && letra === 0) {
            apagando = false;
            indice = (indice + 1) % palavras.length;
            espera = 320;
          }

          setTimeout(passo, espera);
        };

        passo();
      }
    }
  }
})();
