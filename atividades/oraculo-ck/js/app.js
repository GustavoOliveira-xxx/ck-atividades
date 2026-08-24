/* ============================================================================
   ORÁCULO CK — app.js
   O maestro. Guarda o estado da consulta, escuta os eventos da interface e
   liga o formulário (ui.js) à API (api.js), passando pelo prompt (prompt.js)
   e pelo armazenamento local (armazenamento.js).
   ========================================================================== */

(() => {
  "use strict";

  const { $, esc, toast, painel } = CK.ui;
  const { JOGOS, TIPOS, NIVEIS, PASSOS_CARGA } = CK.config;

  /* ==========================================================================
     ESTADO
     ======================================================================== */

  const estado = {
    jogoId: null,
    jogoLivre: "",
    tipoId: TIPOS[0].id,
    nivelId: NIVEIS[0].id,
    modo: CK.armazenamento.temChave() ? "api" : "demo",
    ocupado: false,
    ultima: null,
  };

  /* ---------- referências do DOM ---------- */
  const el = {
    form: $("[data-form]"),
    jogos: $("[data-jogos]"),
    jogoLivre: $("[data-jogo-livre]"),
    jogoOutro: $("[data-jogo-outro]"),
    tipos: $("[data-tipos]"),
    niveis: $("[data-niveis]"),
    pergunta: $("[data-pergunta]"),
    contador: $("[data-contador-texto]"),
    sugestoes: $("[data-sugestoes]"),
    enviar: $("[data-enviar]"),
    cancelar: $("[data-cancelar]"),
    avisoModo: $("[data-aviso-modo]"),
    historico: $("[data-historico]"),
    historicoVazio: $("[data-historico-vazio]"),
    limparHistorico: $("[data-limpar-historico]"),
    dlg: $("[data-dlg-chave]"),
    abrirChave: $("[data-abrir-chave]"),
    inputChave: $("[data-input-chave]"),
    inputModelo: $("[data-input-modelo]"),
    salvarChave: $("[data-salvar-chave]"),
    apagarChave: $("[data-apagar-chave]"),
    dlgEstado: $("[data-dlg-estado]"),
    seloTexto: $("[data-selo-texto]"),
    copiar: $("[data-copiar]"),
    nova: $("[data-nova]"),
  };

  /* ==========================================================================
     AJUDANTES DE ESTADO
     ======================================================================== */

  const jogoAtual = () => {
    const encontrado = JOGOS.find(({ id }) => id === estado.jogoId);
    if (!encontrado) return "";
    return encontrado.id === "outro" ? estado.jogoLivre.trim() : encontrado.nome;
  };

  const tipoAtual = () => TIPOS.find(({ id }) => id === estado.tipoId) ?? TIPOS[0];
  const nivelAtual = () => NIVEIS.find(({ id }) => id === estado.nivelId) ?? NIVEIS[0];

  const atualizarSelo = () => {
    const temChave = CK.armazenamento.temChave();
    estado.modo = temChave ? "api" : "demo";

    if (el.abrirChave) el.abrirChave.dataset.modo = estado.modo;
    if (el.seloTexto) el.seloTexto.textContent = temChave ? "API ligada" : "Modo demo";

    if (el.avisoModo) {
      el.avisoModo.innerHTML = temChave
        ? "Conectado à API de IA. A chave fica só neste navegador."
        : '<b>Modo demonstração:</b> respostas locais de exemplo. Configure a chave para consultar a IA de verdade.';
    }
  };

  /* ==========================================================================
     MONTAGEM INICIAL
     ======================================================================== */

  const montar = () => {
    CK.ui.montarJogos(el.jogos);
    CK.ui.montarTipos(el.tipos);
    CK.ui.montarNiveis(el.niveis);
    CK.ui.montarSugestoes(el.sugestoes, estado.tipoId);
    CK.ui.montarEquipe($("[data-equipe]"));
    CK.ui.montarTicker($("[data-ticker]"));
    CK.ui.montarMarca3d($("[data-marca-bloco]"));
    CK.ui.montarModelos(el.inputModelo);
    CK.cena.iniciar($("[data-runas]"));

    painel.ligar();
    painel.trocar("vazio");

    if (el.inputModelo) el.inputModelo.value = CK.armazenamento.lerModelo();

    atualizarSelo();
    desenharHistorico();
  };

  /* ==========================================================================
     EVENTOS DO FORMULÁRIO
     ======================================================================== */

  const ligarFormulario = () => {
    // ---------- escolha do jogo ----------
    el.jogos?.addEventListener("click", ({ target }) => {
      const botao = target.closest(".jogo");
      if (!botao) return;

      estado.jogoId = botao.dataset.jogo;

      CK.ui.$$(".jogo", el.jogos).forEach((outro) => {
        const ativo = outro === botao;
        outro.classList.toggle("is-ativo", ativo);
        outro.setAttribute("aria-checked", String(ativo));
      });

      const livre = estado.jogoId === "outro";
      if (el.jogoLivre) el.jogoLivre.hidden = !livre;
      if (livre) el.jogoOutro?.focus();
    });

    el.jogoOutro?.addEventListener("input", ({ target }) => {
      estado.jogoLivre = target.value;
    });

    // ---------- tipo de conselho ----------
    el.tipos?.addEventListener("click", ({ target }) => {
      const botao = target.closest(".chip");
      if (!botao) return;

      estado.tipoId = botao.dataset.tipo;

      CK.ui.$$(".chip", el.tipos).forEach((outro) => {
        const ativo = outro === botao;
        outro.classList.toggle("is-ativo", ativo);
        outro.setAttribute("aria-checked", String(ativo));
      });

      CK.ui.montarSugestoes(el.sugestoes, estado.tipoId);
    });

    // ---------- nível ----------
    el.niveis?.addEventListener("click", ({ target }) => {
      const botao = target.closest(".nivel");
      if (!botao) return;

      estado.nivelId = botao.dataset.nivel;

      CK.ui.$$(".nivel", el.niveis).forEach((outro) => {
        const ativo = outro === botao;
        outro.classList.toggle("is-ativo", ativo);
        outro.setAttribute("aria-checked", String(ativo));
      });
    });

    // ---------- sugestões ----------
    el.sugestoes?.addEventListener("click", ({ target }) => {
      const botao = target.closest(".sugestao");
      if (!botao || !el.pergunta) return;

      el.pergunta.value = botao.textContent.trim();
      el.pergunta.dispatchEvent(new Event("input"));
      el.pergunta.focus();
    });

    // ---------- contador do textarea ----------
    el.pergunta?.addEventListener("input", ({ target }) => {
      const { length } = target.value;
      if (el.contador) el.contador.textContent = String(length);
      target.closest(".caixa-texto")?.classList.toggle("is-cheio", length > 360);
    });

    // Ctrl+Enter envia
    el.pergunta?.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) {
        evento.preventDefault();
        el.form?.requestSubmit();
      }
    });

    // ---------- envio ----------
    el.form?.addEventListener("submit", (evento) => {
      evento.preventDefault();
      consultar();
    });

    el.cancelar?.addEventListener("click", () => {
      CK.api.cancelar();
      toast("Consulta cancelada.");
    });

    // ---------- ações do painel ----------
    el.copiar?.addEventListener("click", async () => {
      if (!estado.ultima) return;

      try {
        await navigator.clipboard.writeText(estado.ultima.texto);
        toast("Resposta copiada.");
      } catch {
        toast("Não foi possível copiar — selecione e copie manualmente.");
      }
    });

    el.nova?.addEventListener("click", () => {
      painel.trocar("vazio");
      el.pergunta?.focus();
    });

    $("[data-erro-repetir]")?.addEventListener("click", () => consultar());
    $("[data-erro-chave]")?.addEventListener("click", () => abrirDialogo());
    $("[data-erro-demo]")?.addEventListener("click", () => consultar("demo"));
  };

  /* ==========================================================================
     FLUXO DA CONSULTA
     ======================================================================== */

  let relogioPassos;

  const animarCarga = () => {
    let passo = 0;

    const avancar = () => {
      const progresso = ((passo + 1) / PASSOS_CARGA.length) * 92;
      painel.carregando(PASSOS_CARGA[passo], progresso);
      passo = Math.min(passo + 1, PASSOS_CARGA.length - 1);
      relogioPassos = setTimeout(avancar, 900 + Math.random() * 700);
    };

    avancar();
  };

  const pararCarga = () => clearTimeout(relogioPassos);

  const travarBotoes = (ocupado) => {
    estado.ocupado = ocupado;

    if (el.enviar) {
      el.enviar.classList.toggle("is-ocupado", ocupado);
      el.enviar.disabled = ocupado;
      $(".btn__rotulo", el.enviar).textContent = ocupado
        ? "Consultando…"
        : "Consultar o Oráculo";
    }

    if (el.cancelar) el.cancelar.hidden = !ocupado;
  };

  const consultar = async (modoForcado) => {
    if (estado.ocupado) return;

    const jogo = jogoAtual();
    const pergunta = el.pergunta?.value.trim() ?? "";
    const { valido, motivo } = CK.prompt.validar({ jogo, pergunta });

    if (!valido) {
      toast(motivo);
      if (!jogo) el.jogos?.scrollIntoView({ block: "center", behavior: "smooth" });
      else el.pergunta?.focus();
      return;
    }

    const tipo = tipoAtual();
    const nivel = nivelAtual();
    const modo = modoForcado ?? estado.modo;

    travarBotoes(true);
    painel.trocar("carregando");
    animarCarga();

    try {
      const resultado = await CK.api.consultar({
        jogo,
        tipo,
        nivel,
        pergunta,
        modo,
        modelo: CK.armazenamento.lerModelo(),
      });

      pararCarga();
      painel.carregando("pronto", 100);

      estado.ultima = resultado;

      painel.resposta({
        ...resultado,
        descricao: CK.prompt.descrever({ jogo, tipo, nivel }),
      });

      CK.armazenamento.adicionarHistorico({
        jogo,
        jogoId: estado.jogoId,
        tipoId: tipo.id,
        nivelId: nivel.id,
        pergunta,
      });

      desenharHistorico();
    } catch (bruto) {
      pararCarga();

      // Qualquer falha inesperada também precisa virar uma mensagem legível.
      const erro = bruto instanceof CK.api.ErroOraculo ? bruto : new CK.api.ErroOraculo({
        codigo: "FALHA_INTERNA",
        titulo: "Erro inesperado na aplicação",
        mensagem: bruto?.message || "Algo quebrou no meio do caminho.",
        dica: "Recarregue a página e tente de novo. Se continuar, abra o console do navegador.",
      });

      painel.erro(erro);

      if (erro.codigo === "SEM_CHAVE") {
        // Sem chave configurada: o caminho mais curto é abrir o diálogo.
        setTimeout(abrirDialogo, 400);
      }
    } finally {
      travarBotoes(false);
    }
  };

  /* ==========================================================================
     HISTÓRICO
     ======================================================================== */

  const desenharHistorico = () => {
    const lista = CK.armazenamento.lerHistorico();
    CK.ui.montarHistorico(el.historico, el.historicoVazio, el.limparHistorico, lista);
  };

  const ligarHistorico = () => {
    el.historico?.addEventListener("click", ({ target }) => {
      const botao = target.closest("[data-historico-indice]");
      if (!botao) return;

      const lista = CK.armazenamento.lerHistorico();
      const registro = lista[Number(botao.dataset.historicoIndice)];
      if (!registro) return;

      // repõe a consulta no formulário
      const { jogoId, tipoId, nivelId, pergunta, jogo } = registro;

      const cartao = CK.ui.$$(".jogo", el.jogos)
        .find((botaoJogo) => botaoJogo.dataset.jogo === jogoId);
      cartao?.click();

      if (jogoId === "outro" && el.jogoOutro) {
        el.jogoOutro.value = jogo;
        estado.jogoLivre = jogo;
      }

      CK.ui.$$(".chip", el.tipos)
        .find((chip) => chip.dataset.tipo === tipoId)?.click();

      CK.ui.$$(".nivel", el.niveis)
        .find((nivel) => nivel.dataset.nivel === nivelId)?.click();

      if (el.pergunta) {
        el.pergunta.value = pergunta;
        el.pergunta.dispatchEvent(new Event("input"));
      }

      el.form?.scrollIntoView({ block: "start", behavior: "smooth" });
      toast("Consulta restaurada no formulário.");
    });

    el.limparHistorico?.addEventListener("click", () => {
      CK.armazenamento.limparHistorico();
      desenharHistorico();
      toast("Histórico apagado.");
    });
  };

  /* ==========================================================================
     DIÁLOGO DA CHAVE
     ======================================================================== */

  const dizerNoDialogo = (mensagem, tom = "neutro") => {
    if (!el.dlgEstado) return;
    el.dlgEstado.textContent = mensagem;
    el.dlgEstado.dataset.tom = tom;
  };

  const abrirDialogo = () => {
    if (!el.dlg) return;

    if (el.inputChave) el.inputChave.value = CK.armazenamento.lerChave();
    if (el.inputModelo) el.inputModelo.value = CK.armazenamento.lerModelo();

    dizerNoDialogo(
      CK.armazenamento.temChave()
        ? "Chave guardada neste navegador."
        : "Nenhuma chave salva — a aplicação está em modo demonstração.",
      "neutro"
    );

    if (typeof el.dlg.showModal === "function") el.dlg.showModal();
    else el.dlg.setAttribute("open", "");
  };

  const ligarDialogo = () => {
    el.abrirChave?.addEventListener("click", abrirDialogo);

    el.inputModelo?.addEventListener("change", ({ target }) => {
      CK.armazenamento.salvarModelo(target.value);
    });

    el.salvarChave?.addEventListener("click", async () => {
      const chave = el.inputChave?.value.trim() ?? "";
      const modelo = el.inputModelo?.value ?? CK.config.MODELO_PADRAO;

      if (!chave) {
        dizerNoDialogo("Cole a chave antes de salvar.", "erro");
        return;
      }

      CK.armazenamento.salvarChave(chave);
      CK.armazenamento.salvarModelo(modelo);
      atualizarSelo();

      dizerNoDialogo("Testando a chave na API…", "neutro");
      el.salvarChave.disabled = true;

      try {
        await CK.api.testarChave(chave, modelo);
        dizerNoDialogo("Chave válida — o Oráculo está conectado.", "ok");
        toast("Chave salva e testada com sucesso.");
      } catch (erro) {
        dizerNoDialogo(`${erro.titulo}: ${erro.message}`, "erro");
      } finally {
        el.salvarChave.disabled = false;
      }
    });

    el.apagarChave?.addEventListener("click", () => {
      CK.armazenamento.apagarChave();
      if (el.inputChave) el.inputChave.value = "";
      atualizarSelo();
      dizerNoDialogo("Chave apagada. De volta ao modo demonstração.", "neutro");
      toast("Chave removida deste navegador.");
    });
  };

  /* ==========================================================================
     PARTIDA
     ======================================================================== */

  montar();
  ligarFormulario();
  ligarHistorico();
  ligarDialogo();
  CK.ui.ligarEfeitos();

  // Pré-seleciona o primeiro jogo para que a interface nunca comece "morta".
  CK.ui.$$(".jogo", el.jogos)[0]?.click();
})();
