const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

const estado = {
  respostas: {},
  gabaritoAberto: false,
  checklist: 0,
  parecerValido: false,
  totalAnterior: 0,
};

const raiz = document.documentElement;
const preferenciaReduzida = window.matchMedia("(prefers-reduced-motion: reduce)");

function lerPreferencia(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (erro) {
    return null;
  }
}

function salvarPreferencia(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch (erro) {
    return;
  }
}

function contarPalavras(texto) {
  const palavras = texto.trim().match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu);
  return palavras ? palavras.length : 0;
}

function semMovimento() {
  return raiz.classList.contains("sem-movimento");
}

function aplicarMovimento(reduzir) {
  raiz.classList.toggle("sem-movimento", reduzir);
  const botao = $("#alternarMovimento");
  botao.setAttribute("aria-pressed", String(reduzir));
  botao.textContent = reduzir ? "Ativar animações" : "Reduzir animações";
  if (reduzir) Cena.parar();
  else Cena.iniciar();
}

function montarLinhaDoTempo() {
  const lista = $("#linhaDoTempo");
  LINHA_DO_TEMPO.forEach((evento) => {
    const item = document.createElement("li");
    item.className = `linha__item linha__item--${evento.estado} revelar`;
    const quando = document.createElement("span");
    quando.className = "linha__quando";
    quando.textContent = evento.quando;
    const texto = document.createElement("p");
    texto.textContent = evento.oQue;
    item.append(quando, texto);
    lista.append(item);
  });
}

function montarAfirmacoes() {
  const grade = $("#afirmacoes");
  AFIRMACOES.forEach((afirmacao, indice) => {
    const cartao = document.createElement("article");
    cartao.className = "afirmacao revelar";
    cartao.dataset.id = afirmacao.id;
    cartao.setAttribute("data-tilt", "");
    cartao.setAttribute("aria-labelledby", `texto-${afirmacao.id}`);

    const opcoes = Object.entries(CLASSES)
      .map(([chave, classe]) => `<button class="opcao" type="button" data-classe="${chave}" aria-pressed="false">${classe.curto}</button>`)
      .join("");

    cartao.innerHTML = `
      <span class="afirmacao__numero">Afirmação ${indice + 1}</span>
      <span class="carimbo" aria-hidden="true"></span>
      <p class="afirmacao__texto" id="texto-${afirmacao.id}">"${afirmacao.texto}"</p>
      <div class="afirmacao__opcoes" role="group" aria-label="Classificar a afirmação ${indice + 1}">${opcoes}</div>
      <p class="afirmacao__feedback" aria-live="polite"></p>
    `;
    grade.append(cartao);
  });

  grade.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".opcao");
    if (!botao || botao.disabled) return;
    const cartao = botao.closest(".afirmacao");
    responder(cartao, botao.dataset.classe);
  });
}

function responder(cartao, escolha) {
  const afirmacao = AFIRMACOES.find((a) => a.id === cartao.dataset.id);
  const certo = escolha === afirmacao.resposta;
  estado.respostas[afirmacao.id] = escolha;

  cartao.classList.remove("is-gabarito");
  cartao.classList.add(certo ? "is-certo" : "is-errado");
  $(".carimbo", cartao).textContent = certo ? "Acertou" : "Reveja";

  $$(".opcao", cartao).forEach((botao) => {
    const classe = botao.dataset.classe;
    botao.disabled = true;
    botao.setAttribute("aria-pressed", String(classe === escolha));
    botao.classList.toggle("is-certo", classe === afirmacao.resposta);
    botao.classList.toggle("is-errado", classe === escolha && !certo);
  });

  const feedback = $(".afirmacao__feedback", cartao);
  feedback.innerHTML = `<strong>${certo ? "Correto" : "Não é bem isso"}: ${CLASSES[afirmacao.resposta].rotulo}.</strong> ${afirmacao.porque}`;

  atualizarClassificacao();
}

function atualizarClassificacao() {
  const respondidas = Object.keys(estado.respostas).length;
  const acertos = AFIRMACOES.filter((a) => estado.respostas[a.id] === a.resposta).length;
  $("#respondidas").textContent = respondidas;
  $("#acertos").textContent = acertos;
  $("#pontosClassificacao").textContent = acertos * 10;
  atualizarPlacar();
}

