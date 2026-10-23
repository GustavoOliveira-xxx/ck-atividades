const IDENTIFICACAO = {
  aluno: "Gustavo Oliveira dos Santos",
  escola: "ETEC Taboão da Serra",
  curso: "Informática para Internet (MTec)",
  turma: "2º C",
  componente: "Interfaces Web II",
  professor: "Clayton de Almeida Souza",
  bimestre: "4º bimestre",
  data: "23/10/2026",
  titulo: "Atividade de Revisão",
  subtitulo: "JavaScript, jQuery e DOM · IA e Segurança Digital",
};

const FONTES = {
  revisao: {
    cit: "SOUZA, 2026",
    curta: "Atividade de Revisão, material do Prof. Clayton",
    abnt: "SOUZA, Clayton de Almeida. Atividade de revisão: JavaScript, jQuery e DOM; IA e Segurança Digital. Interfaces Web II. Taboão da Serra: ETEC Taboão da Serra, 2026. Material de aula.",
    url: "",
  },
  lista: {
    cit: "SANTOS, 2026",
    curta: "Minha atividade \"Minha Lista de Estudos\"",
    abnt: "SANTOS, Gustavo Oliveira dos. Minha Lista de Estudos. Taboão da Serra, 2026. Atividade de Interfaces Web II. Disponível em: https://github.com/GustavoOliveira-xxx/ck-atividades/tree/main/atividades/minha-lista-estudos. Acesso em: 23 out. 2026.",
    url: "https://github.com/GustavoOliveira-xxx/ck-atividades/tree/main/atividades/minha-lista-estudos",
  },
  fato: {
    cit: "SANTOS; SILVA, 2026",
    curta: "Meu trabalho \"Fato ou Ruído?\"",
    abnt: "SANTOS, Gustavo Oliveira dos; SILVA, Paulo Henrique de Lima. Fato ou Ruído? Análise crítica da notícia sobre IA no Medicare. Taboão da Serra, 2026. Atividade de Interfaces Web II. Disponível em: https://github.com/GustavoOliveira-xxx/ck-atividades/tree/main/atividades/analise-critica-ia. Acesso em: 23 out. 2026.",
    url: "https://github.com/GustavoOliveira-xxx/ck-atividades/tree/main/atividades/analise-critica-ia",
  },
  mdnDom: {
    cit: "MDN WEB DOCS, [s.d.]c",
    curta: "MDN: Introdução ao DOM",
    abnt: "MDN WEB DOCS. Introdução ao DOM. Mozilla, [s.d.]. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Introduction. Acesso em: 23 out. 2026.",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Introduction",
  },
  jqDownload: {
    cit: "OPENJS FOUNDATION, [s.d.]b",
    curta: "jQuery: Download (CDN)",
    abnt: "OPENJS FOUNDATION. Download jQuery. [s.d.]. Disponível em: https://jquery.com/download/. Acesso em: 23 out. 2026.",
    url: "https://jquery.com/download/",
  },
  jqReady: {
    cit: "OPENJS FOUNDATION, [s.d.]e",
    curta: "jQuery API: .ready()",
    abnt: "OPENJS FOUNDATION. .ready(). jQuery API Documentation, [s.d.]. Disponível em: https://api.jquery.com/ready/. Acesso em: 23 out. 2026.",
    url: "https://api.jquery.com/ready/",
  },
  jqSeletores: {
    cit: "OPENJS FOUNDATION, [s.d.]c",
    curta: "jQuery API: seletores de id e de classe",
    abnt: "OPENJS FOUNDATION. ID Selector (\"#id\") e Class Selector (\".class\"). jQuery API Documentation, [s.d.]. Disponível em: https://api.jquery.com/category/selectors/. Acesso em: 23 out. 2026.",
    url: "https://api.jquery.com/category/selectors/",
  },
  jqOn: {
    cit: "OPENJS FOUNDATION, [s.d.]d",
    curta: "jQuery API: .on()",
    abnt: "OPENJS FOUNDATION. .on(). jQuery API Documentation, [s.d.]. Disponível em: https://api.jquery.com/on/. Acesso em: 23 out. 2026.",
    url: "https://api.jquery.com/on/",
  },
  jqValText: {
    cit: "OPENJS FOUNDATION, [s.d.]f",
    curta: "jQuery API: .val() e .text()",
    abnt: "OPENJS FOUNDATION. .val() e .text(). jQuery API Documentation, [s.d.]. Disponível em: https://api.jquery.com/val/ e https://api.jquery.com/text/. Acesso em: 23 out. 2026.",
    url: "https://api.jquery.com/val/",
  },
  jqAppend: {
    cit: "OPENJS FOUNDATION, [s.d.]a",
    curta: "jQuery API: .append()",
    abnt: "OPENJS FOUNDATION. .append(). jQuery API Documentation, [s.d.]. Disponível em: https://api.jquery.com/append/. Acesso em: 23 out. 2026.",
    url: "https://api.jquery.com/append/",
  },
  mdnIf: {
    cit: "MDN WEB DOCS, [s.d.]b",
    curta: "MDN: if...else e String.trim()",
    abnt: "MDN WEB DOCS. if...else e String.prototype.trim(). Mozilla, [s.d.]. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else. Acesso em: 23 out. 2026.",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/if...else",
  },
  mdnLetConst: {
    cit: "MDN WEB DOCS, [s.d.]d",
    curta: "MDN: let e const",
    abnt: "MDN WEB DOCS. let e const. Mozilla, [s.d.]. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/const. Acesso em: 23 out. 2026.",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/const",
  },
  mdnKeydown: {
    cit: "MDN WEB DOCS, [s.d.]a",
    curta: "MDN: evento keydown (e aviso sobre keypress)",
    abnt: "MDN WEB DOCS. Element: keydown event e Element: keypress event. Mozilla, [s.d.]. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/API/Element/keydown_event. Acesso em: 23 out. 2026.",
    url: "https://developer.mozilla.org/pt-BR/docs/Web/API/Element/keydown_event",
  },
  tecnoblog: {
    cit: "HILDEBRAND, 2026",
    curta: "Tecnoblog, 25/09/2026",
    abnt: "HILDEBRAND, Yuri. Agente da OpenAI \"não aceitou não\" e invadiu sistema de saúde. Tecnoblog, 25 set. 2026. Disponível em: https://tecnoblog.net/noticias/agente-da-openai-nao-aceitou-nao-e-invadiu-sistema-de-saude/. Acesso em: 23 out. 2026.",
    url: "https://tecnoblog.net/noticias/agente-da-openai-nao-aceitou-nao-e-invadiu-sistema-de-saude/",
  },
  globe: {
    cit: "OPENAI..., 2026",
    curta: "The Boston Globe / The New York Times, 24/09/2026",
    abnt: "OPENAI agent hacked public health care site, Australia says. The Boston Globe, 24 set. 2026. Republicação de The New York Times. Disponível em: https://www.bostonglobe.com/2026/09/24/world/openai-agent-hacked-public-health-care-site-australia-says/. Acesso em: 23 out. 2026.",
    url: "https://www.bostonglobe.com/2026/09/24/world/openai-agent-hacked-public-health-care-site-australia-says/",
  },
  jn: {
    cit: "JORNAL NACIONAL, 2026",
    curta: "Jornal Nacional (G1), 24/09/2026, citado no material",
    abnt: "JORNAL NACIONAL. Austrália investiga invasão do sistema de saúde pela IA. G1, 24 set. 2026. Reportagem citada no material da aula.",
    url: "",
  },
};

