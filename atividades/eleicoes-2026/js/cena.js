/* ============================================================================
   CK ELEIÇÕES 2026 — CENÁRIO
   Campo de partículas em canvas: pontos que sobem devagar e se ligam por
   linhas quando estão perto. Serve de fundo vivo, sem pesar na página.
   ========================================================================== */

(() => {
  "use strict";

  const canvas = document.querySelector("[data-particulas]");
  if (!canvas) return;

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (semMovimento) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const CORES = ["37, 240, 162", "50, 215, 230", "234, 255, 223"];
  const DISTANCIA = 132;

  let largura = 0;
  let altura = 0;
  let dpr = 1;
  let pontos = [];
  let animacao = 0;
  let visivel = true;

  const ponteiro = { x: -999, y: -999 };

  const dimensionar = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = canvas.clientWidth;
    altura = canvas.clientHeight;
    canvas.width = Math.floor(largura * dpr);
    canvas.height = Math.floor(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Densidade proporcional à área, com teto para telas grandes */
    const quantidade = Math.min(Math.round((largura * altura) / 17000), 110);

    pontos = Array.from({ length: quantidade }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.14 - Math.random() * 0.26,
      r: 0.7 + Math.random() * 1.5,
      cor: CORES[Math.floor(Math.random() * CORES.length)],
      alfa: 0.25 + Math.random() * 0.5,
    }));
  };

  const desenhar = () => {
    ctx.clearRect(0, 0, largura, altura);

    for (let i = 0; i < pontos.length; i += 1) {
      const p = pontos[i];

      p.x += p.vx;
      p.y += p.vy;

      /* Sopro suave do ponteiro: os pontos se afastam do cursor */
      const dx = p.x - ponteiro.x;
      const dy = p.y - ponteiro.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 110 && dist > 0.01) {
        const forca = (110 - dist) / 110 * 0.7;
        p.x += (dx / dist) * forca;
        p.y += (dy / dist) * forca;
      }

      /* Reciclagem nas bordas */
      if (p.y < -12) {
        p.y = altura + 12;
        p.x = Math.random() * largura;
      }
      if (p.x < -12) p.x = largura + 12;
      if (p.x > largura + 12) p.x = -12;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.cor}, ${p.alfa})`;
      ctx.fill();

      /* Linhas entre vizinhos próximos */
      for (let j = i + 1; j < pontos.length; j += 1) {
        const q = pontos[j];
        const lx = p.x - q.x;
        const ly = p.y - q.y;
        const d = Math.hypot(lx, ly);

        if (d < DISTANCIA) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(37, 240, 162, ${(1 - d / DISTANCIA) * 0.14})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    if (visivel) animacao = requestAnimationFrame(desenhar);
  };

  /* Pausa quando a aba sai de foco — economiza bateria */
  document.addEventListener("visibilitychange", () => {
    visivel = !document.hidden;
    cancelAnimationFrame(animacao);
    if (visivel) animacao = requestAnimationFrame(desenhar);
  });

  window.addEventListener("pointermove", (e) => {
    ponteiro.x = e.clientX;
    ponteiro.y = e.clientY;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    ponteiro.x = -999;
    ponteiro.y = -999;
  });

  let redimensionando;
  window.addEventListener("resize", () => {
    clearTimeout(redimensionando);
    redimensionando = setTimeout(dimensionar, 180);
  });

  dimensionar();
  animacao = requestAnimationFrame(desenhar);
})();