function mostrarGabarito() {
  estado.gabaritoAberto = !estado.gabaritoAberto;
  $("#mostrarGabarito").textContent = estado.gabaritoAberto ? "Esconder a resposta da dupla" : "Mostrar a resposta da dupla";

  $$(".afirmacao").forEach((cartao) => {
    const afirmacao = AFIRMACOES.find((a) => a.id === cartao.dataset.id);
    if (estado.respostas[afirmacao.id]) return;
    cartao.classList.toggle("is-gabarito", estado.gabaritoAberto);
    const feedback = $(".afirmacao__feedback", cartao);
    feedback.innerHTML = estado.gabaritoAberto
      ? `<strong>Resposta da dupla: ${CLASSES[afirmacao.resposta].rotulo}.</strong> ${afirmacao.porque}`
      : "";
  });
}

function recomecar() {
  estado.respostas = {};
  estado.gabaritoAberto = false;
  $("#mostrarGabarito").textContent = "Mostrar a resposta da dupla";
  $$(".afirmacao").forEach((cartao) => {
    cartao.classList.remove("is-certo", "is-errado", "is-gabarito");
    $(".carimbo", cartao).textContent = "";
    $(".afirmacao__feedback", cartao).textContent = "";
    $$(".opcao", cartao).forEach((botao) => {
      botao.disabled = false;
      botao.setAttribute("aria-pressed", "false");
      botao.classList.remove("is-certo", "is-errado");
    });
  });
  atualizarClassificacao();
  $(".afirmacao .opcao").focus();
}

function montarChecklist() {
  const caixa = $("#perguntas");
  CHECKLIST.forEach((item) => {
    const rotulo = document.createElement("label");
    rotulo.className = "pergunta";
    rotulo.dataset.id = item.id;
    rotulo.innerHTML = `
      <input type="checkbox" name="${item.id}">
      <span>${item.pergunta}</span>
      <span class="pergunta__dupla">Dupla: <strong>${item.dupla ? "sim" : "não"}</strong>. ${item.porque}</span>
    `;
    caixa.append(rotulo);
  });

  const form = $("#checklist");
  form.addEventListener("change", atualizarConfianca);
  form.addEventListener("reset", () => {
    form.classList.remove("is-comparando");
    $$(".pergunta", form).forEach((p) => p.classList.remove("is-igual", "is-diferente"));
    $("#compararChecklist").textContent = "Comparar com a dupla";
    requestAnimationFrame(atualizarConfianca);
  });
  form.addEventListener("submit", (evento) => evento.preventDefault());
  $("#compararChecklist").addEventListener("click", compararChecklist);
}

function atualizarConfianca() {
  const marcadas = $$("#checklist input:checked").length;
  const percentual = Math.round((marcadas / CHECKLIST.length) * 100);
  estado.checklist = marcadas;

  $("#confianca").textContent = percentual;
  const circunferencia = 2 * Math.PI * 52;
  $("#medidorArco").style.strokeDashoffset = String(circunferencia * (1 - percentual / 100));

  const medidor = $(".medidor");
  medidor.classList.remove("is-alta", "is-media", "is-baixa");
  medidor.classList.toggle("is-vazio", marcadas === 0);
  let rotulo = "Marque as perguntas ao lado.";
  if (marcadas > 0) {
    if (percentual >= 75) {
      medidor.classList.add("is-alta");
      rotulo = "Confiança alta: a notícia mostra de onde vem cada informação.";
    } else if (percentual >= 50) {
      medidor.classList.add("is-media");
      rotulo = "Confiança média: vale procurar outra fonte antes de compartilhar.";
    } else {
      medidor.classList.add("is-baixa");
      rotulo = "Confiança baixa: desconfie e procure a fonte original.";
    }
  }
  $("#confiancaRotulo").textContent = rotulo;

  if ($("#checklist").classList.contains("is-comparando")) marcarComparacao();
  atualizarPlacar();
}

function marcarComparacao() {
  CHECKLIST.forEach((item) => {
    const linha = $(`.pergunta[data-id="${item.id}"]`);
    const marcada = $("input", linha).checked;
    linha.classList.toggle("is-igual", marcada === item.dupla);
    linha.classList.toggle("is-diferente", marcada !== item.dupla);
  });
}

