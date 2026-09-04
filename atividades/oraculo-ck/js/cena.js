window.CK = window.CK || {};

CK.cena = (() => {
  "use strict";

  const RUNAS = ["◆", "✦", "◇", "✧", "◈", "✶", "⬡", "⟡"];
  const CORES = ["53, 255, 160", "0, 200, 192", "216, 255, 122"];

  const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));

  const iniciar = (tela) => {
    if (!tela) return;

    const contexto = tela.getContext("2d", { alpha: true });
    const ponteiro = { x: -9999, y: -9999 };

    let largura = 0;
    let altura = 0;
    let faiscas = [];
    let runas = [];
    let tempo = 0;
    let animando = true;

    const campo = (x, y, t) => {
      const a = Math.sin(x * 0.0015 + t) + Math.cos(y * 0.0018 - t * 0.85);
      const b = Math.sin((x + y) * 0.001 + t * 1.35);
      return (a + b * 0.62) * Math.PI;
    };

    const nascerFaisca = () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vida: 70 + Math.random() * 220,
      idade: 0,
      velocidade: 0.32 + Math.random() * 0.9,
      cor: CORES[Math.random() < 0.14 ? 2 : Math.random() < 0.62 ? 0 : 1],
      espessura: Math.random() < 0.22 ? 1.6 : 0.85,
    });

    const nascerRuna = (inicial) => ({
      x: Math.random() * largura,
      y: inicial ? Math.random() * altura : altura + 30,
      glifo: RUNAS[Math.floor(Math.random() * RUNAS.length)],
      tamanho: 10 + Math.random() * 16,
      velocidade: 0.14 + Math.random() * 0.42,
      deriva: (Math.random() - 0.5) * 0.28,
      alpha: 0.06 + Math.random() * 0.2,
      giro: (Math.random() - 0.5) * 0.006,
      angulo: Math.random() * Math.PI,
    });

    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = window.innerWidth;
      altura = window.innerHeight;

      tela.width = Math.floor(largura * dpr);
      tela.height = Math.floor(altura * dpr);
      contexto.setTransform(dpr, 0, 0, dpr, 0, 0);

      const quantasFaiscas = limitar(Math.round((largura * altura) / 11500), 36, 140);
      const quantasRunas = limitar(Math.round((largura * altura) / 46000), 8, 30);

      faiscas = Array.from({ length: quantasFaiscas }, nascerFaisca);
      runas = Array.from({ length: quantasRunas }, () => nascerRuna(true));
    };

    const desenhar = () => {
      if (!animando) return;

      tempo += 0.0016;

      contexto.globalCompositeOperation = "destination-out";
      contexto.fillStyle = "rgba(0, 0, 0, 0.06)";
      contexto.fillRect(0, 0, largura, altura);

      contexto.globalCompositeOperation = "lighter";

      for (let i = 0; i < runas.length; i += 1) {
        const runa = runas[i];

        runa.y -= runa.velocidade;
        runa.x += runa.deriva;
        runa.angulo += runa.giro;

        if (runa.y < -40) {
          runas[i] = nascerRuna(false);
          continue;
        }

        contexto.save();
        contexto.translate(runa.x, runa.y);
        contexto.rotate(runa.angulo);
        contexto.font = `${runa.tamanho}px "JetBrains Mono", monospace`;
        contexto.fillStyle = `rgba(53, 255, 160, ${runa.alpha.toFixed(3)})`;
        contexto.textAlign = "center";
        contexto.fillText(runa.glifo, 0, 0);
        contexto.restore();
      }

      for (let i = 0; i < faiscas.length; i += 1) {
        const faisca = faiscas[i];
        const anterior = { x: faisca.x, y: faisca.y };
        const angulo = campo(faisca.x, faisca.y, tempo);

        faisca.x += Math.cos(angulo) * faisca.velocidade;
        faisca.y += Math.sin(angulo) * faisca.velocidade;

        const dx = faisca.x - ponteiro.x;
        const dy = faisca.y - ponteiro.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < 160) {
          const forca = ((160 - distancia) / 160) * 1.7;
          faisca.x += (dx / (distancia || 1)) * forca;
          faisca.y += (dy / (distancia || 1)) * forca;
        }

        faisca.idade += 1;

        const foraDaTela =
          faisca.x < -20 || faisca.x > largura + 20 ||
          faisca.y < -20 || faisca.y > altura + 20;

        if (faisca.idade > faisca.vida || foraDaTela) {
          faiscas[i] = nascerFaisca();
          continue;
        }

        const progresso = faisca.idade / faisca.vida;
        const alpha = Math.sin(progresso * Math.PI) * 0.4;

        contexto.strokeStyle = `rgba(${faisca.cor}, ${alpha.toFixed(3)})`;
        contexto.lineWidth = faisca.espessura;
        contexto.beginPath();
        contexto.moveTo(anterior.x, anterior.y);
        contexto.lineTo(faisca.x, faisca.y);
        contexto.stroke();
      }

      contexto.globalCompositeOperation = "source-over";
      requestAnimationFrame(desenhar);
    };

    dimensionar();
    requestAnimationFrame(desenhar);

    let ajuste;
    window.addEventListener("resize", () => {
      clearTimeout(ajuste);
      ajuste = setTimeout(dimensionar, 180);
    });

    window.addEventListener("pointermove", ({ clientX, clientY }) => {
      ponteiro.x = clientX;
      ponteiro.y = clientY;
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
      ponteiro.x = -9999;
      ponteiro.y = -9999;
    });

    document.addEventListener("visibilitychange", () => {
      animando = !document.hidden;
      if (animando) requestAnimationFrame(desenhar);
    });
  };

  return { iniciar };
})();
