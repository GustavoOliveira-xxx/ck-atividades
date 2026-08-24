/* ============================================================================
   ORÁCULO CK — armazenamento.js
   Camada fina sobre o localStorage. Fica isolada aqui para que o resto do
   código não precise saber onde nem como os dados são guardados — e para que
   uma falha do localStorage (modo anônimo, cota cheia, site data bloqueado)
   nunca derrube a aplicação.
   ========================================================================== */

window.CK = window.CK || {};

CK.armazenamento = (() => {
  "use strict";

  const PREFIXO = "oraculo-ck:";
  const CHAVE_API = `${PREFIXO}chave`;
  const CHAVE_MODELO = `${PREFIXO}modelo`;
  const CHAVE_HISTORICO = `${PREFIXO}historico`;
  const CHAVE_MODELOS = `${PREFIXO}modelos`;
  const LIMITE_HISTORICO = 8;

  /* ---------- acesso protegido ---------- */

  const ler = (chave) => {
    try {
      return localStorage.getItem(chave);
    } catch {
      return null;
    }
  };

  const gravar = (chave, valor) => {
    try {
      localStorage.setItem(chave, valor);
      return true;
    } catch {
      return false;
    }
  };

  const apagar = (chave) => {
    try {
      localStorage.removeItem(chave);
      return true;
    } catch {
      return false;
    }
  };

  /* ---------- chave da API ---------- */

  const lerChave = () => (ler(CHAVE_API) || CK.config.CHAVE_EMBUTIDA || "").trim();

  const salvarChave = (chave) => gravar(CHAVE_API, String(chave || "").trim());

  const apagarChave = () => apagar(CHAVE_API);

  const temChave = () => lerChave().length > 0;

  /* ---------- modelos descobertos na API ---------- */

  /** Lista real de modelos, consultada na API e guardada aqui. */
  const lerModelosDescobertos = () => {
    try {
      const lista = JSON.parse(ler(CHAVE_MODELOS) || "[]");
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  };

  const salvarModelosDescobertos = (lista) =>
    gravar(CHAVE_MODELOS, JSON.stringify(lista.slice(0, 20)));

  /** Catálogo em uso: o descoberto, se houver; senão a semente de config.js. */
  const catalogoModelos = () => {
    const descobertos = lerModelosDescobertos();
    return descobertos.length ? descobertos : CK.config.MODELOS;
  };

  /* ---------- modelo escolhido ---------- */

  const lerModelo = () => {
    const salvo = ler(CHAVE_MODELO);
    const catalogo = catalogoModelos();
    const existe = catalogo.some(({ id }) => id === salvo);
    if (existe) return salvo;
    // O modelo salvo sumiu do catálogo: assume o primeiro da lista.
    return catalogo[0]?.id || CK.config.MODELO_PADRAO;
  };

  const salvarModelo = (modelo) => gravar(CHAVE_MODELO, modelo);

  /* ---------- histórico de consultas ---------- */

  const lerHistorico = () => {
    try {
      const bruto = ler(CHAVE_HISTORICO);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  };

  const adicionarHistorico = (registro) => {
    const lista = lerHistorico();
    const novo = { ...registro, quando: Date.now() };
    const atualizada = [novo, ...lista].slice(0, LIMITE_HISTORICO);
    gravar(CHAVE_HISTORICO, JSON.stringify(atualizada));
    return atualizada;
  };

  const limparHistorico = () => {
    apagar(CHAVE_HISTORICO);
    return [];
  };

  return {
    lerChave,
    salvarChave,
    apagarChave,
    temChave,
    lerModelo,
    salvarModelo,
    lerModelosDescobertos,
    salvarModelosDescobertos,
    catalogoModelos,
    lerHistorico,
    adicionarHistorico,
    limparHistorico,
    LIMITE_HISTORICO,
  };
})();
