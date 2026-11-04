// =====================================================================
// ck-efeitos.js · SÓ A PARTE VISUAL da identidade Conscious Knowledge (CK)
// Dupla: Gustavo Oliveira dos Santos e Paulo Henrique de Lima Silva (2°C)
//
// Separado do script.js de propósito: a funcionalidade avaliada (tabela + gráfico)
// continua toda no script.js. Se este arquivo falhar, o painel funciona igual.
// Aqui ficam: vinheta, bola 3D no canvas, cartões 3D, revelar ao rolar e contadores.
// JavaScript puro (sem jQuery) porque roda antes do script.js.
// =====================================================================
(function () {
  "use strict";

  // Usuário pediu "menos movimento" no sistema? Então desligamos animações pesadas
  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Mouse de verdade (computador)? O efeito 3D de inclinar cartões só faz sentido com mouse
  const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Fonte das letras do gráfico igual à do site (Chart.defaults vale para todos os gráficos da página)
  if (window.Chart) {
    Chart.defaults.font.family = '"Inter", "Segoe UI", system-ui, sans-serif';
  }

  // ---------------------------------------------------------------
  // 1) VINHETA DE ABERTURA (logo CK). Aparece uma vez por sessão.
  // ---------------------------------------------------------------
  const vinheta = document.getElementById("vinheta");
  function fecharVinheta() {
    if (vinheta) { vinheta.classList.add("fechada"); }
  }
  if (vinheta) {
    vinheta.addEventListener("click", fecharVinheta);       // clique pula a vinheta
    setTimeout(fecharVinheta, menosMovimento ? 0 : 2300);  // depois da animação, sai da frente
    try { sessionStorage.setItem("ckVinheta", "1"); } catch (e) { /* navegador sem storage: tudo bem */ }
  }

  // ---------------------------------------------------------------
  // 2) REVELAR AO ROLAR: cada .revelar aparece quando entra na tela
  // ---------------------------------------------------------------
  const revelar = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && !menosMovimento) {
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revelar.forEach(function (el) { obs.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add("visivel"); });
  }

  // ---------------------------------------------------------------
  // 3) CARTÕES 3D: inclinam seguindo o mouse (variáveis CSS --rx e --ry)
  // ---------------------------------------------------------------
  if (temMouse && !menosMovimento) {
    document.querySelectorAll(".tilt").forEach(function (cartao) {
      const forca = cartao.classList.contains("tilt-leve") ? 3 : 10; // gráfico inclina pouco para não atrapalhar a leitura
      cartao.addEventListener("mousemove", function (ev) {
        const r = cartao.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width;   // 0 (esquerda) até 1 (direita)
        const y = (ev.clientY - r.top) / r.height;   // 0 (topo) até 1 (base)
        cartao.style.setProperty("--ry", ((x - 0.5) * forca).toFixed(2) + "deg");
        cartao.style.setProperty("--rx", ((0.5 - y) * forca).toFixed(2) + "deg");
        cartao.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        cartao.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      cartao.addEventListener("mouseleave", function () {
        cartao.style.setProperty("--rx", "0deg");
        cartao.style.setProperty("--ry", "0deg");
      });
    });
  }

  // ---------------------------------------------------------------
  // 4) CONTADORES (KPIs): leem o #resumoTexto que o script.js escreve
  //    Ex.: "Futebol: 7 jogadores | 41 gols | média por jogador: 5.9 | artilheiro: Rafael Lima"
  // ---------------------------------------------------------------
  const resumo = document.getElementById("resumoTexto");
  function animarNumero(el, alvo, casas) {
    if (!el) { return; }
    const inicio = Number(el.dataset.valor || 0);
    el.dataset.valor = alvo;
    if (menosMovimento) { el.textContent = alvo.toFixed(casas); return; }
    const t0 = performance.now();
    const dur = 700;
    function passo(t) {
      const p = Math.min(1, (t - t0) / dur);
      const suave = 1 - Math.pow(1 - p, 3);                  // começa rápido e freia no final
      el.textContent = (inicio + (alvo - inicio) * suave).toFixed(casas);
      if (p < 1) { requestAnimationFrame(passo); }
    }
    requestAnimationFrame(passo);
  }
  function atualizarKpis() {
    const t = resumo.textContent;
    const jog = t.match(/(\d+) jogadores/);
    const gols = t.match(/(\d+) gols/);
    const media = t.match(/média por jogador: ([\d.]+)/);
    const art = t.match(/artilheiro: (.+)$/);
    animarNumero(document.getElementById("kpiJogadores"), jog ? Number(jog[1]) : 0, 0);
    animarNumero(document.getElementById("kpiGols"), gols ? Number(gols[1]) : 0, 0);
    animarNumero(document.getElementById("kpiMedia"), media ? Number(media[1]) : 0, 1);
    document.getElementById("kpiArtilheiro").textContent = art ? art[1] : "-";
  }
  if (resumo) {
    new MutationObserver(atualizarKpis).observe(resumo, { childList: true, characterData: true, subtree: true });
  }

  // ---------------------------------------------------------------
  // 5) BOLA DE FUTEBOL 3D no <canvas> (icosaedro truncado, 60 vértices)
  //    Matemática: giramos cada ponto (x, y, z) e projetamos com perspectiva.
  // ---------------------------------------------------------------
  const canvas = document.getElementById("bola3d");
  if (!canvas || !canvas.getContext) { return; }
  const ctx = canvas.getContext("2d");
  const PHI = (1 + Math.sqrt(5)) / 2;   // proporção áurea

  // vértices: permutações cíclicas de (0, ±1, ±3φ), (±1, ±(2+φ), ±2φ), (±φ, ±2, ±(2φ+1))
  const bases = [[0, 1, 3 * PHI], [1, 2 + PHI, 2 * PHI], [PHI, 2, 2 * PHI + 1]];
  const vertices = [];
  bases.forEach(function (b) {
    [-1, 1].forEach(function (s0) { [-1, 1].forEach(function (s1) { [-1, 1].forEach(function (s2) {
      const v = [b[0] * s0, b[1] * s1, b[2] * s2];
      const perms = [[v[0], v[1], v[2]], [v[2], v[0], v[1]], [v[1], v[2], v[0]]]; // cíclicas
      perms.forEach(function (p) {
        const igual = vertices.some(function (q) { return Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) + Math.abs(q[2] - p[2]) < 1e-6; });
        if (!igual) { vertices.push(p); }
      });
    }); }); });
  });
  const raio = Math.hypot(vertices[0][0], vertices[0][1], vertices[0][2]);
  const pts = vertices.map(function (v) { return [v[0] / raio, v[1] / raio, v[2] / raio]; }); // esfera de raio 1

  // arestas = pares de vértices com distância 2 (no tamanho original)
  const arestas = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const d = Math.hypot(vertices[i][0] - vertices[j][0], vertices[i][1] - vertices[j][1], vertices[i][2] - vertices[j][2]);
      if (Math.abs(d - 2) < 1e-3) { arestas.push([i, j]); }
    }
  }

  // pentágonos (os "gomos pretos" da bola): os 5 vértices mais próximos de cada eixo do icosaedro
  const eixos = [];
  [[0, 1, PHI]].forEach(function (b) {
    [-1, 1].forEach(function (s1) { [-1, 1].forEach(function (s2) {
      const v = [0, b[1] * s1, b[2] * s2];
      [[v[0], v[1], v[2]], [v[2], v[0], v[1]], [v[1], v[2], v[0]]].forEach(function (p) {
        const n = Math.hypot(p[0], p[1], p[2]);
        eixos.push([p[0] / n, p[1] / n, p[2] / n]);
      });
    }); });
  });
  const pentagonos = eixos.map(function (e) {
    const perto = pts.map(function (p, i) { return { i: i, d: p[0] * e[0] + p[1] * e[1] + p[2] * e[2] }; })
      .sort(function (a, b) { return b.d - a.d; }).slice(0, 5).map(function (o) { return o.i; });
    // ordena os 5 em volta do eixo para desenhar o polígono certinho
    const ref = Math.abs(e[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = [e[1] * ref[2] - e[2] * ref[1], e[2] * ref[0] - e[0] * ref[2], e[0] * ref[1] - e[1] * ref[0]];
    const w = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]];
    perto.sort(function (a, b) {
      const pa = pts[a], pb = pts[b];
      return Math.atan2(pa[0] * w[0] + pa[1] * w[1] + pa[2] * w[2], pa[0] * u[0] + pa[1] * u[1] + pa[2] * u[2]) -
             Math.atan2(pb[0] * w[0] + pb[1] * w[1] + pb[2] * w[2], pb[0] * u[0] + pb[1] * u[1] + pb[2] * u[2]);
    });
    return { idx: perto, eixo: e };
  });

  // estado da rotação
  let rotX = -0.35, rotY = 0.6, velX = 0.0015, velY = 0.006;
  let arrastando = false, ultimoX = 0, ultimoY = 0, visivel = true, rodando = false;

  function ajustarTamanho() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);   // limita para não pesar em celular
    const lado = canvas.clientWidth || 460;
    canvas.width = Math.round(lado * dpr);
    canvas.height = Math.round(lado * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function girar(p) {
    // rotação em Y (esquerda/direita) e depois em X (cima/baixo)
    const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
    const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
    const y2 = p[1] * cx - z1 * sx, z2 = p[1] * sx + z1 * cx;
    return [x1, y2, z2];
  }

  function desenhar() {
    const lado = canvas.clientWidth || 460;
    const c = lado / 2, R = lado * 0.36, f = 3.2;           // centro, raio e "distância da câmera"
    const escuro = document.body.classList.contains("escuro");
    ctx.clearRect(0, 0, lado, lado);

    // corpo da bola: esfera com luz no canto de cima
    const g = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R * 1.05);
    g.addColorStop(0, escuro ? "#3a1450" : "#ffffff");
    g.addColorStop(0.55, escuro ? "#1a0826" : "#efe2f8");
    g.addColorStop(1, escuro ? "#070309" : "#cdb2e2");
    ctx.beginPath(); ctx.arc(c, c, R * 1.01, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();

    const proj = pts.map(function (p) {
      const r = girar(p);
      const s = f / (f - r[2]);                              // perspectiva: perto = maior
      return { x: c + r[0] * R * s, y: c + r[1] * R * s, z: r[2] };
    });

    // pentágonos virados para a frente, pintados de dourado
    pentagonos.forEach(function (pg) {
      const e = girar(pg.eixo);
      if (e[2] <= 0) { return; }
      ctx.beginPath();
      pg.idx.forEach(function (i, k) { const p = proj[i]; if (k === 0) { ctx.moveTo(p.x, p.y); } else { ctx.lineTo(p.x, p.y); } });
      ctx.closePath();
      ctx.fillStyle = "rgba(252, 207, 2, " + (0.25 + e[2] * 0.6).toFixed(2) + ")";
      ctx.fill();
    });

    // arestas: as de trás bem fracas, as da frente roxas e brilhantes
    arestas.forEach(function (a) {
      const p = proj[a[0]], q = proj[a[1]];
      const z = (p.z + q.z) / 2;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
      if (z < 0) {
        ctx.strokeStyle = "rgba(163, 8, 200, .14)"; ctx.lineWidth = 1;
      } else {
        ctx.strokeStyle = escuro ? "rgba(213, 139, 255, " + (0.45 + z * 0.55).toFixed(2) + ")" : "rgba(100, 1, 135, " + (0.5 + z * 0.5).toFixed(2) + ")";
        ctx.lineWidth = 1.2 + z * 1.4;
      }
      ctx.stroke();
    });

    // brilho em volta da bola
    ctx.beginPath(); ctx.arc(c, c, R * 1.02, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(252, 207, 2, .45)"; ctx.lineWidth = 1.5;
    ctx.shadowColor = "rgba(163, 8, 200, .9)"; ctx.shadowBlur = 24; ctx.stroke(); ctx.shadowBlur = 0;
  }

  function quadro() {
    if (!arrastando) {
      rotX += velX; rotY += velY;
      velX += (0.0015 - velX) * 0.02;                        // depois de arrastar, volta devagar à velocidade normal
      velY += (0.006 - velY) * 0.02;
    }
    desenhar();
    if (visivel && !menosMovimento) { requestAnimationFrame(quadro); } else { rodando = false; }
  }
  function iniciar() {
    if (!rodando && !menosMovimento) { rodando = true; requestAnimationFrame(quadro); }
  }

  // arrastar para girar (mouse, dedo ou caneta)
  canvas.addEventListener("pointerdown", function (e) { arrastando = true; ultimoX = e.clientX; ultimoY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", function (e) {
    if (!arrastando) { return; }
    const dx = e.clientX - ultimoX, dy = e.clientY - ultimoY;
    ultimoX = e.clientX; ultimoY = e.clientY;
    rotY += dx * 0.01; rotX += dy * 0.01;
    velY = dx * 0.002; velX = dy * 0.002;
    if (menosMovimento) { desenhar(); }
  });
  ["pointerup", "pointercancel"].forEach(function (ev) { canvas.addEventListener(ev, function () { arrastando = false; }); });

  // só anima quando a bola está na tela (economiza bateria)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; if (visivel) { iniciar(); } }).observe(canvas);
  }
  // quando o tema muda (classe do body), redesenha com as cores novas
  new MutationObserver(function () { desenhar(); }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", function () { ajustarTamanho(); desenhar(); });

  ajustarTamanho();
  desenhar();
  iniciar();
})();