function compararChecklist() {
  const form = $("#checklist");
  const ligado = form.classList.toggle("is-comparando");
  $("#compararChecklist").textContent = ligado ? "Esconder a comparação" : "Comparar com a dupla";
  if (ligado) {
    marcarComparacao();
  } else {
    $$(".pergunta", form).forEach((p) => p.classList.remove("is-igual", "is-diferente"));
  }
}

function montarTabelaFontes() {
  const corpo = $("#tabelaFontes");
  FONTES.forEach((fonte) => {
    const linha = document.createElement("tr");
    linha.dataset.nivel = fonte.nivel;
    linha.tabIndex = 0;
    linha.innerHTML = `
      <th scope="row" class="tabela__fonte"><strong>${fonte.nome}</strong><small>${fonte.onde}</small></th>
      <td data-rotulo="O que disse">${fonte.disse}</td>
      <td data-rotulo="Tipo">${fonte.tipo}</td>
      <td data-rotulo="Interesse no caso">${fonte.interesse}</td>
      <td data-rotulo="Confiabilidade"><span class="nivel nivel--${fonte.nivel}">${NIVEIS[fonte.nivel]}</span><span class="tabela__motivo">${fonte.motivo}</span></td>
    `;
    corpo.append(linha);
  });

  corpo.addEventListener("click", (evento) => {
    const linha = evento.target.closest("tr");
    if (linha) linha.classList.toggle("is-aberta");
  });

  $(".filtros").addEventListener("click", (evento) => {
    const botao = evento.target.closest(".filtro");
    if (!botao) return;
    const nivel = botao.dataset.nivel;
    $$(".filtro").forEach((b) => {
      const ativo = b === botao;
      b.classList.toggle("is-ativo", ativo);
      b.setAttribute("aria-pressed", String(ativo));
    });
    $$("#tabelaFontes tr").forEach((linha) => {
      linha.classList.toggle("is-oculta", nivel !== "todas" && linha.dataset.nivel !== nivel);
    });
  });
}

function montarRiscos() {
  const grade = $("#riscosGrade");
  const opcoes = $("#opcoesRisco");

  RISCOS.forEach((risco, indice) => {
    const cartao = document.createElement("article");
    cartao.className = "risco revelar";
    cartao.dataset.id = risco.id;
    cartao.setAttribute("aria-labelledby", `risco-${risco.id}`);
    cartao.innerHTML = `
      <div class="risco__virar">
        <div class="risco__face risco__face--frente">
          <span class="risco__numero" aria-hidden="true">0${indice + 1}</span>
          <h3 class="risco__titulo" id="risco-${risco.id}">${risco.titulo}</h3>
          <p>${risco.oQue}</p>
          <button class="botao botao--texto risco__dica" type="button" data-acao="virar" aria-expanded="false">Ver responsáveis e prevenção</button>
        </div>
        <div class="risco__face risco__face--verso" inert>
          <span class="risco__rotulo">Responsáveis</span>
          <ul>${risco.responsaveis.map((r) => `<li>${r}</li>`).join("")}</ul>
          <span class="risco__rotulo">Prevenção</span>
          <ul>${risco.prevencao.map((p) => `<li>${p}</li>`).join("")}</ul>
          <div class="acoes-linha">
            <button class="botao botao--fantasma risco__escolher" type="button" data-acao="escolher">Escolher como principal</button>
            <button class="botao botao--texto" type="button" data-acao="virar">Voltar</button>
          </div>
        </div>
      </div>
    `;
    grade.append(cartao);

    const opcao = document.createElement("label");
    opcao.className = "opcao-risco";
    opcao.innerHTML = `<input type="radio" name="risco" value="${risco.id}" required><span>${risco.titulo}</span>`;
    opcoes.append(opcao);
  });

  grade.addEventListener("click", (evento) => {
    const cartao = evento.target.closest(".risco");
    if (!cartao) return;
    const acao = evento.target.closest("[data-acao]")?.dataset.acao;
    if (acao === "escolher") {
      escolherRisco(cartao.dataset.id, true);
      return;
    }
    if (acao === "virar" || !evento.target.closest("button")) virarRisco(cartao);
  });

  opcoes.addEventListener("change", (evento) => escolherRisco(evento.target.value, false));
}