const RESUMO_JS = [
  {
    titulo: "DOM: a página vira uma árvore",
    texto:
      "Quando o navegador abre um HTML, ele monta o DOM: cada tag vira um nó de uma árvore (html, body, main, ul, li...). O JavaScript não mexe no arquivo .html, ele mexe nessa árvore que está na memória. Por isso dá para mudar um texto, trocar uma classe ou criar um item novo sem recarregar a página.",
    codigo: `<main>
  <input id="campoAtividade">
  <button id="btnAdicionar">Adicionar</button>
  <ul id="listaAtividades"></ul>
</main>`,
    linguagem: "html",
  },
  {
    titulo: "jQuery: menos código para o mesmo resultado",
    texto:
      "jQuery é uma biblioteca de JavaScript. Ela não é outra linguagem: por baixo, tudo continua sendo JavaScript. Ela entra no projeto por uma tag <script> que aponta para a CDN, e precisa vir antes do meu script, senão o $ ainda não existe quando meu código roda.",
    codigo: `<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="script.js" defer></script>`,
    linguagem: "html",
  },
  {
    titulo: "Esperar a página carregar",
    texto:
      "$(document).ready() guarda o meu código e só executa quando o DOM está pronto. Sem isso, o script poderia procurar o #btnAdicionar antes de o botão existir e não encontrar nada. Na versão 3 do jQuery a forma curta $(function () { ... }) faz a mesma coisa.",
    codigo: `$(document).ready(function () {
  // aqui os elementos já existem
});`,
    linguagem: "js",
  },
  {
    titulo: "Seletores, eventos e métodos",
    texto:
      "O seletor diz qual elemento eu quero: # para id, . para classe e o nome da tag para todas as tags iguais. Depois uso um método: .on() para ouvir um evento, .val() para ler ou limpar um campo, .text() para trocar o texto, .attr() para mudar um atributo, .append() para colocar um filho no final e .focus() para devolver o cursor ao campo.",
    codigo: `$("#btnAdicionar").on("click", adicionarAtividade);
$("#mensagem").text("Atividade adicionada!").attr("class", "ok");
$("#campoAtividade").val("").focus();`,
    linguagem: "js",
  },
  {
    titulo: "Variáveis e condição",
    texto:
      "Uso let quando o valor vai mudar (o contador total) e const quando ele não muda depois de criado (o texto digitado naquele clique). O if valida o campo: .trim() tira os espaços das pontas, então um campo só com espaços também conta como vazio, e o return para a função antes de adicionar um item em branco.",
    codigo: `let total = 0;

function adicionarAtividade() {
  const atividade = $("#campoAtividade").val().trim();

  if (atividade === "") {
    $("#mensagem").text("Digite uma atividade antes de adicionar.")
                  .attr("class", "erro");
    return;
  }

  $("#listaAtividades").append($("<li>").text(atividade));
  total++;
  $("#contador").text("Atividades: " + total);
}`,
    linguagem: "js",
  },
];

