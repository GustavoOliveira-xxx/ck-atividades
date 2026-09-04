window.CK = window.CK || {};

CK.api = (() => {
  "use strict";

  const { BASE, MODELOS, GERACAO, TEMPO_LIMITE } = CK.config;

  let controladorAtual = null;
  let cancelamentoManual = false;

  class ErroOraculo extends Error {
    constructor({ codigo, titulo, mensagem, dica = "", recuperavel = true }) {
      super(mensagem);
      this.name = "ErroOraculo";
      this.codigo = codigo;
      this.titulo = titulo;
      this.dica = dica;
      this.recuperavel = recuperavel;
    }
  }

  const traduzirHttp = (status, detalhe = "") => {
    const mapa = {
      400: {
        titulo: "Requisição recusada",
        mensagem: "A API não entendeu o pedido. Normalmente é a chave em formato inválido ou um campo faltando.",
        dica: "Confira se você colou a chave inteira, sem espaços no começo ou no fim.",
      },
      401: {
        titulo: "Chave não autorizada",
        mensagem: "A chave informada não foi aceita pela API.",
        dica: "Gere uma nova chave no Google AI Studio e salve novamente.",
      },
      403: {
        titulo: "Acesso negado",
        mensagem: "A chave existe, mas não tem permissão para usar este modelo — ou a API não está habilitada no projeto.",
        dica: "Verifique no Google AI Studio se a chave está ativa e sem restrição de origem.",
      },
      404: {
        titulo: "Modelo não encontrado",
        mensagem: "O modelo escolhido não existe mais ou mudou de nome.",
        dica: "Escolha outro modelo no diálogo da chave.",
      },
      429: {
        titulo: "Limite de uso atingido",
        mensagem: "Muitas requisições em pouco tempo, ou a cota gratuita do dia acabou.",
        dica: "Espere alguns minutos e tente de novo — ou use o modo demonstração para continuar apresentando.",
      },
      500: {
        titulo: "Erro no servidor da IA",
        mensagem: "O serviço da API respondeu com uma falha interna.",
        dica: "Isso costuma ser passageiro. Tente novamente em alguns segundos.",
      },
      503: {
        titulo: "Serviço sobrecarregado",
        mensagem: "O modelo está temporariamente indisponível por excesso de tráfego.",
        dica: "Aguarde um instante e repita a consulta.",
      },
    };

    const base = mapa[status] || {
      titulo: "Falha na comunicação",
      mensagem: `A API respondeu com o status HTTP ${status}.`,
      dica: "Tente novamente; se persistir, troque de modelo.",
    };

    return new ErroOraculo({
      codigo: `HTTP ${status}`,
      ...base,
      mensagem: detalhe ? `${base.mensagem} (${detalhe})` : base.mensagem,
    });
  };

  const traduzirRede = (erro) => {
    if (erro?.name === "AbortError") {
      if (cancelamentoManual) {
        return new ErroOraculo({
          codigo: "CANCELADO",
          titulo: "Consulta cancelada",
          mensagem: "Você interrompeu a requisição antes de a resposta chegar.",
          dica: "É só clicar em “Consultar o Oráculo” de novo quando quiser.",
        });
      }

      return new ErroOraculo({
        codigo: "TEMPO_ESGOTADO",
        titulo: "A resposta demorou demais",
        mensagem: `O Oráculo esperou ${TEMPO_LIMITE / 1000} segundos e cancelou a requisição.`,
        dica: "Sua conexão pode estar lenta. Tente de novo ou reduza o tamanho da pergunta.",
      });
    }

    if (erro instanceof ErroOraculo) return erro;

    return new ErroOraculo({
      codigo: "SEM_CONEXAO",
      titulo: "Não foi possível alcançar a API",
      mensagem: "O navegador não conseguiu completar a requisição. Costuma ser falta de internet, firewall da escola ou bloqueio de CORS.",
      dica: "Confira a conexão. Se estiver na rede da escola, o modo demonstração garante a apresentação.",
    });
  };

  const chamarGemini = async ({ chave, modelo, instrucao, pergunta, limite = TEMPO_LIMITE }) => {
    const controlador = new AbortController();
    const relogio = setTimeout(() => controlador.abort(), limite);
    controladorAtual = controlador;

    const corpo = {
      contents: [{ role: "user", parts: [{ text: pergunta }] }],
      systemInstruction: { parts: [{ text: instrucao }] },
      generationConfig: { ...GERACAO },
    };

    try {
      const resposta = await fetch(`${BASE}/${modelo}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": chave,
        },
        body: JSON.stringify(corpo),
        signal: controlador.signal,
      });

      if (!resposta.ok) {
        const { error } = await resposta.json().catch(() => ({}));
        throw traduzirHttp(resposta.status, error?.message?.slice(0, 120) || "");
      }

      const dados = await resposta.json();
      return extrairTexto(dados);
    } finally {
      clearTimeout(relogio);
      controladorAtual = null;
    }
  };

  const cancelar = () => {
    if (!controladorAtual) return false;
    cancelamentoManual = true;
    controladorAtual.abort();
    return true;
  };

  const extrairTexto = (dados) => {
    const { candidates, promptFeedback } = dados ?? {};

    if (promptFeedback?.blockReason) {
      throw new ErroOraculo({
        codigo: `BLOQUEADO_${promptFeedback.blockReason}`,
        titulo: "Pergunta bloqueada pelo filtro de segurança",
        mensagem: "O modelo recusou o conteúdo enviado antes de gerar a resposta.",
        dica: "Reescreva a pergunta com outras palavras, sem termos que possam soar ofensivos.",
      });
    }

    const [primeiro] = candidates ?? [];

    if (!primeiro) {
      throw new ErroOraculo({
        codigo: "RESPOSTA_VAZIA",
        titulo: "O Oráculo voltou de mãos vazias",
        mensagem: "A API respondeu, mas sem nenhum candidato de texto.",
        dica: "Tente reformular a pergunta ou trocar o modelo.",
      });
    }

    if (primeiro.finishReason === "SAFETY") {
      throw new ErroOraculo({
        codigo: "RESPOSTA_FILTRADA",
        titulo: "Resposta interrompida pelo filtro",
        mensagem: "O modelo começou a responder, mas o conteúdo foi barrado pelas políticas de segurança.",
        dica: "Mude o enfoque da pergunta e tente novamente.",
      });
    }

    const partes = primeiro.content?.parts ?? [];
    const texto = partes.map(({ text }) => text ?? "").join("").trim();

    if (!texto) {
      throw new ErroOraculo({
        codigo: "TEXTO_VAZIO",
        titulo: "Resposta sem conteúdo",
        mensagem: "O modelo devolveu um candidato sem texto aproveitável.",
        dica: "Repita a consulta — isso costuma resolver.",
      });
    }

    return {
      texto,
      truncada: primeiro.finishReason === "MAX_TOKENS",
    };
  };

  const FORA = /embedding|aqa|imagen|image|veo|tts|audio|learnlm/i;

  const pontuar = (id) => {
    let pontos = 0;

    if (/flash/i.test(id)) pontos += 40;
    else if (/pro/i.test(id)) pontos += 22;

    const versao = Number((id.match(/(\d+\.\d+)/) || [])[1] || 0);
    pontos += versao * 10;

    if (/lite/i.test(id)) pontos -= 8;
    if (/preview|exp|thinking/i.test(id)) pontos -= 25;
    if (/-\d{3,4}$/.test(id)) pontos -= 6;

    return pontos;
  };

  const listarModelos = async (chave) => {
    const controlador = new AbortController();
    const relogio = setTimeout(() => controlador.abort(), 15000);

    try {
      const resposta = await fetch(`${BASE}?pageSize=200`, {
        headers: { "x-goog-api-key": chave },
        signal: controlador.signal,
      });

      if (!resposta.ok) {
        const { error } = await resposta.json().catch(() => ({}));
        throw traduzirHttp(resposta.status, error?.message?.slice(0, 90) || "");
      }

      const { models } = await resposta.json();

      return (models ?? [])
        .filter(({ name, supportedGenerationMethods }) =>
          (supportedGenerationMethods ?? []).includes("generateContent") && !FORA.test(name))
        .map(({ name, displayName, description }) => {
          const id = String(name).replace(/^models\//, "");
          return { id, rotulo: displayName || id, descricao: description || "", peso: pontuar(id) };
        })
        .sort((a, b) => b.peso - a.peso);
    } catch (erro) {
      throw traduzirRede(erro);
    } finally {
      clearTimeout(relogio);
    }
  };

  const RECEITAS = {
    iniciante: {
      resumo: "O caminho mais rápido para evoluir em {jogo} é reduzir o número de decisões ruins, não aumentar o número de partidas.",
      blocos: [
        ["Nas primeiras horas", [
          "Jogue o tutorial completo e repita o modo treino até acertar o básico sem pensar.",
          "Escolha dois personagens/decks e fique neles: trocar toda hora impede criar memória muscular.",
          "Assista a uma partida sua gravada — os erros ficam óbvios de fora.",
        ]],
        ["Erros que custam caro", [
          "Brigar por tudo. A maioria das derrotas vem de lutas que não precisavam acontecer.",
          "Gastar recurso cedo em item cosmético em vez de progressão.",
          "Ignorar o áudio: passos e alertas entregam mais informação que a tela.",
        ]],
        ["Ordem de prioridade", [
          "Sobreviver → posicionar → causar dano. Nessa ordem, sempre.",
          "Domine um mapa por vez em vez de decorar todos pela metade.",
        ]],
      ],
      conselho: "Constância vale mais que talento: 30 minutos focados por dia superam 4 horas no automático.",
    },
    meta: {
      resumo: "O meta de {jogo} premia quem entende a função da build, não quem copia a lista do dia.",
      blocos: [
        ["Como ler o meta", [
          "Veja o que aparece nas partidas do seu elo — o meta do topo raramente é o seu meta.",
          "Anote o que te derrota com frequência: essa é a sua lista de prioridades real.",
        ]],
        ["Montando a build", [
          "Escolha primeiro a função (dano, controle, sustentação) e só depois os itens.",
          "Um item defensivo cedo costuma render mais que o terceiro item de dano.",
          "Deixe um slot flexível para responder à composição inimiga.",
        ]],
        ["Sinal de alerta", [
          "Se a build só funciona quando você está na frente, ela não é boa — é uma build de vitória fácil.",
        ]],
      ],
      conselho: "Aprenda uma build por completo antes de trocar: profundidade ganha mais partidas que variedade.",
    },
    estrategia: {
      resumo: "Partidas de {jogo} são decididas por posicionamento e tempo, quase nunca por mira ou reflexo puro.",
      blocos: [
        ["Leitura de mapa", [
          "Antes de se mover, responda: onde está o perigo e para onde eu recuo?",
          "Ocupe posições altas e cobertas; a vantagem de terreno vale mais que a de equipamento.",
        ]],
        ["Rotação", [
          "Mova-se cedo e devagar, não tarde e correndo.",
          "Evite o centro do mapa quando estiver com poucos recursos.",
          "Deixe as brigas dos outros acontecerem e chegue depois.",
        ]],
        ["Fechando a partida", [
          "Com vantagem, jogue para não perder — não para ampliar.",
          "Force o adversário a agir no seu tempo, mantendo o controle da área.",
        ]],
      ],
      conselho: "Quem controla o espaço controla a partida; dano é consequência, não objetivo.",
    },
    counter: {
      resumo: "Counterar em {jogo} é tirar do adversário aquilo que ele precisa para funcionar, não copiar o que ele faz.",
      blocos: [
        ["Identifique o padrão", [
          "Anote em que momento você costuma perder: abertura, meio ou fechamento.",
          "Repare no que o oponente sempre faz primeiro — é aí que ele é previsível.",
        ]],
        ["Respostas práticas", [
          "Contra agressivo: recue, deixe ele gastar recurso e puna o erro.",
          "Contra passivo: force a ação ocupando o objetivo, não o inimigo.",
          "Contra composição de área: separe-se e ataque por dois lados.",
        ]],
        ["Ajuste mental", [
          "Perder três vezes para a mesma jogada é informação, não azar.",
        ]],
      ],
      conselho: "Não jogue o jogo do adversário: mude o ritmo antes de mudar a build.",
    },
    recursos: {
      resumo: "Em {jogo}, o recurso mais escasso não é a moeda — é a atenção que você dá ao que realmente evolui.",
      blocos: [
        ["Onde gastar primeiro", [
          "Tudo que aumenta progressão permanente vem antes de qualquer cosmético.",
          "Complete missões diárias: são a melhor relação tempo/recompensa do jogo.",
        ]],
        ["Onde não gastar", [
          "Caixas aleatórias com o saldo baixo — a variância vai te machucar.",
          "Evoluir dois personagens ao mesmo tempo: você fica com dois medianos.",
        ]],
        ["Sem gastar dinheiro", [
          "Eventos por tempo limitado costumam dar mais que a loja fixa.",
          "Guarde recursos antes de uma nova temporada; os preços mudam.",
        ]],
      ],
      conselho: "Guarde recurso até saber exatamente no que vai gastar — pressa é o imposto mais caro do jogo.",
    },
    config: {
      resumo: "Ajustes bem feitos em {jogo} devolvem consistência: você erra menos pelos mesmos motivos.",
      blocos: [
        ["Sensibilidade", [
          "Comece baixo e suba de pouco em pouco — sensibilidade alta esconde erro de posicionamento.",
          "Teste sempre no mesmo alvo e na mesma distância para comparar de verdade.",
        ]],
        ["HUD e controles", [
          "Deixe os botões mais usados onde o polegar já descansa.",
          "Reduza a quantidade de botões: menos opções, decisões mais rápidas.",
        ]],
        ["Celular mais fraco", [
          "Baixe a resolução antes de baixar a taxa de quadros.",
          "Feche apps em segundo plano e desative gravação de tela.",
        ]],
      ],
      conselho: "Mude uma configuração por vez e jogue 10 partidas antes de julgar — senão você não sabe o que funcionou.",
    },
  };

  const chamarDemonstracao = async ({ jogo, tipo }) => {
    await new Promise((resolver) => setTimeout(resolver, 900 + Math.random() * 700));

    const receita = RECEITAS[tipo.id] ?? RECEITAS.iniciante;
    const linhas = [receita.resumo.replace("{jogo}", jogo), ""];

    receita.blocos.forEach(([titulo, itens]) => {
      linhas.push(`## ${titulo}`);
      itens.forEach((item) => linhas.push(`- ${item}`));
      linhas.push("");
    });

    linhas.push(`> ${receita.conselho}`);

    return { texto: linhas.join("\n"), truncada: false };
  };

  const consultar = async ({ jogo, tipo, nivel, pergunta, modo, modelo }) => {
    const instrucao = CK.prompt.montarInstrucao();
    const textoPergunta = CK.prompt.montarPergunta({ jogo, tipo, nivel, pergunta });
    const inicio = performance.now();

    cancelamentoManual = false;

    if (modo === "demo") {
      const { texto } = await chamarDemonstracao({ jogo, tipo });
      return {
        texto,
        modelo: "demonstração local",
        modo: "demo",
        ms: Math.round(performance.now() - inicio),
        truncada: false,
      };
    }

    const chave = CK.armazenamento.lerChave();

    if (!chave) {
      throw new ErroOraculo({
        codigo: "SEM_CHAVE",
        titulo: "Chave da API não configurada",
        mensagem: "A aplicação precisa de uma chave do Google AI Studio para falar com o modelo.",
        dica: "Clique em “Configurar a chave” — ou use o modo demonstração para ver a interface funcionando.",
      });
    }

    const descobertos = CK.armazenamento.lerModelosDescobertos().map(({ id }) => id);
    const reserva = descobertos.length ? descobertos : MODELOS.map(({ id }) => id);
    const fila = [modelo, ...reserva.filter((id) => id !== modelo)].slice(0, 5);
    let ultimoErro = null;

    const TROCAR_MODELO = new Set([
      "HTTP 404", "HTTP 429", "HTTP 500", "HTTP 503", "TEMPO_ESGOTADO",
    ]);

    const ORCAMENTO = 45000;

    const restante = () => ORCAMENTO - (performance.now() - inicio);

    const tentar = async (candidato) => {
      const { texto, truncada } = await chamarGemini({
        chave,
        modelo: candidato,
        instrucao,
        pergunta: textoPergunta,
        limite: Math.min(TEMPO_LIMITE, Math.max(restante(), 5000)),
      });

      return {
        texto,
        modelo: candidato,
        modo: "api",
        ms: Math.round(performance.now() - inicio),
        truncada,
      };
    };

    for (const candidato of fila) {
      try {
        return await tentar(candidato);
      } catch (erro) {
        ultimoErro = traduzirRede(erro);
        if (!TROCAR_MODELO.has(ultimoErro.codigo)) throw ultimoErro;

        if (restante() < 5000) throw ultimoErro;
      }
    }

    try {
      const modelos = await listarModelos(chave);
      const novo = modelos.find(({ id }) => !fila.includes(id));

      if (novo) {
        CK.armazenamento.salvarModelosDescobertos(modelos);
        CK.armazenamento.salvarModelo(novo.id);
        return await tentar(novo.id);
      }
    } catch {
    }

    throw ultimoErro;
  };

  const testarChave = async (chave, modelo) => {
    const controlador = new AbortController();
    const relogio = setTimeout(() => controlador.abort(), 12000);

    try {
      const resposta = await fetch(`${BASE}/${modelo}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": chave,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "responda apenas: ok" }] }],
          generationConfig: { maxOutputTokens: 10, temperature: 0 },
        }),
        signal: controlador.signal,
      });

      if (!resposta.ok) {
        const { error } = await resposta.json().catch(() => ({}));
        throw traduzirHttp(resposta.status, error?.message?.slice(0, 90) || "");
      }

      return true;
    } catch (erro) {
      throw traduzirRede(erro);
    } finally {
      clearTimeout(relogio);
    }
  };

  return { consultar, testarChave, listarModelos, cancelar, ErroOraculo };
})();
