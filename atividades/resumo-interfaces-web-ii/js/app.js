(function () {
  "use strict";

  const $id = (id) => document.getElementById(id);
  const CHAVE_DUVIDAS = "ck-revisao-duvidas";
  const CHAVE_MOVIMENTO = "ck-revisao-movimento";
  const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)");

  function esc(texto) {
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function colorir(codigo, linguagem) {
    const padrao = linguagem === "html"
      ? /(<!--[\s\S]*?-->)|("[^"]*")|(<\/?[a-zA-Z][\w-]*|\/?>)/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(const|let|var|function|if|else|return|true|false|new)\b|\b(\d+)\b/g;

    let resultado = "";
    let ultimo = 0;
    for (const achado of codigo.matchAll(padrao)) {
      const [trecho, a, b, c, d] = achado;
      resultado += esc(codigo.slice(ultimo, achado.index));
      let classe = "";
      if (a) classe = "tk-coment";
      else if (b) classe = "tk-texto";
      else if (c) classe = linguagem === "html" ? "tk-tag" : "tk-chave";
      else if (d) classe = "tk-num";
      resultado += `<span class="${classe}">${esc(trecho)}</span>`;
      ultimo = achado.index + trecho.length;
    }
    return resultado + esc(codigo.slice(ultimo));
  }

  function blocoCodigo(codigo, linguagem) {
    const rotulo = linguagem === "html" ? "HTML" : "JavaScript / jQuery";
    return `
      <div class="codigo">
        <div class="codigo__barra"><span>${rotulo}</span>
          <button type="button" class="copiar" data-copiar>Copiar</button></div>
        <pre><code>${colorir(codigo, linguagem)}</code></pre>
      </div>`;
  }

  function lerDuvidas() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_DUVIDAS) || "{}");
    } catch (erro) {
      return {};
    }
  }

  function gravarDuvidas(dados) {
    try {
      localStorage.setItem(CHAVE_DUVIDAS, JSON.stringify(dados));
    } catch (erro) {

    }
  }

  function montarResumos() {
    $id("cartoesJs").innerHTML = RESUMO_JS.map((item, i) => `
      <article class="cartao" data-tilt>
        <span class="cartao__num">${i + 1}</span>
        <h3>${esc(item.titulo)}</h3>
        <p>${esc(item.texto)}</p>
        ${blocoCodigo(item.codigo, item.linguagem)}
      </article>`).join("");

    $id("cartoesIa").innerHTML = RESUMO_IA.map((item, i) => `
      <article class="cartao" data-tilt>
        <span class="cartao__num">${i + 1}</span>
        <h3>${esc(item.titulo)}</h3>
        <p>${esc(item.texto)}</p>
      </article>`).join("");

    const rotulos = { fato: "fato", divergente: "fontes divergem", incerto: "não confirmado" };
    $id("linhaTempo").innerHTML = LINHA_DO_TEMPO.map((item) => `
      <li data-tipo="${item.tipo}">
        <time>${esc(item.data)}<span class="etiqueta">${rotulos[item.tipo]}</span></time>
        ${esc(item.fato)}
      </li>`).join("");
  }

  let filtroAtual = "todas";

  function montarQuestoes() {
    const duvidas = lerDuvidas();

    $id("listaQuestoes").innerHTML = QUESTOES.map((q) => {
      const d = duvidas[q.n];
      const marcada = Boolean(d && d.marcada);
      const fontes = q.fontes.map((chave) => {
        const f = FONTES[chave];
        return f.url
          ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.curta)}<span class="sr"> (abre em nova aba)</span></a>`
          : esc(f.curta);
      }).join("; ");

      return `
        <article class="questao${marcada ? " is-duvida" : ""}" id="q${q.n}" data-n="${q.n}" data-parte="${q.parte}">
          <div class="questao__topo">
            <span class="questao__n" aria-hidden="true">${q.n}</span>
            <h3><span class="sr">Questão ${q.n}. </span><span class="questao__ast" ${marcada ? "" : "hidden"}>* </span><span class="questao__texto">${esc(q.pergunta)}</span></h3>
          </div>
          <div class="questao__resposta">
            <p><strong>Resposta:</strong> <span class="questao__corpo">${esc(q.resposta)}</span></p>
            ${q.codigo ? blocoCodigo(q.codigo, q.codigo.trim().startsWith("<") ? "html" : "js") : ""}
          </div>
          <p class="questao__fontes"><strong>Fonte de pesquisa:</strong> ${fontes}.</p>
          <div class="questao__duvida">
            <div>
              <button type="button" class="botao botao--fantasma botao--pequeno" data-duvida aria-pressed="${marcada}"
                aria-controls="dif${q.n}">${marcada ? "Tirar marca de dúvida" : "Marcar dúvida (*)"}</button>
            </div>
            <div class="campo" ${marcada ? "" : "hidden"}>
              <label for="dif${q.n}">Qual foi a principal dificuldade nesta questão?</label>
              <textarea id="dif${q.n}" data-dificuldade maxlength="400">${esc((d && d.texto) || "")}</textarea>
            </div>
          </div>
        </article>`;
    }).join("");

    aplicarFiltro();
  }

  function aplicarFiltro() {
    const termo = $id("buscaQuestao").value.trim().toLowerCase();
    let visiveis = 0;

    document.querySelectorAll(".questao").forEach((artigo) => {
      const q = QUESTOES.find((item) => item.n === Number(artigo.dataset.n));
      const conteudo = (q.pergunta + " " + q.resposta + " " + q.codigo).toLowerCase();
      const passaParte = filtroAtual === "todas"
        || (filtroAtual === "duvida" ? artigo.classList.contains("is-duvida") : q.parte === filtroAtual);
      const passaBusca = termo === "" || conteudo.includes(termo);
      const mostrar = passaParte && passaBusca;
      artigo.hidden = !mostrar;
      if (mostrar) visiveis++;

      destacar(artigo.querySelector(".questao__texto"), q.pergunta, termo);
      destacar(artigo.querySelector(".questao__corpo"), q.resposta, termo);
    });

    const marcadas = document.querySelectorAll(".questao.is-duvida").length;
    $id("infoQuestoes").textContent =
      `Mostrando ${visiveis} de ${QUESTOES.length} questões` +
      (marcadas ? ` · ${marcadas} marcada(s) com dúvida (*)` : " · nenhuma marcada com dúvida");
  }

  function destacar(elemento, texto, termo) {
    if (!termo) {
      elemento.textContent = texto;
      return;
    }
    const minusculo = texto.toLowerCase();
    let html = "";
    let inicio = 0;
    let posicao = minusculo.indexOf(termo);
    while (posicao !== -1) {
      html += esc(texto.slice(inicio, posicao)) + "<mark>" + esc(texto.slice(posicao, posicao + termo.length)) + "</mark>";
      inicio = posicao + termo.length;
      posicao = minusculo.indexOf(termo, inicio);
    }
    elemento.innerHTML = html + esc(texto.slice(inicio));
  }

  function ligarQuestoes() {
    $id("buscaQuestao").addEventListener("input", aplicarFiltro);

    document.querySelectorAll("[data-filtro]").forEach((botao) => {
      botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;
        document.querySelectorAll("[data-filtro]").forEach((b) => {
          const ativo = b === botao;
          b.classList.toggle("is-ativo", ativo);
          b.setAttribute("aria-pressed", String(ativo));
        });
        aplicarFiltro();
      });
    });

    $id("listaQuestoes").addEventListener("click", (evento) => {
      const botao = evento.target.closest("[data-duvida]");
      if (!botao) return;
      const artigo = botao.closest(".questao");
      const n = artigo.dataset.n;
      const marcada = !artigo.classList.contains("is-duvida");
      const duvidas = lerDuvidas();
      const campo = artigo.querySelector(".questao__duvida .campo");

      artigo.classList.toggle("is-duvida", marcada);
      artigo.querySelector(".questao__ast").hidden = !marcada;
      campo.hidden = !marcada;
      botao.setAttribute("aria-pressed", String(marcada));
      botao.textContent = marcada ? "Tirar marca de dúvida" : "Marcar dúvida (*)";

      duvidas[n] = { marcada, texto: artigo.querySelector("[data-dificuldade]").value };
      gravarDuvidas(duvidas);
      if (marcada) artigo.querySelector("[data-dificuldade]").focus();
      aplicarFiltro();
    });

    $id("listaQuestoes").addEventListener("input", (evento) => {
      if (!evento.target.matches("[data-dificuldade]")) return;
      const n = evento.target.closest(".questao").dataset.n;
      const duvidas = lerDuvidas();
      duvidas[n] = { marcada: true, texto: evento.target.value };
      gravarDuvidas(duvidas);
    });

    $id("btnExportar").addEventListener("click", exportarTexto);
  }

  function exportarTexto() {
    const duvidas = lerDuvidas();
    const linhas = [
      `${IDENTIFICACAO.titulo.toUpperCase()}: ${IDENTIFICACAO.subtitulo}`,
      `${IDENTIFICACAO.escola} · ${IDENTIFICACAO.componente} · Prof. ${IDENTIFICACAO.professor}`,
      `Nome completo: ${IDENTIFICACAO.aluno} · Turma: ${IDENTIFICACAO.turma}`,
      `Entrega: ${IDENTIFICACAO.data}`,
      "",
      "PARTE 3: QUESTIONÁRIO DISSERTATIVO",
      "",
    ];

    QUESTOES.forEach((q) => {
      const d = duvidas[q.n];
      const marcada = d && d.marcada;
      linhas.push(`${q.n}. ${marcada ? "* " : ""}${q.pergunta}`);
      linhas.push(`Resposta: ${q.resposta}`);
      if (q.codigo) linhas.push("Exemplo:", q.codigo);
      linhas.push("Fonte de pesquisa: " + q.fontes.map((c) => FONTES[c].curta + (FONTES[c].url ? ` (${FONTES[c].url})` : "")).join("; "));
      if (marcada) linhas.push(`(*) Principal dificuldade: ${d.texto.trim() || "não descrita"}`);
      linhas.push("");
    });

    linhas.push("REFERÊNCIAS", "");
    referenciasOrdenadas().forEach((f) => linhas.push(f.abnt));

    const arquivo = new Blob([linhas.join("\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(arquivo);
    link.download = "Respostas_Revisao_IWII_Gustavo_Oliveira_dos_Santos.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  const respondidas = {};

  function montarPratica() {
    $id("listaPratica").innerHTML = PRATICA.map((p, i) => `
      <div class="exercicio" data-id="${p.id}">
        <fieldset>
          <legend>${i + 1}. ${esc(p.pergunta)}</legend>
          <div class="opcoes">
            ${p.opcoes.map((op, j) => `<button type="button" class="opcao" data-opcao="${j}">${esc(op)}</button>`).join("")}
          </div>
        </fieldset>
        <p class="exercicio__porque" aria-live="polite"></p>
      </div>`).join("");
    $id("placarTotal").textContent = PRATICA.length;
    atualizarPlacar();
  }

  function atualizarPlacar() {
    const acertos = Object.values(respondidas).filter(Boolean).length;
    $id("placarAcertos").textContent = acertos;
    $id("placarBarra").style.width = (acertos / PRATICA.length) * 100 + "%";
  }

  function ligarPratica() {
    $id("listaPratica").addEventListener("click", (evento) => {
      const botao = evento.target.closest(".opcao");
      if (!botao || botao.disabled) return;
      const caixa = botao.closest(".exercicio");
      const p = PRATICA.find((item) => item.id === caixa.dataset.id);
      const escolha = Number(botao.dataset.opcao);
      const certo = escolha === p.certa;

      caixa.querySelectorAll(".opcao").forEach((b, j) => {
        b.disabled = true;
        if (j === p.certa) b.classList.add("is-certo");
      });
      if (!certo) botao.classList.add("is-errado");

      caixa.querySelector(".exercicio__porque").innerHTML =
        `<b class="${certo ? "ok" : "nao"}">${certo ? "Isso!" : "Quase."}</b> ${esc(p.porque)}`;
      respondidas[p.id] = certo;
      atualizarPlacar();
    });

    $id("btnRefazer").addEventListener("click", () => {
      Object.keys(respondidas).forEach((k) => delete respondidas[k]);
      montarPratica();
      $id("listaPratica").querySelector(".opcao").focus();
    });
  }

  function montarReferencias() {
    const lista = referenciasOrdenadas().map((f) => f.abnt);
    $id("listaReferencias").innerHTML = lista.map((r) => `<li>${esc(r)}</li>`).join("");
  }

  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-copiar]");
    if (!botao) return;
    const texto = botao.closest(".codigo").querySelector("code").textContent;
    const pronto = () => {
      botao.textContent = "Copiado!";
      botao.classList.add("is-copiado");
      setTimeout(() => {
        botao.textContent = "Copiar";
        botao.classList.remove("is-copiado");
      }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(pronto, () => copiarAntigo(texto, pronto));
    } else {
      copiarAntigo(texto, pronto);
    }
  });

  function copiarAntigo(texto, pronto) {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      pronto();
    } catch (erro) {

    }
    area.remove();
  }

  function ligarMenu() {
    const botao = $id("menuBotao");
    const menu = $id("menu");
    botao.addEventListener("click", () => {
      const aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", String(!aberto));
      menu.classList.toggle("is-aberto", !aberto);
    });
    menu.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) {
        botao.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-aberto");
      }
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menu.classList.contains("is-aberto")) {
        botao.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-aberto");
        botao.focus();
      }
    });

    let agendado = false;
    window.addEventListener("scroll", () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        $id("progressoBarra").style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
        agendado = false;
      });
    }, { passive: true });

    const links = [...menu.querySelectorAll("a")];
    if ("IntersectionObserver" in window) {
      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          links.forEach((a) => {
            const atual = a.getAttribute("href") === "#" + entrada.target.id;
            a.classList.toggle("is-atual", atual);
            if (atual) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      document.querySelectorAll("main section[id]").forEach((s) => observador.observe(s));
    }
  }

  function semMovimento() {
    return prefereMenos.matches || document.documentElement.classList.contains("sem-movimento");
  }

  function ligarEfeitos() {
    const cartoes = document.querySelectorAll(".cartao");
    if ("IntersectionObserver" in window && !semMovimento()) {
      const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visivel");
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      cartoes.forEach((c) => obs.observe(c));
    } else {
      cartoes.forEach((c) => c.classList.add("is-visivel"));
    }

    const ponteiroFino = window.matchMedia("(pointer: fine)").matches;
    if (ponteiroFino) {
      document.addEventListener("pointermove", (evento) => {
        if (semMovimento()) return;
        const cartao = evento.target.closest("[data-tilt]");
        if (!cartao) return;
        const r = cartao.getBoundingClientRect();
        const x = (evento.clientX - r.left) / r.width - 0.5;
        const y = (evento.clientY - r.top) / r.height - 0.5;
        cartao.style.setProperty("--ty", (x * 6).toFixed(2) + "deg");
        cartao.style.setProperty("--tx", (-y * 6).toFixed(2) + "deg");
      });
      document.addEventListener("pointerout", (evento) => {
        const cartao = evento.target.closest("[data-tilt]");
        if (cartao && !cartao.contains(evento.relatedTarget)) {
          cartao.style.setProperty("--tx", "0deg");
          cartao.style.setProperty("--ty", "0deg");
        }
      });

      const palco = $id("arvorePalco");
      const arvore = $id("arvore3d");
      palco.addEventListener("pointermove", (evento) => {
        if (semMovimento()) return;
        const r = palco.getBoundingClientRect();
        const x = (evento.clientX - r.left) / r.width - 0.5;
        const y = (evento.clientY - r.top) / r.height - 0.5;
        arvore.style.setProperty("--ry", (-22 + x * 40).toFixed(1) + "deg");
        arvore.style.setProperty("--rx", (14 - y * 24).toFixed(1) + "deg");
      });
      palco.addEventListener("pointerleave", () => {
        arvore.style.setProperty("--ry", "-22deg");
        arvore.style.setProperty("--rx", "14deg");
      });
    }

    document.querySelectorAll(".risco").forEach((carta) => {
      carta.addEventListener("click", () => {
        carta.setAttribute("aria-pressed", String(carta.getAttribute("aria-pressed") !== "true"));
      });
    });
  }

  window.CK = {
    novoNo(texto) {
      const arvore = $id("arvore3d");
      const ul = arvore.querySelector(".no--ul");
      const li = arvore.querySelector(".no--li2");
      li.textContent = "<li>" + (texto.length > 9 ? texto.slice(0, 9) + "…" : texto);
      li.classList.remove("no--novo");
      void li.offsetWidth;
      li.classList.add("no--novo");
      ul.animate && !semMovimento() && ul.animate(
        [{ boxShadow: "0 0 0 0 rgba(255,199,44,0.8)" }, { boxShadow: "0 0 0 18px rgba(255,199,44,0)" }],
        { duration: 700 }
      );
    },
  };

  function ligarMovimento() {
    const botao = $id("btnMovimento");
    const aplicar = (reduzir) => {
      document.documentElement.classList.toggle("sem-movimento", reduzir);
      botao.setAttribute("aria-pressed", String(reduzir));
      botao.textContent = reduzir ? "Ativar animações" : "Reduzir animações";
      document.dispatchEvent(new CustomEvent("ck:movimento", { detail: { reduzir } }));
    };
    let salvo = false;
    try {
      salvo = localStorage.getItem(CHAVE_MOVIMENTO) === "1";
    } catch (erro) {
      salvo = false;
    }
    aplicar(salvo);
    botao.addEventListener("click", () => {
      const reduzir = !document.documentElement.classList.contains("sem-movimento");
      try {
        localStorage.setItem(CHAVE_MOVIMENTO, reduzir ? "1" : "0");
      } catch (erro) {

      }
      aplicar(reduzir);
    });
  }

  montarResumos();
  montarQuestoes();
  ligarQuestoes();
  montarPratica();
  ligarPratica();
  montarReferencias();
  ligarMenu();
  ligarMovimento();
  ligarEfeitos();
})();