const RESUMO_IA = [
  {
    titulo: "O caso",
    texto:
      "Em setembro de 2026 o primeiro-ministro da Austrália, Anthony Albanese, disse que um agente de IA da OpenAI, durante testes internos da empresa, acessou sem autorização partes não públicas de um portal de estatísticas do Medicare, o sistema público de saúde. A empresa só avisou o governo em 10 de setembro, meses depois do acesso. O governo abriu investigação e passou a rever as regras sobre IA.",
  },
  {
    titulo: "Fato, opinião e não confirmado",
    texto:
      "Fato é o que dá para conferir (datas, quem declarou o quê). Opinião é um julgamento, como dizer que o caso foi \"inaceitável\". Não confirmado é o que alguém alega sem prova apresentada, como a atividade desde março citada por uma organização independente.",
  },
  {
    titulo: "Como avaliar as fontes",
    texto:
      "Procurar a fonte original, ver se outros veículos confirmam, comparar datas e números e conferir se a parte acusada foi ouvida. No próprio caso, as fontes divergem na data da invasão (18 de junho ou 18 de julho) e em quantos portais foram afetados.",
  },
  {
    titulo: "Segurança digital",
    texto:
      "Os riscos que aparecem são acesso não autorizado, demora para comunicar o incidente e falha de monitoramento. As medidas de prevenção são controle de acesso, registros (logs), monitoramento constante, prazo para avisar incidentes e regulação.",
  },
  {
    titulo: "Ligação com Interface Web",
    texto:
      "No trabalho \"Fato ou Ruído?\" usei HTML semântico, CSS responsivo e JavaScript com eventos, arrays de objetos e validação para transformar a notícia em exercícios: o leitor classifica afirmações, marca um checklist e escreve um parecer.",
  },
];

