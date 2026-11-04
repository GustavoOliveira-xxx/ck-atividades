// =====================================================================
// PROJETO: Painel de Estatísticas do Futebol (Ciência de Dados no Esporte)
// Disciplina: Interface Web II - ETEC Taboão da Serra
// Linguagens: JavaScript + jQuery | Dados: JSON e XML | Armazenamento: Cookie
// Observação: os dados dos jogadores são FICTÍCIOS.
//
// NOVA FUNCIONALIDADE (Trilha 3 - Biblioteca): gráfico de gols por jogador com Chart.js 4.5.1
// Dupla: Gustavo Oliveira dos Santos e Paulo Henrique de Lima Silva - 2°C
// Código novo: BLOCO 7 e as linhas marcadas com [NOVO] nos outros blocos.
//
// Comentários em JavaScript:
//   // comentário de uma linha
//   /* comentário de várias linhas */
// =====================================================================

// AULA 2 - $(document).ready(): só executa o código DEPOIS que o HTML carregou.
// Tudo o que está abaixo fica dentro desta função (escopo da função).
$(document).ready(function () {

  // ===================================================================
  // BLOCO 1 (AULA 1): VARIÁVEIS, TIPOS DE DADOS E ESCOPO
  // ===================================================================
  const LIMITE_DESTAQUE = 0.5;   // const = valor fixo | tipo: number (média mínima para destacar)
  const ESPORTE = "Futebol";     // const | tipo: string (texto entre aspas)
  let jogadores = [];            // let = valor pode mudar | tipo: array (lista de objetos)
  let busca = "";                // let | string vazia: texto digitado na busca
  let filtroPosicao = "Todas";   // let | string: posição escolhida no <select>
  let ordenado = false;          // let | tipo: boolean (true ou false)
  let grafico = null;            // [NOVO] guarda o gráfico do Chart.js depois de criado (null = ainda não existe)
  let metrica = "gols";          // [NOVO] o que o gráfico mostra: "gols" ou "media"

  // Função só de demonstração: mostra tipos e escopo no Console (F12)
  function demonstrarTipos() {
    // typeof devolve o tipo do dado. Atenção: array e null aparecem como "object"
    console.log(typeof ESPORTE, typeof LIMITE_DESTAQUE, typeof ordenado, typeof jogadores, typeof null);

    if (true) {
      let soNoBloco = "visível só aqui";       // let tem ESCOPO DE BLOCO: morre depois do }
      var vazaDoBloco = "var ignora o bloco";  // var "vaza" do bloco (por isso evitamos var)
    }
    console.log(vazaDoBloco);                  // funciona
    // console.log(soNoBloco);                 // ReferenceError! Descomente para ver o erro
  }
  demonstrarTipos(); // chamando (executando) a função

  // ===================================================================
  // BLOCO 2 (AULA 11): COOKIES
  // Cookie = pequeno texto guardado no navegador (~4 KB) com prazo de validade
  // ===================================================================
  function salvarCookie(nome, valor, dias) {
    const d = new Date();                                        // data/hora de agora
    d.setTime(d.getTime() + dias * 24 * 60 * 60 * 1000);         // agora + N dias (em milissegundos)
    // expires = quando o cookie vence | path=/ = vale para o site todo
    document.cookie = nome + "=" + valor + "; expires=" + d.toUTCString() + "; path=/";
  }

  function lerCookie(nome) {
    const partes = document.cookie.split("; ");   // "a=1; b=2" vira ["a=1", "b=2"]
    for (let i = 0; i < partes.length; i++) {     // LAÇO for: percorre cada cookie
      const par = partes[i].split("=");           // "a=1" vira ["a", "1"]
      if (par[0] === nome) { return par[1]; }     // achou: devolve o valor
    }
    return null;                                  // não achou nenhum cookie com esse nome
  }

  function aplicarTema(tema) {
    // toggleClass(classe, condição): liga a classe se a condição for true, desliga se false
    $("body").toggleClass("escuro", tema === "escuro");
    salvarCookie("tema", tema, 7);                // lembra a escolha por 7 dias
    if (grafico !== null) { atualizarGrafico(grafico.listaAtual); } // [NOVO] troca as cores do gráfico junto com o tema
  }
  aplicarTema(lerCookie("tema") || "claro");      // || = se o cookie for null, usa "claro"

  // ===================================================================
  // BLOCO 3 (AULA 3): FUNÇÕES + DOM
  // Função = bloco reutilizável. Recebe PARÂMETROS e pode RETORNAR um valor.
  // ===================================================================

  // Ciência de dados: média de gols por jogo = gols ÷ jogos
  function mediaGols(j) {
    if (j.jogos === 0) { return 0; }                  // evita divisão por zero
    return Number((j.gols / j.jogos).toFixed(2));     // toFixed(2) = 2 casas decimais (vira texto), Number() volta a número
  }

  // Mostra mensagem na tela. O 2º parâmetro é a CLASSE CSS: "ok" ou "erro"
  function mostrar(texto, tipo) {
    $("#mensagem").text(texto).attr("class", tipo);   // .text() muda o texto | .attr() muda o atributo class
  }

  // Redesenha a tabela inteira a partir do array "jogadores" (DOM dinâmico)
  function renderizar() {
    $("#tabelaCorpo").empty();                // limpa o <tbody> para não duplicar linhas
    let lista = jogadores.slice();            // slice() faz uma CÓPIA do array (não altera o original)
    if (ordenado) {
      // sort com função de comparação: maior média primeiro (b - a = ordem decrescente)
      lista.sort(function (a, b) { return mediaGols(b) - mediaGols(a); });
    }

    let somaGols = 0;                         // acumulador
    let exibidos = 0;                         // contador
    const listaGrafico = [];                  // [NOVO] jogadores que passaram na busca/filtro (o gráfico mostra os mesmos da tabela)

    lista.forEach(function (j) {              // forEach: executa a função para CADA jogador
      // CONTROLE DE FLUXO: includes() verifica se o nome contém o texto buscado
      const naBusca = j.nome.toLowerCase().includes(busca.toLowerCase());
      const naPosicao = filtroPosicao === "Todas" || j.posicao === filtroPosicao; // || = OU
      if (!naBusca || !naPosicao) { return; } // ! = NÃO | return no forEach = pular este jogador

      // Cria a linha <tr> com jQuery e marca com a classe "destaque" se a média for alta
      const linha = $("<tr>").toggleClass("destaque", mediaGols(j) >= LIMITE_DESTAQUE);
      // Cria uma coluna <td> para cada valor. .text() evita injeção de HTML (mais seguro)
      [j.nome, j.posicao, j.jogos, j.gols, mediaGols(j)].forEach(function (valor) {
        linha.append($("<td>").text(valor));
      });
      // Coluna do botão remover: data-indice guarda a posição do jogador no array original
      linha.append($("<td>").append(
        $("<button>").text("X").addClass("btn-remover").attr("data-indice", jogadores.indexOf(j))
      ));
      $("#tabelaCorpo").append(linha);        // append coloca a linha dentro do <tbody>
      somaGols += j.gols;                     // soma gols dos jogadores exibidos
      exibidos++;                             // ++ soma 1 ao contador
      listaGrafico.push(j);                   // [NOVO] guarda o jogador para o gráfico
    });

    // AULA 5 - LAÇO for clássico: descobre o artilheiro (maior número de gols)
    let artilheiro = null;                    // null = "ainda não há candidato"
    for (let i = 0; i < jogadores.length; i++) {
      if (artilheiro === null || jogadores[i].gols > artilheiro.gols) {
        artilheiro = jogadores[i];            // guarda o jogador com mais gols até agora
      }
    }

    // Monta o texto-resumo. O operador ternário (cond ? a : b) funciona como um if/else curto
    const media = exibidos ? (somaGols / exibidos).toFixed(1) : 0;
    const nomeArtilheiro = artilheiro ? artilheiro.nome : "-";
    $("#resumoTexto").text(ESPORTE + ": " + exibidos + " jogadores | " + somaGols +
      " gols | média por jogador: " + media + " | artilheiro: " + nomeArtilheiro);

    atualizarGrafico(listaGrafico);           // [NOVO] toda vez que a tabela muda, o gráfico muda junto
  }

  // ===================================================================
  // BLOCO 4 (AULAS 4 e 6): EVENTOS e MANIPULAÇÃO COM jQuery
  // .on("evento", função) = "quando o evento acontecer, execute a função"
  // ===================================================================
  $("#busca").on("input", function () {               // "input": a cada letra digitada
    busca = $(this).val();                            // $(this) = o elemento que disparou o evento | .val() lê o valor
    renderizar();
  });

  $("#filtroPosicao").on("change", function () {      // "change": quando troca a opção do select
    filtroPosicao = $(this).val();
    renderizar();
  });

  $("#btnOrdenar").on("click", function () {          // "click": clique do mouse
    ordenado = !ordenado;                             // ! inverte o boolean: true vira false e vice-versa
    renderizar();
  });

  $("#btnTema").on("click", function () {
    // hasClass() pergunta se o elemento tem a classe; troca o tema e grava o cookie
    aplicarTema($("body").hasClass("escuro") ? "claro" : "escuro");
  });

  // DELEGAÇÃO DE EVENTOS: o evento fica no PAI (#tabelaCorpo), que já existe.
  // Assim funciona também para botões criados DEPOIS pelo renderizar().
  $("#tabelaCorpo").on("click", ".btn-remover", function () {
    // splice(posição, 1) remove 1 item do array a partir da posição indicada
    jogadores.splice(Number($(this).attr("data-indice")), 1);
    renderizar();
  });

  // ===================================================================
  // BLOCO 5 (AULA 7): MANIPULAÇÃO DE ERROS (try / catch / throw / finally)
  // ===================================================================
  function lerNumero(texto) {
    const n = Number(texto);                          // converte texto em número (ou NaN se não der)
    if (texto === "" || isNaN(n) || n < 0) {          // isNaN = "is Not a Number"
      throw new Error("Número inválido: " + texto);   // throw = LANÇA um erro e interrompe a função
    }
    return n;
  }

  function adicionar() {
    try {                                             // try: "tente executar..."
      const nome = $("#novoNome").val().trim();       // trim() remove espaços das pontas
      if (nome === "") { throw new Error("Digite o nome do jogador."); }
      const jogos = lerNumero($("#novoJogos").val()); // se der erro, o código PULA para o catch
      const gols = lerNumero($("#novoGols").val());
      if (jogos === 0) { throw new Error("O jogador precisa ter ao menos 1 jogo."); }

      // push() adiciona um OBJETO {chave: valor} no fim do array
      jogadores.push({ nome: nome, posicao: $("#novaPosicao").val(), jogos: jogos, gols: gols });
      renderizar();
      mostrar("Jogador adicionado!", "ok");
      $("#novoNome, #novoJogos, #novoGols").val("");  // seletor múltiplo: limpa os 3 campos
    } catch (erro) {                                  // catch: "se algo falhou, trate aqui"
      mostrar(erro.message, "erro");                  // erro.message = texto que escrevemos no throw
    } finally {                                       // finally: executa SEMPRE, com ou sem erro
      $("#novoNome").focus();                         // devolve o cursor ao campo nome
    }
  }
  $("#btnAdicionar").on("click", adicionar);          // passamos a função SEM parênteses
  $("#novoGols").on("keypress", function (e) {        // "keypress": tecla pressionada
    if (e.key === "Enter") { adicionar(); }           // reaproveita a função, sem duplicar lógica
  });

  // ===================================================================
  // BLOCO 6 (AULAS 8, 9 e 10): JSON, XML e AJAX
  // AJAX = buscar dados no servidor SEM recarregar a página (ASSÍNCRONO).
  // IMPORTANTE: precisa do Live Server (http://), não funciona com file://
  // ===================================================================

  // --- JSON: $.getJSON já converte o texto JSON em array/objeto JavaScript ---
  $("#btnJson").on("click", function () {
    $.getJSON("jogadores.json")                       // faz o pedido ao arquivo
      .done(function (dados) {                        // .done = deu CERTO
        jogadores = dados;                            // dados já é um array de objetos
        renderizar();
        mostrar("JSON carregado: " + dados.length + " jogadores.", "ok");
      })
      .fail(function () {                             // .fail = deu ERRADO (404, rede, JSON inválido)
        mostrar("Falha ao carregar o JSON. Use o Live Server.", "erro");
      });
  });

  // --- XML: precisamos PERCORRER as tags e montar os objetos manualmente ---
  $("#btnXml").on("click", function () {
    $.ajax({ url: "jogadores.xml", dataType: "xml" }) // dataType "xml": jQuery já entrega o XML como documento
      .done(function (xml) {
        jogadores = [];                               // esvazia a lista atual
        $(xml).find("jogador").each(function () {     // find: procura todas as tags <jogador> | each: repete para cada uma
          jogadores.push({
            nome: $(this).find("nome").text(),        // .text() lê o conteúdo da tag
            posicao: $(this).find("posicao").text(),
            jogos: Number($(this).find("jogos").text()), // no XML tudo é TEXTO: Number() converte
            gols: Number($(this).find("gols").text())
          });
        });
        renderizar();
        mostrar("XML carregado: " + jogadores.length + " jogadores.", "ok");
      })
      .fail(function () {
        mostrar("Falha ao carregar o XML. Use o Live Server.", "erro");
      });
  });

  // --- JSON.stringify e JSON.parse: ida e volta entre objeto e texto ---
  $("#btnExportar").on("click", function () {
    const texto = JSON.stringify(jogadores, null, 2); // objeto -> texto JSON (2 = espaços de indentação)
    $("#saidaJson").text(texto);                      // mostra o texto na <pre>
    const volta = JSON.parse(texto);                  // texto JSON -> objeto novamente
    console.log("Ida e volta OK:", volta.length, "jogadores");
  });

  // ===================================================================
  // BLOCO 7 [NOVO]: GRÁFICO DE GOLS POR JOGADOR (biblioteca Chart.js)
  // A ideia: o gráfico é criado UMA vez e depois só trocamos os dados com update().
  // Ele é chamado no fim do renderizar(), então se atualiza sozinho.
  // ===================================================================

  // Lê uma variável CSS do <body> (assim o gráfico usa as mesmas cores do tema claro/escuro)
  function corDoTema(nomeVariavel) {
    return getComputedStyle(document.body).getPropertyValue(nomeVariavel).trim(); // trim() tira espaços que o navegador pode devolver
  }

  function atualizarGrafico(lista) {
    try {
      // Se a CDN e a cópia local falharem, "Chart" não existe. Sem isso dava ReferenceError e o resto parava.
      if (typeof Chart === "undefined") {
        throw new Error("Gráfico indisponível: a biblioteca Chart.js não carregou (sem internet e sem o arquivo chart.umd.min.js).");
      }

      // map() cria um array NOVO a partir de outro: aqui, uma lista só com os nomes
      const nomes = lista.map(function (j) { return j.nome; });
      // Operador ternário escolhe o valor de cada barra: gols ou média (mediaGols já existe no BLOCO 3)
      const valores = lista.map(function (j) { return metrica === "gols" ? j.gols : mediaGols(j); });
      // Mesma regra da tabela: média >= LIMITE_DESTAQUE ganha a cor de destaque
      const cores = lista.map(function (j) { return mediaGols(j) >= LIMITE_DESTAQUE ? "#e0b400" : corDoTema("--campo"); });
      const corTexto = corDoTema("--texto");           // cor das letras (muda no tema escuro)
      const corGrade = "rgba(136, 136, 136, 0.25)";    // linhas de fundo bem fraquinhas

      if (grafico === null) {                          // 1ª vez: cria o gráfico
        grafico = new Chart(document.getElementById("graficoGols"), {
          type: "bar",                                 // gráfico de barras
          data: { labels: [], datasets: [{ label: "Gols", data: [], backgroundColor: [], borderRadius: 6 }] },
          options: {
            responsive: true,                          // acompanha o tamanho da tela
            maintainAspectRatio: false,                // usa a altura da .grafico-caixa do CSS
            plugins: { legend: { display: false } },   // a legenda de cores já está no HTML
            scales: {
              x: { ticks: {}, grid: {} },
              y: { beginAtZero: true, ticks: {}, grid: {} } // eixo Y começa no zero
            }
          }
        });
      }

      // Daqui pra baixo roda SEMPRE: troca os dados do gráfico que já existe
      grafico.listaAtual = lista;                      // guardo a lista para o aplicarTema() redesenhar com ela
      grafico.data.labels = nomes;
      grafico.data.datasets[0].data = valores;
      grafico.data.datasets[0].backgroundColor = cores;
      grafico.data.datasets[0].label = metrica === "gols" ? "Gols" : "Média de gols por jogo";
      // gols são inteiros (precision 0); média tem casas decimais (precision 2)
      grafico.options.scales.y.ticks.precision = metrica === "gols" ? 0 : 2;
      // cores das letras e da grade em cada eixo (forEach passa por "x" e "y")
      ["x", "y"].forEach(function (eixo) {
        grafico.options.scales[eixo].ticks.color = corTexto;
        grafico.options.scales[eixo].grid.color = corGrade;
      });
      grafico.update();                                // manda o Chart.js redesenhar com os dados novos

      // Acessibilidade: o canvas é só desenho, então escrevo um resumo no aria-label
      const resumo = lista.map(function (j, i) { return j.nome + " " + valores[i]; }).join(", ");
      $("#graficoGols").attr("aria-label", "Gráfico de " + (metrica === "gols" ? "gols" : "média de gols") + " por jogador: " + (resumo || "sem jogadores"));

      // Aviso na tela quando a busca/filtro não deixa ninguém
      if (lista.length === 0) {
        $("#graficoAviso").text("Nenhum jogador para mostrar no gráfico.").attr("class", "erro");
      } else {
        $("#graficoAviso").text("").attr("class", "");
      }
    } catch (erro) {
      // Mostra o erro na TELA (não só no Console) e deixa a tabela funcionando normalmente
      $("#graficoAviso").text(erro.message).attr("class", "erro");
      console.error("[Gráfico]", erro.message);
    }
  }

  // Botão que alterna o gráfico entre "gols" e "média por jogo"
  $("#btnMetrica").on("click", function () {
    metrica = metrica === "gols" ? "media" : "gols";   // inverte a métrica
    $(this).text(metrica === "gols" ? "Ver média por jogo" : "Ver total de gols") // texto do botão
           .attr("aria-pressed", metrica === "media");  // avisa o leitor de tela se está "apertado"
    $("#tituloGrafico").text(metrica === "gols" ? "Gols por jogador" : "Média de gols por jogo");
    renderizar();                                      // redesenha tabela + gráfico
  });

  // Ao abrir a página, carrega o JSON automaticamente simulando o clique no botão
  $("#btnJson").trigger("click");

}); // fim do $(document).ready
