(function () {
  "use strict";

  const canvas = document.getElementById("cena");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const prefereMenos = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pontos = [];
  let largura = 0;
  let altura = 0;
  let angulo = 0;
  let quadro = null;
  let mouseX = 0;
  let mouseY = 0;

  function bloqueado() {
    return prefereMenos.matches || document.documentElement.classList.contains("sem-movimento");
  }

  function criarPontos() {
    const quantidade = window.innerWidth < 640 ? 70 : 140;
    pontos = [];
    for (let i = 0; i < quantidade; i++) {

      const y = 1 - (i / (quantidade - 1)) * 2;
      const raio = Math.sqrt(1 - y * y);
      const theta = i * 2.399963;
      pontos.push({ x: Math.cos(theta) * raio, y, z: Math.sin(theta) * raio, ouro: i % 9 === 0 });
    }
  }

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    criarPontos();
  }

  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);
    const escala = Math.min(largura, altura) * 0.42;
    const cx = largura * 0.72 + mouseX * 20;
    const cy = altura * 0.42 + mouseY * 20;
    const seno = Math.sin(angulo);
    const cosseno = Math.cos(angulo);
    const inclinacao = 0.35;

    const projetados = pontos.map((p) => {
      const x = p.x * cosseno - p.z * seno;
      let z = p.x * seno + p.z * cosseno;
      const y = p.y * Math.cos(inclinacao) - z * Math.sin(inclinacao);
      z = p.y * Math.sin(inclinacao) + z * Math.cos(inclinacao);
      const perspectiva = 2.6 / (2.6 + z);
      return { sx: cx + x * escala * perspectiva, sy: cy + y * escala * perspectiva, z, perspectiva, ouro: p.ouro };
    });

    ctx.lineWidth = 0.6;
    for (let i = 0; i < projetados.length; i++) {
      const a = projetados[i];
      for (let j = i + 1; j < projetados.length; j++) {
        const b = projetados[j];
        const dx = a.sx - b.sx;
        const dy = a.sy - b.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 3600) {
          const alfa = (1 - d2 / 3600) * 0.22 * (a.perspectiva - 0.5);
          ctx.strokeStyle = `rgba(181, 123, 255, ${alfa.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
    }

    projetados.sort((a, b) => b.z - a.z).forEach((p) => {
      const r = 1.6 * p.perspectiva + (p.ouro ? 1 : 0);
      ctx.fillStyle = p.ouro
        ? `rgba(255, 199, 44, ${(0.35 + 0.5 * (p.perspectiva - 0.6)).toFixed(3)})`
        : `rgba(196, 160, 255, ${(0.25 + 0.5 * (p.perspectiva - 0.6)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animar() {
    angulo += 0.0022;
    desenhar();
    quadro = requestAnimationFrame(animar);
  }

  function parar() {
    if (quadro) cancelAnimationFrame(quadro);
    quadro = null;
  }

  function iniciar() {
    if (bloqueado() || document.hidden) {
      parar();
      ctx.clearRect(0, 0, largura, altura);
      return;
    }
    if (!quadro) animar();
  }

  function comecar() {
    redimensionar();
    iniciar();
    window.addEventListener("resize", () => {
      redimensionar();
      if (!quadro && !bloqueado()) desenhar();
    });
    document.addEventListener("visibilitychange", iniciar);
    document.addEventListener("ck:movimento", iniciar);
    if (prefereMenos.addEventListener) prefereMenos.addEventListener("change", iniciar);
    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX / largura - 0.5;
      mouseY = e.clientY / altura - 0.5;
    }, { passive: true });
  }

  const quandoLivre = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
  if (document.readyState === "complete") quandoLivre(comecar);
  else window.addEventListener("load", () => quandoLivre(comecar));
})();