const LINHA_DO_TEMPO = [
  { data: "18 jun. 2026", fato: "Data do acesso segundo o NYT e o governo. Outra fonte fala em 18 de julho.", tipo: "divergente" },
  { data: "10 set. 2026", fato: "A OpenAI avisa o governo australiano por e-mail.", tipo: "fato" },
  { data: "23 e 24 set. 2026", fato: "Albanese fala do caso em Nova York, durante a Assembleia Geral da ONU.", tipo: "fato" },
  { data: "24 set. 2026", fato: "Reportagem do Jornal Nacional e alerta da agência de cibersegurança (ASD).", tipo: "fato" },
  { data: "Desde março?", fato: "Organização independente alega atividade anterior. Ninguém confirmou.", tipo: "incerto" },
];

const QUESTOES = [
  {
    n: 1,
    parte: "js",
    pergunta: "O que é o DOM e por que ele é importante para criar páginas interativas?",
    resposta:
      "O DOM (Document Object Model) é a representação da página HTML como uma árvore de objetos que o navegador monta na memória. Cada tag vira um nó, e o JavaScript consegue ler e alterar esses nós. Ele é importante porque é por ele que a página reage ao usuário sem recarregar: na minha Lista de Estudos, quando clico em Adicionar, o script cria um <li> novo dentro do <ul> e atualiza o contador, e tudo isso acontece no DOM, não no arquivo .html.",
    codigo: `// O <ul> já existe no HTML; o <li> é criado na hora, no DOM
$("#listaAtividades").append($("<li>").text("Estudar jQuery"));`,
    fontes: ["revisao", "mdnDom", "lista"],
  },
  {
    n: 2,
    parte: "js",
    pergunta: "O que é jQuery e como ela é adicionada a um projeto HTML?",
    resposta:
      "jQuery é uma biblioteca JavaScript que deixa mais curto o código para selecionar elementos, tratar eventos e alterar o DOM. Ela é adicionada com uma tag <script> que aponta para a CDN (ou para um arquivo baixado), colocada antes do meu script.js, porque o meu código usa o $ e ele só existe depois que a biblioteca carrega. No meu projeto usei a versão 3.7.1 pela CDN oficial.",
    codigo: `<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="script.js" defer></script>`,
    fontes: ["revisao", "jqDownload", "lista"],
  },
  {
    n: 3,
    parte: "js",
    pergunta: "Para que serve o comando $(document).ready()?",
    resposta:
      "Ele faz o código esperar até o DOM estar pronto para ser manipulado. Se o script rodasse antes, um seletor como $(\"#btnAdicionar\") poderia não encontrar o botão e o clique não funcionaria. Por isso coloquei todo o código da lista dentro dele. Vi na documentação que no jQuery 3 a forma recomendada é a curta, $(function () { ... }), que faz a mesma coisa; $(document).ready() ainda funciona.",
    codigo: `$(document).ready(function () {
  let total = 0;
  // eventos e funções da lista
});

// forma curta, mesmo efeito
$(function () { /* ... */ });`,
    fontes: ["revisao", "jqReady"],
  },
  {
    n: 4,
    parte: "js",
    pergunta: "Explique a diferença entre os seletores $(\"#campoAtividade\") e $(\".erro\").",
    resposta:
      "O # seleciona pelo id. Como o id deve ser único na página, $(\"#campoAtividade\") pega um elemento só: o campo de texto da lista. O ponto seleciona pela classe, então $(\".erro\") pega todos os elementos que tiverem class=\"erro\", podendo ser vários ou nenhum. Na minha atividade, .erro é a classe que o script coloca na mensagem quando o campo está vazio, e o CSS dela deixa o texto em vermelho.",
    codigo: `$("#campoAtividade")  // um elemento: id="campoAtividade"
$(".erro")            // todos com class="erro"
$("li")               // todas as tags <li>`,
    fontes: ["revisao", "jqSeletores", "lista"],
  },
  {
    n: 5,
    parte: "js",
    pergunta: "O que acontece quando usamos .on(\"click\", ...) em um botão?",
    resposta:
      ".on() registra um ouvinte de evento. A função passada não roda na hora: ela fica guardada e o navegador chama essa função toda vez que o usuário clica no botão. Na Lista de Estudos, $(\"#btnAdicionar\").on(\"click\", adicionarAtividade) faz com que cada clique leia o campo, valide e adicione o item. Passei o nome da função sem parênteses justamente para ela ser chamada no clique, e não no carregamento.",
    codigo: `$("#btnAdicionar").on("click", adicionarAtividade);
// errado: adicionarAtividade() rodaria uma vez ao carregar`,
    fontes: ["revisao", "jqOn", "lista"],
  },
  {
    n: 6,
    parte: "js",
    pergunta: "Qual a função dos métodos .val() e .text()? Dê um exemplo de uso de cada.",
    resposta:
      ".val() trabalha com o valor de campos de formulário (input, select, textarea). Sem argumento ele lê o que foi digitado; com argumento ele troca o valor. .text() trabalha com o texto de dentro de um elemento comum, como <p> ou <li>: lê ou substitui o texto. Exemplos da minha lista: .val() lê a atividade digitada e depois .val(\"\") limpa o campo; .text() escreve \"Atividades: 3\" no parágrafo do contador.",
    codigo: `const atividade = $("#campoAtividade").val(); // lê
$("#campoAtividade").val("");                  // limpa
$("#contador").text("Atividades: " + total);   // troca o texto`,
    fontes: ["revisao", "jqValText", "lista"],
  },
  {
    n: 7,
    parte: "js",
    pergunta: "Por que usamos o if na atividade \"Minha Lista de Estudos\"? O que ele verifica?",
    resposta:
      "O if valida a entrada antes de adicionar. Ele verifica se o texto digitado, depois do .trim(), ficou igual a uma string vazia. Se ficou, mostra a mensagem \"Digite uma atividade antes de adicionar.\" com a classe erro e o return encerra a função, então nenhum item em branco entra na lista e o contador não aumenta. O .trim() é importante porque, sem ele, alguém poderia digitar só espaços e passar pela validação.",
    codigo: `const atividade = $("#campoAtividade").val().trim();
if (atividade === "") {
  $("#mensagem").text("Digite uma atividade antes de adicionar.")
                .attr("class", "erro");
  return;
}`,
    fontes: ["revisao", "mdnIf", "lista"],
  },
  {
    n: 8,
    parte: "js",
    pergunta: "Explique a diferença entre let e const, usando o contador da lista como exemplo.",
    resposta:
      "let cria uma variável que pode receber outro valor depois; const cria uma que não pode ser reatribuída. O contador total é let porque começa em 0 e aumenta a cada item (total++). Se ele fosse const, o total++ daria erro. Já a atividade é const porque, dentro de cada clique, o texto lido não muda mais; no clique seguinte a função roda de novo e cria outra const. As duas têm escopo de bloco.",
    codigo: `let total = 0;   // muda: total++ a cada item
total++;         // ok

const atividade = "Revisar DOM";
// atividade = "outra";  // TypeError: não pode reatribuir`,
    fontes: ["revisao", "mdnLetConst", "lista"],
  },
  {
    n: 9,
    parte: "js",
    pergunta: "Como o método .append() ajuda a criar novos itens na página?",
    resposta:
      ".append() coloca um conteúdo como último filho do elemento selecionado. Na lista eu crio um <li> com $(\"<li>\").text(atividade) e uso $(\"#listaAtividades\").append(novoItem) para ele aparecer no fim do <ul>. Assim cada atividade nova vai para baixo da anterior sem apagar o que já estava lá. Usar .text() para colocar o conteúdo também evita que alguém digite HTML e ele seja interpretado como código.",
    codigo: `const novoItem = $("<li>").text(atividade);
$("#listaAtividades").append(novoItem);`,
    fontes: ["revisao", "jqAppend", "lista"],
  },
  {
    n: 10,
    parte: "js",
    pergunta: "Como poderíamos adicionar uma atividade pressionando a tecla Enter? Qual evento seria usado?",
    resposta:
      "Usando um evento de teclado no campo de texto e conferindo qual tecla foi apertada. Eu fiz esse desafio com o evento keydown: se evento.key for \"Enter\", chamo a mesma função adicionarAtividade() do botão, então a validação e o contador funcionam igual. O material cita keypress também, mas a MDN marca o keypress como obsoleto e recomenda keydown, por isso escolhi keydown.",
    codigo: `$("#campoAtividade").on("keydown", function (evento) {
  if (evento.key === "Enter") {
    adicionarAtividade();
  }
});`,
    fontes: ["revisao", "mdnKeydown", "lista"],
  },
  {
    n: 11,
    parte: "ia",
    pergunta: "Resuma, com suas palavras, o caso do agente de IA que acessou o sistema de saúde australiano.",
    resposta:
      "Um agente de IA da OpenAI, que estava sendo testado pela própria empresa, encontrou bloqueios num portal de estatísticas do Medicare e mesmo assim chegou a partes que não eram públicas. O acesso aconteceu em junho, mas a OpenAI só avisou o governo da Austrália em 10 de setembro. O primeiro-ministro Anthony Albanese contou o caso em Nova York, na época da Assembleia Geral da ONU, e chamou a situação de inaceitável. A empresa disse que não acessou prontuários de pacientes, só estatísticas e nomes de arquivos. O governo abriu investigação e a agência de cibersegurança do país emitiu um alerta para sites públicos.",
    codigo: "",
    fontes: ["revisao", "jn", "tecnoblog", "globe"],
  },
  {
    n: 12,
    parte: "ia",
    pergunta: "Qual é a diferença entre um fato, uma opinião e uma informação não confirmada? Dê um exemplo de cada.",
    resposta:
      "Fato é algo que pode ser verificado em registros ou declarações. Exemplo: a OpenAI avisou o governo australiano em 10 de setembro de 2026. Opinião é um julgamento de valor de alguém, que não dá para provar como certo ou errado. Exemplo: \"o acesso foi inaceitável\", frase de Albanese. Não confirmado é uma alegação que ainda não tem prova apresentada. Exemplo: a organização independente que diz que havia atividade não autorizada desde março.",
    codigo: "",
    fontes: ["revisao", "fato", "tecnoblog"],
  },
  {
    n: 13,
    parte: "ia",
    pergunta: "Cite três perguntas que ajudam a avaliar se uma notícia é confiável.",
    resposta:
      "1) Qual é a fonte original da informação e ela está identificada (governo, empresa, documento)? 2) Outros veículos confirmam os mesmos fatos, com as mesmas datas e números? 3) A parte acusada foi ouvida? Usando essas perguntas no caso da Austrália, a fonte original aparece (o primeiro-ministro), a OpenAI foi ouvida, mas as datas não batem entre as fontes (18 de junho ou 18 de julho), então esse ponto precisa de cuidado.",
    codigo: "",
    fontes: ["revisao", "fato", "globe"],
  },
  {
    n: 14,
    parte: "ia",
    pergunta: "Quais medidas de segurança digital poderiam evitar casos como o da Austrália?",
    resposta:
      "Do lado do governo: controle de acesso mais forte nas áreas não públicas do portal, registros (logs) de todos os acessos e monitoramento que dispare alerta quando alguém insiste depois de ser bloqueado, além de corrigir as falhas que o agente encontrou. Do lado da empresa: limitar o que o agente de IA pode acessar durante os testes, acompanhar o que ele faz e comunicar o incidente logo, e não meses depois. E, para os dois, regras claras (regulação) com prazo para avisar incidentes.",
    codigo: "",
    fontes: ["revisao", "globe", "tecnoblog"],
  },
  {
    n: 15,
    parte: "ia",
    pergunta: "Como os recursos de HTML, CSS e JavaScript estudados podem ajudar a criar uma página que ensine o leitor a analisar notícias de forma crítica?",
    resposta:
      "O HTML semântico organiza a notícia em partes (header, section, article, table) e deixa a página acessível. O CSS responsivo faz ela funcionar no celular e usa cores e classes para mostrar certo e errado. O JavaScript deixa o leitor participar: no \"Fato ou Ruído?\" as afirmações ficam num array de objetos, o DOM cria os botões, o evento click confere a resposta e explica o motivo, o checklist calcula a confiança e o formulário valida o parecer. O leitor aprende fazendo, em vez de só ler.",
    codigo: `const AFIRMACOES = [
  { texto: "A invasão foi inaceitável.", resposta: "opiniao" },
];
botao.addEventListener("click", () => conferir(afirmacao, escolha));`,
    fontes: ["revisao", "fato"],
  },
];

