(function () {
  "use strict";

  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const telaPequena = window.matchMedia("(max-width: 620px)").matches;
  const limiteDpr = Math.min(window.devicePixelRatio || 1, 1.75);

  function criarSorteio(semente) {
    return function () {
      semente |= 0;
      semente = (semente + 0x6d2b79f5) | 0;
      let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function fecharVinheta() {
    const vinheta = document.getElementById("vinheta");
    if (vinheta) vinheta.classList.add("fechada");
  }

  function iniciarVinheta() {
    const vinheta = document.getElementById("vinheta");
    if (!vinheta) return;
    vinheta.addEventListener("click", fecharVinheta);
    window.addEventListener("keydown", fecharVinheta, { once: true });
    setTimeout(fecharVinheta, reduzirMovimento ? 0 : 2700);
    try { sessionStorage.setItem("ecoLunarVinheta", "1"); } catch (e) { }
  }

  function iniciarRevelarAoRolar() {
    const elementos = document.querySelectorAll(".revelar");
    if (reduzirMovimento || !("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visivel"));
      return;
    }
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });
    elementos.forEach((el) => observador.observe(el));
  }

  function iniciarInclinacao3d() {
    if (!temMouse || reduzirMovimento) return;
    let atual = null;

    function soltar(el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }

    document.addEventListener("pointermove", (evento) => {
      const alvo = evento.target.closest ? evento.target.closest(".card-show, .tilt") : null;
      if (atual && atual !== alvo) soltar(atual);
      atual = alvo;
      if (!alvo) return;
      const caixa = alvo.getBoundingClientRect();
      const x = (evento.clientX - caixa.left) / caixa.width;
      const y = (evento.clientY - caixa.top) / caixa.height;
      const forca = alvo.classList.contains("card-show") ? 14 : 10;
      alvo.style.setProperty("--ry", ((x - 0.5) * forca).toFixed(2) + "deg");
      alvo.style.setProperty("--rx", ((0.5 - y) * forca).toFixed(2) + "deg");
      alvo.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      alvo.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    }, { passive: true });

    document.addEventListener("pointerleave", () => { if (atual) soltar(atual); });
  }

  function iniciarLuzDoMouse() {
    const luz = document.querySelector(".luz-mouse");
    if (!luz || !temMouse || reduzirMovimento) return;
    let quadroPendente = false;
    let mx = 0;
    let my = 0;
    window.addEventListener("pointermove", (evento) => {
      mx = evento.clientX;
      my = evento.clientY;
      if (quadroPendente) return;
      quadroPendente = true;
      requestAnimationFrame(() => {
        luz.style.setProperty("--mx", mx + "px");
        luz.style.setProperty("--my", my + "px");
        quadroPendente = false;
      });
    }, { passive: true });
  }

  function iniciarEstrelas() {
    const canvas = document.getElementById("estrelas");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const sorteio = criarSorteio(2026);
    const cores = ["255,255,255", "252,207,2", "213,139,255", "163,8,200"];
    let largura = 0;
    let altura = 0;
    let estrelas = [];
    let alvoX = 0;
    let alvoY = 0;
    let paralaxeX = 0;
    let paralaxeY = 0;

    function criarEstrela() {
      return {
        x: (sorteio() - 0.5) * 2,
        y: (sorteio() - 0.5) * 2,
        z: sorteio() * 0.9 + 0.1,
        cor: cores[Math.floor(sorteio() * cores.length)]
      };
    }

    function redimensionar() {
      largura = window.innerWidth;
      altura = window.innerHeight;
      canvas.width = Math.round(largura * limiteDpr);
      canvas.height = Math.round(altura * limiteDpr);
      ctx.setTransform(limiteDpr, 0, 0, limiteDpr, 0, 0);
      const quantidade = Math.min(telaPequena ? 140 : 320, Math.round((largura * altura) / 5200));
      estrelas = Array.from({ length: quantidade }, criarEstrela);
    }

    function desenhar(velocidade) {
      ctx.clearRect(0, 0, largura, altura);
      paralaxeX += (alvoX - paralaxeX) * 0.04;
      paralaxeY += (alvoY - paralaxeY) * 0.04;
      const cx = largura / 2;
      const cy = altura / 2;
      const escala = Math.max(largura, altura) * 0.5;

      for (const estrela of estrelas) {
        estrela.z -= velocidade;
        if (estrela.z <= 0.05) Object.assign(estrela, criarEstrela(), { z: 1 });
        const px = cx + (estrela.x / estrela.z) * escala * 0.5 + paralaxeX * (1 - estrela.z) * 40;
        const py = cy + (estrela.y / estrela.z) * escala * 0.5 + paralaxeY * (1 - estrela.z) * 40;
        if (px < -10 || px > largura + 10 || py < -10 || py > altura + 10) continue;
        const brilho = Math.min(1, (1 - estrela.z) * 1.3);
        const raio = Math.max(0.4, (1 - estrela.z) * 2.2);
        ctx.fillStyle = `rgba(${estrela.cor},${brilho.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, raio, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animar() {
      if (!document.hidden) desenhar(0.0014);
      requestAnimationFrame(animar);
    }

    redimensionar();
    window.addEventListener("resize", redimensionar);
    if (temMouse) {
      window.addEventListener("pointermove", (evento) => {
        alvoX = (evento.clientX / window.innerWidth - 0.5) * 2;
        alvoY = (evento.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }
    if (reduzirMovimento) {
      desenhar(0);
      window.addEventListener("resize", () => desenhar(0));
    } else {
      requestAnimationFrame(animar);
    }
  }

  function iniciarLua3d() {
    const canvas = document.getElementById("lua-3d");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const sorteio = criarSorteio(77);
    const totalPontos = telaPequena ? 900 : 1800;
    const angulo = Math.PI * (3 - Math.sqrt(5));
    const crateras = Array.from({ length: 14 }, () => {
      const t = sorteio() * Math.PI * 2;
      const u = sorteio() * 2 - 1;
      const r = Math.sqrt(1 - u * u);
      return { x: r * Math.cos(t), y: u, z: r * Math.sin(t), raio: 0.12 + sorteio() * 0.22 };
    });

    const pontos = Array.from({ length: totalPontos }, (_, i) => {
      const y = Math.max(-1, Math.min(1, 1 - (i / (totalPontos - 1)) * 2 + (sorteio() - 0.5) * 0.012));
      const r = Math.sqrt(1 - y * y);
      const theta = angulo * i + (sorteio() - 0.5) * 0.9;
      const p = { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, sombra: 0 };
      for (const c of crateras) {
        const distancia = Math.acos(Math.max(-1, Math.min(1, p.x * c.x + p.y * c.y + p.z * c.z)));
        if (distancia < c.raio) p.sombra = Math.max(p.sombra, 1 - distancia / c.raio);
      }
      return p;
    });

    let lado = 0;
    let rotY = 0.6;
    let rotX = -0.35;
    let velocidadeY = 0.0035;
    let arrastando = false;
    let ultimoX = 0;
    let ultimoY = 0;
    let visivel = true;
    let tempo = 0;

    function redimensionar() {
      lado = canvas.clientWidth || 400;
      canvas.width = Math.round(lado * limiteDpr);
      canvas.height = Math.round(lado * limiteDpr);
      ctx.setTransform(limiteDpr, 0, 0, limiteDpr, 0, 0);
    }

    function desenharEcos(cx, cy, raio) {
      for (let i = 0; i < 3; i++) {
        const fase = ((tempo / 160) + i / 3) % 1;
        ctx.strokeStyle = `rgba(252,207,2,${(0.35 * (1 - fase)).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, raio * (1.02 + fase * 0.55), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function desenhar() {
      const cx = lado / 2;
      const cy = lado / 2;
      const raio = lado * 0.3;
      ctx.clearRect(0, 0, lado, lado);

      const halo = ctx.createRadialGradient(cx, cy, raio * 0.6, cx, cy, raio * 1.6);
      halo.addColorStop(0, "rgba(163,8,200,0.45)");
      halo.addColorStop(0.5, "rgba(100,1,135,0.18)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, lado, lado);
      if (!reduzirMovimento) desenharEcos(cx, cy, raio);

      const cosY = Math.cos(rotY);
      const senY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const senX = Math.sin(rotX);
      const projetados = pontos.map((p) => {
        const x1 = p.x * cosY - p.z * senY;
        const z1 = p.x * senY + p.z * cosY;
        const y1 = p.y * cosX - z1 * senX;
        const z2 = p.y * senX + z1 * cosX;
        const perspectiva = 2.6 / (2.6 - z2);
        return { x: cx + x1 * raio * perspectiva, y: cy + y1 * raio * perspectiva, z: z2, sombra: p.sombra, perspectiva };
      });
      projetados.sort((a, b) => a.z - b.z);

      const desenharPonto = (p) => {
        const frente = (p.z + 1) / 2;
        const luz = Math.max(0, Math.min(1, frente * (1 - p.sombra * 0.55)));
        const r = Math.round(163 + (252 - 163) * luz);
        const g = Math.round(8 + (207 - 8) * luz);
        const b = Math.round(200 + (2 - 200) * luz);
        const alfa = (0.12 + frente * 0.88) * (1 - p.sombra * 0.6);
        const tamanho = (0.45 + frente * 1.25) * p.perspectiva * (lado / 420);
        ctx.fillStyle = `rgba(${r},${g},${b},${alfa.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, tamanho, 0, Math.PI * 2);
        ctx.fill();
      };

      const indiceFrente = projetados.findIndex((p) => p.z >= 0);
      const corte = indiceFrente === -1 ? projetados.length : indiceFrente;
      for (let i = 0; i < corte; i++) desenharPonto(projetados[i]);

      const corpo = ctx.createRadialGradient(cx - raio * 0.35, cy - raio * 0.4, raio * 0.05, cx, cy, raio * 1.04);
      corpo.addColorStop(0, "rgba(252,207,2,0.22)");
      corpo.addColorStop(0.45, "rgba(100,1,135,0.55)");
      corpo.addColorStop(1, "rgba(14,4,22,0.94)");
      ctx.fillStyle = corpo;
      ctx.beginPath();
      ctx.arc(cx, cy, raio * 1.02, 0, Math.PI * 2);
      ctx.fill();

      for (let i = corte; i < projetados.length; i++) desenharPonto(projetados[i]);
    }

    function animar() {
      if (visivel && !document.hidden) {
        tempo += 1;
        if (!arrastando) {
          rotY += velocidadeY;
          velocidadeY += (0.0035 - velocidadeY) * 0.02;
          rotX += (-0.35 - rotX) * 0.01;
        }
        desenhar();
      }
      requestAnimationFrame(animar);
    }

    canvas.addEventListener("pointerdown", (evento) => {
      arrastando = true;
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      canvas.setPointerCapture(evento.pointerId);
    });
    canvas.addEventListener("pointermove", (evento) => {
      if (!arrastando) return;
      const dx = evento.clientX - ultimoX;
      const dy = evento.clientY - ultimoY;
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      rotY += dx * 0.01;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + dy * 0.01));
      velocidadeY = dx * 0.004;
      if (reduzirMovimento) desenhar();
    });
    ["pointerup", "pointercancel"].forEach((tipo) => canvas.addEventListener(tipo, () => { arrastando = false; }));

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entradas) => { visivel = entradas[0].isIntersecting; }).observe(canvas);
    }

    redimensionar();
    window.addEventListener("resize", () => { redimensionar(); desenhar(); });
    if (reduzirMovimento) {
      desenhar();
    } else {
      requestAnimationFrame(animar);
    }
  }

  iniciarVinheta();
  iniciarRevelarAoRolar();
  iniciarInclinacao3d();
  iniciarLuzDoMouse();
  iniciarEstrelas();
  iniciarLua3d();
})();
