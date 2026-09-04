window.CK = window.CK || {};

CK.ui = (() => {
  "use strict";

  const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
  const $$ = (seletor, contexto = document) => [...contexto.querySelectorAll(seletor)];

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));

  const esc = (valor) =>
    String(valor ?? "").replace(/[&<>"']/g, (caractere) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[caractere]);

  const fmtRelativo = (carimbo) => {
    const minutos = Math.round((Date.now() - carimbo) / 60000);
    if (minutos < 1) return "agora mesmo";
    if (minutos < 60) return `há ${minutos} min`;
    const horas = Math.round(minutos / 60);
    if (horas < 24) return `há ${horas} h`;
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(carimbo);
  };

  const ICONES = {
    mira: '<circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.6"/>',
    estrela: '<path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8Z"/>',
    escudo: '<path d="M12 3l7.5 3v6c0 4.4-3.1 7.9-7.5 9-4.4-1.1-7.5-4.6-7.5-9V6Z"/><path d="m9 12 2 2 4-4"/>',
    espadas: '<path d="M4 4l8 8M20 4l-8 8"/><path d="m14 14 6 6M10 14l-6 6"/><path d="M12 12v0"/>',
    cartas: '<rect x="3" y="6" width="11" height="14" rx="2"/><path d="M9 4h9a2 2 0 0 1 2 2v11"/>',
    elemento: '<path d="M12 3c3.5 4.2 5.5 7 5.5 9.6A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-8.4C6.5 10 8.5 7.2 12 3Z"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    bussola: '<circle cx="12" cy="12" r="8.5"/><path d="m15 9-2 4.6-4.6 2 2-4.6Z"/>',
    grafico: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    mapa: '<path d="m9 4 6 2.4L21 4v14l-6 2.4L9 18l-6 2.4V6.4Z"/><path d="M9 4v14M15 6.4v14"/>',
    moeda: '<ellipse cx="12" cy="7" rx="7.5" ry="3.2"/><path d="M4.5 7v10c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V7"/><path d="M4.5 12c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2"/>',
    engrenagem: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"/>',
  };

  const svg = (nome) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] || ICONES.mais}</svg>`;

  const montarJogos = (caixa) => {
    if (!caixa) return;

    caixa.innerHTML = CK.config.JOGOS.map(({ id, nome, genero, h, icone }) => `
      <button type="button" class="jogo" data-jogo="${esc(id)}" style="--h:${h}"
              role="radio" aria-checked="false">
        <span class="jogo__icone">${svg(icone)}</span>
        <span class="jogo__nome">${esc(nome)}</span>
        <span class="jogo__genero">${esc(genero)}</span>
      </button>`).join("");
  };

  const montarTipos = (caixa) => {
    if (!caixa) return;

    caixa.innerHTML = CK.config.TIPOS.map(({ id, rotulo, icone }, indice) => `
      <button type="button" class="chip${indice === 0 ? " is-ativo" : ""}"
              data-tipo="${esc(id)}" role="radio" aria-checked="${indice === 0}">
        ${svg(icone)}<span>${esc(rotulo)}</span>
      </button>`).join("");
  };

  const montarNiveis = (caixa) => {
    if (!caixa) return;

    caixa.innerHTML = CK.config.NIVEIS.map(({ id, rotulo }, indice) => `
      <button type="button" class="nivel${indice === 0 ? " is-ativo" : ""}"
              data-nivel="${esc(id)}" role="radio" aria-checked="${indice === 0}">
        ${esc(rotulo)}
      </button>`).join("");
  };

  const montarSugestoes = (caixa, tipoId) => {
    if (!caixa) return;

    const lista = CK.config.SUGESTOES[tipoId] ?? [];
    caixa.innerHTML = lista
      .map((frase) => `<button type="button" class="sugestao">${esc(frase)}</button>`)
      .join("");
  };

  const montarEquipe = (caixa) => {
    if (!caixa) return;

    caixa.innerHTML = CK.config.EQUIPE.map(({ nome, papel, lider }) => `
      <article class="membro${lider ? " membro--lider" : ""}" data-tilt>
        <span class="membro__av" aria-hidden="true">${esc(nome.charAt(0))}</span>
        <h3 class="membro__nome">${esc(nome)}</h3>
        <p class="membro__papel">${esc(papel)}</p>
      </article>`).join("");
  };

  const montarTicker = (trilha) => {
    if (!trilha) return;

    const bloco = CK.config.TICKER
      .map((frase) => `<span>${esc(frase)}</span><i>◆</i>`)
      .join("");

    trilha.innerHTML = bloco + bloco;
  };

  const montarMarca3d = (bloco) => {
    if (!bloco) return;

    const CAMADAS = 12;
    const PROFUNDIDADE = 30;

    bloco.innerHTML = Array.from({ length: CAMADAS }, (_, i) => {
      const z = PROFUNDIDADE / 2 - i * (PROFUNDIDADE / (CAMADAS - 1));
      const frente = i === 0;

      return `<img src="assets/logo-ck-remaster.png"
                   alt="${frente ? "Logo Conscious Knowledge" : ""}"
                   class="marca3d__fatia${frente ? " marca3d__fatia--frente" : ""}"
                   style="--i:${i};--z:${z.toFixed(2)}"
                   width="960" height="988" decoding="async"
                   ${frente ? "" : 'aria-hidden="true"'}>`;
    }).join("");
  };

  const montarModelos = (select, lista) => {
    if (!select) return;

    const catalogo = lista?.length ? lista : CK.armazenamento.catalogoModelos();
    const escolhido = CK.armazenamento.lerModelo();

    select.innerHTML = catalogo
      .map(({ id, rotulo }) =>
        `<option value="${esc(id)}"${id === escolhido ? " selected" : ""}>${esc(rotulo || id)}</option>`)
      .join("");
  };

  const enfatizar = (texto) =>
    esc(texto)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

  const formatarResposta = (bruto) => {
    const linhas = String(bruto).split("\n");
    const saida = [];

    let listaAberta = null;
    let paragrafo = [];

    const fecharLista = () => {
      if (listaAberta) {
        saida.push(`</${listaAberta}>`);
        listaAberta = null;
      }
    };

    const fecharParagrafo = () => {
      if (paragrafo.length) {
        saida.push(`<p>${enfatizar(paragrafo.join(" "))}</p>`);
        paragrafo = [];
      }
    };

    const abrirLista = (tipo) => {
      if (listaAberta !== tipo) {
        fecharLista();
        saida.push(`<${tipo}>`);
        listaAberta = tipo;
      }
    };

    linhas.forEach((linhaBruta) => {
      const linha = linhaBruta.trim();

      if (!linha) {
        fecharParagrafo();
        fecharLista();
        return;
      }

      const titulo = linha.match(/^#{1,4}\s+(.*)$/);
      if (titulo) {
        fecharParagrafo();
        fecharLista();
        saida.push(`<h4>${enfatizar(titulo[1])}</h4>`);
        return;
      }

      const marcador = linha.match(/^[-*•]\s+(.*)$/);
      if (marcador) {
        fecharParagrafo();
        abrirLista("ul");
        saida.push(`<li>${enfatizar(marcador[1])}</li>`);
        return;
      }

      const numerado = linha.match(/^\d+[.)]\s+(.*)$/);
      if (numerado) {
        fecharParagrafo();
        abrirLista("ol");
        saida.push(`<li>${enfatizar(numerado[1])}</li>`);
        return;
      }

      const citacao = linha.match(/^>\s*(.*)$/);
      if (citacao) {
        fecharParagrafo();
        fecharLista();
        saida.push(`<blockquote class="destaque">${enfatizar(citacao[1])}</blockquote>`);
        return;
      }

      paragrafo.push(linha);
    });

    fecharParagrafo();
    fecharLista();

    return saida.join("");
  };

  const painel = {
    raiz: null,
    orbe: null,
    legenda: null,

    ligar() {
      this.raiz = $("[data-painel]");
      this.orbe = $("[data-oraculo]");
      this.legenda = $("[data-oraculo-legenda]");
    },

    trocar(estado) {
      if (!this.raiz) return;

      this.raiz.dataset.estado = estado;
      this.raiz.setAttribute("aria-busy", String(estado === "carregando"));

      const mapa = {
        vazio: "[data-estado-vazio]",
        carregando: "[data-estado-carregando]",
        erro: "[data-estado-erro]",
        pronto: "[data-estado-pronto]",
      };

      Object.entries(mapa).forEach(([nome, seletor]) => {
        const bloco = $(seletor, this.raiz);
        if (bloco) bloco.hidden = nome !== estado;
      });

      const rotulos = {
        vazio: "aguardando",
        carregando: "consultando",
        erro: "falhou",
        pronto: "respondido",
      };

      const marcador = $("[data-resposta-estado]", this.raiz);
      if (marcador) marcador.textContent = rotulos[estado];

      if (this.orbe) this.orbe.dataset.estado = estado === "vazio" ? "repouso" : estado;

      const legendas = {
        vazio: "o cajado está em repouso",
        carregando: "o cajado está carregado",
        erro: "a magia falhou",
        pronto: "o pergaminho chegou",
      };

      if (this.legenda) this.legenda.textContent = legendas[estado];
    },

    carregando(passo, progresso) {
      const texto = $("[data-carregando-passo]", this.raiz);
      const barra = $("[data-carregando-barra]", this.raiz);
      if (texto) texto.textContent = passo;
      if (barra) barra.style.width = `${limitar(progresso, 4, 96)}%`;
    },

    erro({ titulo, message, dica, codigo }) {
      $("[data-erro-titulo]", this.raiz).textContent = titulo;
      $("[data-erro-texto]", this.raiz).textContent = message;

      const caixaDica = $("[data-erro-dica]", this.raiz);
      caixaDica.textContent = dica || "";
      caixaDica.hidden = !dica;

      $("[data-erro-codigo]", this.raiz).textContent = codigo || "";
      this.trocar("erro");
    },

    resposta({ texto, descricao, modelo, modo, ms, truncada }) {
      const titulo = $("[data-resposta-titulo]", this.raiz);
      const meta = $("[data-resposta-meta]", this.raiz);
      const corpo = $("[data-resposta-corpo]", this.raiz);

      if (titulo) titulo.textContent = descricao;

      if (meta) {
        const itens = [
          ["fonte", modo === "demo" ? "demonstração local" : "API de IA"],
          ["modelo", modelo],
          ["tempo", `${(ms / 1000).toFixed(1)} s`],
        ];

        if (truncada) itens.push(["aviso", "resposta cortada no limite"]);

        meta.innerHTML = itens
          .map(([chave, valor]) => `<li>${esc(chave)} <b>${esc(valor)}</b></li>`)
          .join("");
      }

      if (corpo) {
        corpo.innerHTML = formatarResposta(texto);
        corpo.scrollTop = 0;

        if (!semMovimento) {
          [...corpo.children].forEach((filho, i) => {
            filho.classList.add("aparece");
            filho.style.animationDelay = `${Math.min(i, 12) * 55}ms`;
          });
        }
      }

      this.trocar("pronto");
    },
  };

  const montarHistorico = (caixa, vazio, botaoLimpar, lista) => {
    if (!caixa) return;

    caixa.innerHTML = lista.map(({ jogo, pergunta, quando }, indice) => `
      <button type="button" class="historico__item" data-historico-indice="${indice}">
        <span class="historico__jogo">${esc(jogo)}</span>
        <span class="historico__pergunta">${esc(pergunta)}</span>
        <span class="historico__quando">${esc(fmtRelativo(quando))}</span>
      </button>`).join("");

    if (vazio) vazio.hidden = lista.length > 0;
    if (botaoLimpar) botaoLimpar.hidden = lista.length === 0;
  };

  let relogioToast;

  const toast = (mensagem) => {
    const caixa = $("[data-toast]");
    if (!caixa) return;

    caixa.textContent = mensagem;
    caixa.classList.add("is-visivel");

    clearTimeout(relogioToast);
    relogioToast = setTimeout(() => caixa.classList.remove("is-visivel"), 2600);
  };

  const tilt = () => {
    if (!temHover || semMovimento) return;

    $$("[data-tilt]").forEach((cartao) => {
      const forca = 9;

      cartao.addEventListener("pointermove", ({ clientX, clientY }) => {
        const retangulo = cartao.getBoundingClientRect();
        const x = (clientX - retangulo.left) / retangulo.width;
        const y = (clientY - retangulo.top) / retangulo.height;

        cartao.style.transform =
          `perspective(900px) rotateX(${(0.5 - y) * forca}deg) ` +
          `rotateY(${(x - 0.5) * forca}deg) translateY(-4px)`;
      });

      cartao.addEventListener("pointerleave", () => {
        cartao.style.transform = "";
        cartao.style.transition = "transform .6s var(--ease)";
        setTimeout(() => (cartao.style.transition = ""), 600);
      });
    });
  };

  const magnetico = () => {
    if (!temHover || semMovimento) return;

    $$("[data-magnetico]").forEach((botao) => {
      botao.addEventListener("pointermove", ({ clientX, clientY }) => {
        const { left, top, width, height } = botao.getBoundingClientRect();
        const dx = clientX - (left + width / 2);
        const dy = clientY - (top + height / 2);
        botao.style.transform = `translate(${dx * 0.15}px, ${dy * 0.22 - 2}px)`;
      });

      botao.addEventListener("pointerleave", () => {
        botao.style.transform = "";
      });
    });
  };

  const parallax = (elemento, maxX, maxY, repousoX = 6, repousoY = -14) => {
    if (!elemento || !temHover || semMovimento) return;

    window.addEventListener("pointermove", ({ clientX, clientY }) => {
      const retangulo = elemento.getBoundingClientRect();
      if (retangulo.bottom < 0 || retangulo.top > window.innerHeight) return;

      const cx = retangulo.left + retangulo.width / 2;
      const cy = retangulo.top + retangulo.height / 2;
      const nx = limitar((clientX - cx) / (window.innerWidth / 2), -1, 1);
      const ny = limitar((clientY - cy) / (window.innerHeight / 2), -1, 1);

      elemento.style.setProperty("--ry", `${repousoY + nx * maxY}deg`);
      elemento.style.setProperty("--rx", `${repousoX - ny * maxX}deg`);
    }, { passive: true });
  };

  const cursor = () => {
    const ponto = $("[data-cursor]");
    const halo = $("[data-cursor-halo]");
    if (!ponto || !halo || !temHover || semMovimento) return;

    const alvo = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const suave = { ...alvo };

    document.body.classList.add("cursor-ativo");

    window.addEventListener("pointermove", ({ clientX, clientY }) => {
      alvo.x = clientX;
      alvo.y = clientY;
      ponto.style.transform = `translate(${clientX - 3.5}px, ${clientY - 3.5}px)`;
    }, { passive: true });

    const seguir = () => {
      suave.x += (alvo.x - suave.x) * 0.16;
      suave.y += (alvo.y - suave.y) * 0.16;
      halo.style.transform = `translate(${suave.x - 19}px, ${suave.y - 19}px)`;
      requestAnimationFrame(seguir);
    };

    requestAnimationFrame(seguir);

    const interativos = "a, button, input, textarea, select, [data-tilt]";

    document.addEventListener("pointerover", ({ target }) => {
      if (target.closest?.(interativos)) document.body.classList.add("cursor-toque");
    });

    document.addEventListener("pointerout", ({ target }) => {
      if (target.closest?.(interativos)) document.body.classList.remove("cursor-toque");
    });
  };

  const revelar = () => {
    const alvos = [
      [".metrica", ""],
      [".consulta", "reveal--esq"],
      [".resposta", "reveal--dir"],
      [".historico__item", ""],
      [".fluxo__bloco", "reveal--gira"],
      [".arq-card", ""],
      [".membro", ""],
      ["main > section:not(.hero) > .secao-topo", ""],
    ];

    const elementos = [];

    alvos.forEach(([seletor, variante]) => {
      $$(seletor).forEach((elemento, i) => {
        if (elemento.classList.contains("reveal")) return;
        elemento.classList.add("reveal");
        if (variante) elemento.classList.add(variante);
        elemento.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
        elementos.push(elemento);
      });
    });

    if (!("IntersectionObserver" in window) || semMovimento) {
      elementos.forEach((elemento) => elemento.classList.add("is-visivel"));
      return;
    }

    const observador = new IntersectionObserver((entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visivel");
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    elementos.forEach((elemento) => observador.observe(elemento));
  };

  const digitar = () => {
    const caixa = $("[data-typed]");
    if (!caixa) return;

    const saida = $(".typed__texto", caixa);
    const palavras = (caixa.dataset.palavras || "").split("|").filter(Boolean);
    if (!saida || !palavras.length) return;

    if (semMovimento) {
      saida.textContent = palavras[0];
      return;
    }

    let indice = 0;
    let letra = 0;
    let apagando = false;

    const passo = () => {
      const palavra = palavras[indice];
      letra += apagando ? -1 : 1;
      saida.textContent = palavra.slice(0, letra);

      let espera = apagando ? 42 : 82;

      if (!apagando && letra === palavra.length) {
        apagando = true;
        espera = 1800;
      } else if (apagando && letra === 0) {
        apagando = false;
        indice = (indice + 1) % palavras.length;
        espera = 300;
      }

      setTimeout(passo, espera);
    };

    passo();
  };

  const contadores = () => {
    $$("[data-contador]").forEach((elemento) => {
      const alvo = Number(elemento.dataset.contador) || 0;

      const animar = () => {
        if (semMovimento || alvo === 0) {
          elemento.textContent = String(alvo);
          return;
        }

        const duracao = 1200;
        const inicio = performance.now();

        const quadro = (agora) => {
          const t = limitar((agora - inicio) / duracao, 0, 1);
          elemento.textContent = String(Math.round(alvo * (1 - (1 - t) ** 3)));
          if (t < 1) requestAnimationFrame(quadro);
        };

        requestAnimationFrame(quadro);
      };

      if (!("IntersectionObserver" in window)) {
        animar();
        return;
      }

      const observador = new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          animar();
          obs.unobserve(entrada.target);
        });
      }, { threshold: 0.5 });

      observador.observe(elemento);
    });
  };

  const cabecalho = () => {
    const topo = $("[data-topo]");
    const nav = $(".topo__nav");
    const alternar = $("[data-nav-toggle]");
    const links = nav ? $$("a[href^='#']", nav) : [];

    const barra = document.createElement("div");
    barra.className = "scroll-progress";
    document.body.appendChild(barra);

    if (alternar && nav) {
      const fechar = () => {
        nav.classList.remove("is-aberto");
        alternar.classList.remove("is-aberto");
        alternar.setAttribute("aria-expanded", "false");
      };

      alternar.addEventListener("click", () => {
        const aberto = nav.classList.toggle("is-aberto");
        alternar.classList.toggle("is-aberto", aberto);
        alternar.setAttribute("aria-expanded", String(aberto));
        alternar.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      });

      links.forEach((link) => link.addEventListener("click", fechar));
      document.addEventListener("keydown", ({ key }) => key === "Escape" && fechar());
    }

    let ultimoY = window.scrollY;
    let agendado = false;

    const aoRolar = () => {
      const y = window.scrollY;

      topo?.classList.toggle("is-rolado", y > 16);

      if (topo && !nav?.classList.contains("is-aberto")) {
        topo.classList.toggle("is-oculto", y > ultimoY && y > 300);
      }

      ultimoY = y;

      const altura = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = `${altura > 0 ? (y / altura) * 100 : 0}%`;
      agendado = false;
    };

    window.addEventListener("scroll", () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(aoRolar);
    }, { passive: true });

    aoRolar();

    const secoes = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);

    if (secoes.length && "IntersectionObserver" in window) {
      const espiao = new IntersectionObserver((entradas) => {
        entradas
          .filter(({ isIntersecting }) => isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach(({ target }) => {
            links.forEach((link) => {
              link.classList.toggle("is-ativo", link.getAttribute("href") === `#${target.id}`);
            });
          });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] });

      secoes.forEach((secao) => espiao.observe(secao));
    }
  };

  const abertura = () => {
    const caixa = $("[data-abertura]");
    if (!caixa) return;

    const aro = $("[data-abertura-aro]", caixa);
    const percent = $("[data-abertura-percent]", caixa);
    const estado = $("[data-abertura-estado]", caixa);
    const titulo = $("[data-abertura-titulo]", caixa);
    const CIRCUNFERENCIA = 2 * Math.PI * 54;

    if (titulo && !semMovimento) {
      titulo.innerHTML = [...titulo.textContent.trim()]
        .map((letra, i) => `<span style="--i:${i}">${letra === " " ? "&nbsp;" : esc(letra)}</span>`)
        .join("");
    }

    const encerrar = () => {
      caixa.classList.add("is-aberta");
      setTimeout(() => {
        caixa.classList.add("is-encerrada");
        caixa.remove();
      }, 1000);
    };

    if (semMovimento) {
      window.addEventListener("load", encerrar, { once: true });
      return;
    }

    const INICIO = performance.now();
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
      setTimeout(encerrar, 280);
    };

    window.addEventListener("load", () => {
      carregou = true;
      teto = 100;
      if (estado) estado.textContent = "pronto";
    }, { once: true });

    setTimeout(finalizar, 6500);

    const avancar = (agora) => {
      if (!vivo) return;

      const dt = Math.min(agora - ultimo, 120);
      ultimo = agora;

      const aproxima = teto + (atual - teto) * 2 ** (-dt / 250);
      atual = Math.min(teto, aproxima + (dt / 1000) * 20);

      if (percent) percent.textContent = String(Math.floor(atual)).padStart(3, "0");
      if (aro) aro.style.strokeDashoffset = String(CIRCUNFERENCIA * (1 - atual / 100));

      const decorrido = agora - INICIO;
      if (carregou && decorrido > 650 && (atual >= 99.4 || decorrido > 2400)) {
        finalizar();
        return;
      }

      requestAnimationFrame(avancar);
    };

    requestAnimationFrame(avancar);
  };

  const ligarEfeitos = () => {
    cabecalho();
    abertura();
    digitar();
    contadores();
    cursor();
    magnetico();
    tilt();
    revelar();
    parallax($("[data-oraculo] .oraculo__cena"), 10, 16, 8, -12);
    parallax($("[data-marca-palco]"), 12, 18, 6, -16);
  };

  return {
    $, $$, esc, semMovimento, temHover,
    montarJogos, montarTipos, montarNiveis, montarSugestoes,
    montarEquipe, montarTicker, montarMarca3d, montarModelos, montarHistorico,
    formatarResposta, painel, toast, ligarEfeitos, tilt,
  };
})();