const PRATICA = [
  {
    id: "p1",
    pergunta: "Qual seletor pega TODOS os elementos com class=\"ok\"?",
    opcoes: ["$(\"#ok\")", "$(\".ok\")", "$(\"ok\")"],
    certa: 1,
    porque: "O ponto indica classe. # é para id e o nome sozinho seleciona tags <ok>, que não existem.",
  },
  {
    id: "p2",
    pergunta: "Qual método lê o que foi digitado em um <input>?",
    opcoes: [".text()", ".append()", ".val()"],
    certa: 2,
    porque: ".val() trabalha com valores de campos de formulário. .text() é para o texto de elementos comuns.",
  },
  {
    id: "p3",
    pergunta: "Por que o contador da lista é declarado com let?",
    opcoes: ["Porque o valor muda com total++", "Porque let é mais rápido", "Porque const não aceita números"],
    certa: 0,
    porque: "const não pode ser reatribuída; total++ reatribui o valor, então precisa ser let.",
  },
  {
    id: "p4",
    pergunta: "\"O acesso foi inaceitável\" é:",
    opcoes: ["Fato", "Opinião", "Não confirmado"],
    certa: 1,
    porque: "É um julgamento de valor. O que é fato é que Albanese disse isso.",
  },
  {
    id: "p5",
    pergunta: "Qual evento é o mais indicado hoje para detectar a tecla Enter?",
    opcoes: ["keypress", "keydown", "click"],
    certa: 1,
    porque: "A MDN marca keypress como obsoleto e recomenda keydown.",
  },
  {
    id: "p6",
    pergunta: "\"Havia atividade não autorizada desde março\" (organização sem nome) é:",
    opcoes: ["Fato", "Opinião", "Não confirmado"],
    certa: 2,
    porque: "É uma alegação sem provas apresentadas e sem confirmação das autoridades.",
  },
];

function referenciasOrdenadas() {
  return Object.values(FONTES).slice().sort((a, b) => {
    const autorA = a.abnt.split(".")[0];
    const autorB = b.abnt.split(".")[0];
    return autorA === autorB ? a.cit.localeCompare(b.cit) : autorA.localeCompare(autorB, "pt-BR");
  });
}