function virarRisco(cartao) {
  const virado = cartao.classList.toggle("is-virado");
  const frente = $(".risco__face--frente", cartao);
  const verso = $(".risco__face--verso", cartao);
  frente.inert = virado;
  verso.inert = !virado;
  $('[data-acao="virar"]', frente).setAttribute("aria-expanded", String(virado));
  const alvo = virado ? $('[data-acao="escolher"]', verso) : $('[data-acao="virar"]', frente);
  setTimeout(() => alvo.focus({ preventScroll: true }), semMovimento() ? 0 : 350);
}

function escolherRisco(id, levarAoFormulario) {
  $$(".risco").forEach((cartao) => cartao.classList.toggle("is-escolhido", cartao.dataset.id === id));
  const radio = $(`input[name="risco"][value="${id}"]`);
  radio.checked = true;
  limparErro(radio.closest("fieldset"), $("#erroRisco"));
  salvarRascunho();
  if (levarAoFormulario) {
    $("#parecer").scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth" });
    radio.focus({ preventScroll: true });
  }
}

function mostrarErro(campo, saida, mensagem) {
  campo.classList.add("is-invalido");
  campo.classList.remove("is-valido");
  saida.textContent = mensagem;
  const controle = $("input, select, textarea", campo);
  if (controle) controle.setAttribute("aria-invalid", "true");
}

function limparErro(campo, saida) {
  campo.classList.remove("is-invalido");
  campo.classList.add("is-valido");
  saida.textContent = "";
  $$("input, select, textarea", campo).forEach((c) => c.removeAttribute("aria-invalid"));
}

function atualizarContador() {
  const total = contarPalavras($("#texto").value);
  const contador = $("#contador");
  $("#palavras").textContent = total;
  $("#contadorBarra").style.width = `${Math.min(100, (total / MINIMO_PALAVRAS) * 100)}%`;
  contador.classList.toggle("is-ok", total >= MINIMO_PALAVRAS);
  contador.classList.toggle("is-meio", total >= MINIMO_PALAVRAS / 2 && total < MINIMO_PALAVRAS);
  return total;
}

function validarFormulario() {
  const nome = $("#nome");
  const turma = $("#turma");
  const risco = $('input[name="risco"]:checked');
  const texto = $("#texto");
  const confirmo = $("#confirmo");
  const erros = [];

  if (nome.value.trim().length < 3) {
    mostrarErro(nome.closest(".campo"), $("#erroNome"), "Escreva seu nome com pelo menos 3 letras.");
    erros.push(nome);
  } else limparErro(nome.closest(".campo"), $("#erroNome"));

  if (!turma.value) {
    mostrarErro(turma.closest(".campo"), $("#erroTurma"), "Escolha a sua turma.");
    erros.push(turma);
  } else limparErro(turma.closest(".campo"), $("#erroTurma"));

  if (!risco) {
    mostrarErro($("#opcoesRisco").closest("fieldset"), $("#erroRisco"), "Marque o principal risco identificado.");
    erros.push($('input[name="risco"]'));
  } else limparErro($("#opcoesRisco").closest("fieldset"), $("#erroRisco"));

  const palavras = atualizarContador();
  if (palavras < MINIMO_PALAVRAS) {
    mostrarErro(texto.closest(".campo"), $("#erroTexto"), `Faltam ${MINIMO_PALAVRAS - palavras} palavras para chegar ao mínimo de ${MINIMO_PALAVRAS}.`);
    erros.push(texto);
  } else limparErro(texto.closest(".campo"), $("#erroTexto"));

  if (!confirmo.checked) {
    $("#erroConfirmo").textContent = "Confirme que separou fatos de suposições.";
    confirmo.setAttribute("aria-invalid", "true");
    erros.push(confirmo);
  } else {
    $("#erroConfirmo").textContent = "";
    confirmo.removeAttribute("aria-invalid");
  }

  return { erros, palavras };
}

