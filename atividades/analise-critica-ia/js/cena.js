const Cena = (() => {
  const tela = document.getElementById("cena");
  const ctx = tela.getContext("2d");
  const pontos = [];
  const TOTAL = window.innerWidth < 700 ? 46 : 80;
  let largura = 0;
  let altura = 0;
  let angulo = 0;
  let inclinacao = 0;
  let alvoInclinacao = 0;
  let quadro = null;
  let ativo = false;

  for (let i = 0; i < TOTAL; i++) {
    const y = 1 - (i / (TOTAL - 1)) * 2;
    const raio = Math.sqrt(1 - y * y);
    const theta = i * 2.399963;
    pontos.push({
      x: Math.cos(theta) * raio,
      y,
      z: Math.sin(theta) * raio,
      ouro: i % 7 === 0,
    });
  }

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    largura = window.innerWidth;
    altura = window.innerHeight;
    tela.width = largura * dpr;
    tela.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function projetar(p, escala, cx, cy) {
    const cosA = Math.cos(angulo);
    const senA = Math.sin(angulo);
    const cosB = Math.cos(inclinacao);
    const senB = Math.sin(inclinacao);
    const x1 = p.x * cosA - p.z * senA;
    const z1 = p.x * senA + p.z * cosA;
    const y1 = p.y * cosB - z1 * senB;
    const z2 = p.y * senB + z1 * cosB;
    const perspectiva = 2.6 / (2.6 + z2);
    return {
      x: cx + x1 * escala * perspectiva,
      y: cy + y1 * escala * perspectiva,
      z: z2,
      p: perspectiva,
      ouro: p.ouro,
    };
  }

  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);
    const escala = Math.min(largura, altura) * 0.42;
    const cx = largura * (largura > 860 ? 0.78 : 0.5);
    const cy = altura * 0.48;
    const proj = pontos.map((p) => projetar(p, escala, cx, cy));
    const limite = escala * 0.42;

    ctx.lineWidth = 1;
    for (let i = 0; i < proj.length; i++) {
      for (let j = i + 1; j < proj.length; j++) {
        const dx = proj[i].x - proj[j].x;
        const dy = proj[i].y - proj[j].y;
        const d = Math.hypot(dx, dy);
        if (d < limite) {
          const profundidade = (2 - (proj[i].z + proj[j].z) / 2) / 3;
          ctx.strokeStyle = `rgba(150, 90, 255, ${(1 - d / limite) * 0.35 * profundidade})`;
          ctx.beginPath();
          ctx.moveTo(proj[i].x, proj[i].y);
          ctx.lineTo(proj[j].x, proj[j].y);
          ctx.stroke();
        }
      }
    }

    proj.sort((a, b) => b.z - a.z).forEach((p) => {
      const tamanho = (p.ouro ? 3.2 : 2) * p.p;
      ctx.fillStyle = p.ouro ? `rgba(255, 199, 44, ${0.5 + p.p * 0.3})` : `rgba(190, 140, 255, ${0.35 + p.p * 0.3})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, tamanho, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animar() {
    angulo += 0.0016;
    inclinacao += (alvoInclinacao - inclinacao) * 0.04;
    desenhar();
    quadro = requestAnimationFrame(animar);
  }

  function iniciar() {
    if (ativo) return;
    ativo = true;
    quadro = requestAnimationFrame(animar);
  }

  function parar() {
    ativo = false;
    cancelAnimationFrame(quadro);
  }

  ajustar();
  desenhar();

  window.addEventListener("resize", () => {
    ajustar();
    desenhar();
  });

  window.addEventListener("scroll", () => {
    const fracao = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    alvoInclinacao = (fracao - 0.5) * 1.2;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) parar();
    else if (Cena.permitido()) iniciar();
  });

  return {
    iniciar,
    parar,
    permitido: () => !document.documentElement.classList.contains("sem-movimento"),
  };
})();