function enviarParecer(evento) {
  evento.preventDefault();
  const aviso = $("#avisoForm");
  const { erros, palavras } = validarFormulario();

  if (erros.length) {
    aviso.className = "aviso is-erro";
    aviso.textContent = `Há ${erros.length} ${erros.length === 1 ? "campo" : "campos"} para corrigir.`;
    estado.parecerValido = false;
    $("#resultado").hidden = true;
    erros[0].focus();
    atualizarPlacar();
    return;
  }

  const risco = RISCOS.find((r) => r.id === $('input[name="risco"]:checked').value);
  aviso.className = "aviso is-sucesso";
  aviso.textContent = "Parecer validado. Ele aparece ao lado e já soma no placar.";
  estado.parecerValido = true;

  $("#resultadoMeta").textContent = `${$("#nome").value.trim()} · ${$("#turma").value} · ${risco.titulo} · ${palavras} palavras`;
  $("#resultadoTexto").textContent = $("#texto").value.trim();
  const resultado = $("#resultado");
  resultado.hidden = false;
  resultado.style.animation = "none";
  void resultado.offsetWidth;
  resultado.style.animation = "";
  atualizarPlacar();
}

function baixarParecer() {
  const risco = RISCOS.find((r) => r.id === $('input[name="risco"]:checked')?.value);
  const conteudo = [
    "PARECER CRÍTICO",
    "Notícia: Austrália investiga invasão do sistema de saúde pela IA (Jornal Nacional, 24/09/2026)",
    `Nome: ${$("#nome").value.trim()}`,
    `Turma: ${$("#turma").value}`,
    `Principal risco: ${risco ? risco.titulo : ""}`,
    `Palavras: ${contarPalavras($("#texto").value)}`,
    "",
    $("#texto").value.trim(),
    "",
  ].join("\r\n");
  const arquivo = new Blob(["﻿" + conteudo], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "parecer-critico.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function salvarRascunho() {
  const rascunho = {
    nome: $("#nome").value,
    turma: $("#turma").value,
    risco: $('input[name="risco"]:checked')?.value || "",
    texto: $("#texto").value,
  };
  salvarPreferencia("ck-parecer-rascunho", JSON.stringify(rascunho));
}

function restaurarRascunho() {
  const salvo = lerPreferencia("ck-parecer-rascunho");
  if (!salvo) return;
  try {
    const rascunho = JSON.parse(salvo);
    $("#nome").value = rascunho.nome || "";
    if (rascunho.turma) $("#turma").value = rascunho.turma;
    $("#texto").value = rascunho.texto || "";
    if (rascunho.risco) {
      const radio = $(`input[name="risco"][value="${rascunho.risco}"]`);
      if (radio) {
        radio.checked = true;
        $$(".risco").forEach((c) => c.classList.toggle("is-escolhido", c.dataset.id === rascunho.risco));
      }
    }
  } catch (erro) {
    return;
  }
}

function montarFormulario() {
  const form = $("#formParecer");
  form.addEventListener("submit", enviarParecer);
  form.addEventListener("input", (evento) => {
    if (evento.target.id === "texto") atualizarContador();
    if (evento.target.closest(".campo")?.classList.contains("is-invalido")) validarCampo(evento.target);
    salvarRascunho();
  });
  form.addEventListener("change", salvarRascunho);
  $("#baixar").addEventListener("click", baixarParecer);

  $("#textoModelo").textContent = PARECER_DUPLA.texto;
  $("#palavrasModelo").textContent = contarPalavras(PARECER_DUPLA.texto);
  $("#usarModelo").addEventListener("click", (evento) => {
    const modelo = $("#modelo");
    modelo.hidden = !modelo.hidden;
    evento.currentTarget.textContent = modelo.hidden ? "Ver o parecer da dupla" : "Esconder o parecer da dupla";
    if (!modelo.hidden) modelo.scrollIntoView({ behavior: semMovimento() ? "auto" : "smooth", block: "nearest" });
  });

  restaurarRascunho();
  atualizarContador();
}

function validarCampo(controle) {
  const campo = controle.closest(".campo");
  if (controle.id === "nome" && controle.value.trim().length >= 3) limparErro(campo, $("#erroNome"));
  if (controle.id === "texto" && contarPalavras(controle.value) >= MINIMO_PALAVRAS) limparErro(campo, $("#erroTexto"));
}

function atualizarPlacar() {
  const acertos = AFIRMACOES.filter((a) => estado.respostas[a.id] === a.resposta).length;
  const classificacao = acertos * 10;
  const checklist = Math.round((estado.checklist / CHECKLIST.length) * 15);
  const parecer = estado.parecerValido ? 25 : 0;
  const total = classificacao + checklist + parecer;

  $("#parteClassificacao").textContent = classificacao;
  $("#parteChecklist").textContent = checklist;
  $("#parteParecer").textContent = parecer;
  $("#total").textContent = total;
  $("#moedaValor").textContent = total;

  let nivel = "Comece pelo exercício 1.";
  if (total >= 85) nivel = "Leitor crítico de verdade: você separa fato, opinião e boato.";
  else if (total >= 60) nivel = "Muito bem! Falta pouco para fechar a análise.";
  else if (total > 0) nivel = "Bom começo. Continue pelos exercícios.";
  $("#nivel").textContent = nivel;

  if (total !== estado.totalAnterior && !semMovimento()) {
    const moeda = $("#moeda");
    moeda.classList.remove("is-girando");
    void moeda.offsetWidth;
    moeda.classList.add("is-girando");
    setTimeout(() => moeda.classList.remove("is-girando"), 950);
  }
  estado.totalAnterior = total;
}

function ativarInclinacao() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.addEventListener("pointermove", (evento) => {
    if (semMovimento()) return;
    const alvo = evento.target.closest("[data-tilt]");
    $$("[data-tilt].is-inclinado").forEach((el) => {
      if (el !== alvo) {
        el.classList.remove("is-inclinado");
        el.style.transform = "";
      }
    });
    if (!alvo) return;
    const caixa = alvo.getBoundingClientRect();
    const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
    const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
    alvo.classList.add("is-inclinado");
    alvo.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(6px)`;
  }, { passive: true });
}

function ativarRevelar() {
  const itens = $$(".revelar");
  if (!("IntersectionObserver" in window)) {
    itens.forEach((el) => el.classList.add("is-visivel"));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("is-visivel");
        observador.unobserve(entrada.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  itens.forEach((el) => observador.observe(el));
}

function ativarNavegacao() {
  const botao = $("#menuBotao");
  const menu = $("#menu");
  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("is-aberto");
    botao.setAttribute("aria-expanded", String(aberto));
    $(".sr", botao).textContent = aberto ? "Fechar menu" : "Abrir menu";
  });
  menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) {
      menu.classList.remove("is-aberto");
      botao.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("is-aberto")) {
      menu.classList.remove("is-aberto");
      botao.setAttribute("aria-expanded", "false");
      botao.focus();
    }
  });

  const links = $$(".menu a");
  const secoes = links.map((link) => $(link.getAttribute("href")));
  const barra = $("#progressoBarra");
  let pendente = false;

  window.addEventListener("scroll", () => {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(() => {
      const fracao = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      barra.style.transform = `scaleX(${fracao})`;
      let atual = 0;
      secoes.forEach((secao, i) => {
        if (secao.getBoundingClientRect().top < window.innerHeight * 0.35) atual = i;
      });
      links.forEach((link, i) => {
        link.classList.toggle("is-atual", i === atual);
        if (i === atual) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      pendente = false;
    });
  }, { passive: true });
}

function iniciar() {
  montarLinhaDoTempo();
  montarAfirmacoes();
  montarChecklist();
  montarTabelaFontes();
  montarRiscos();
  montarFormulario();

  $("#mostrarGabarito").addEventListener("click", mostrarGabarito);
  $("#recomecar").addEventListener("click", recomecar);
  $("#alternarMovimento").addEventListener("click", () => {
    const reduzir = !semMovimento();
    salvarPreferencia("ck-sem-movimento", reduzir ? "1" : "0");
    aplicarMovimento(reduzir);
  });

  const salvo = lerPreferencia("ck-sem-movimento");
  aplicarMovimento(salvo === null ? preferenciaReduzida.matches : salvo === "1");
  preferenciaReduzida.addEventListener("change", (evento) => {
    if (lerPreferencia("ck-sem-movimento") === null) aplicarMovimento(evento.matches);
  });

  ativarInclinacao();
  ativarRevelar();
  ativarNavegacao();
  atualizarConfianca();
  atualizarPlacar();
}

iniciar();
