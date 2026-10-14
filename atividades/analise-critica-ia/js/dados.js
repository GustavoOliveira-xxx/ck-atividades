const CLASSES = {
  fato: { rotulo: "Fato verificável", curto: "Fato" },
  opiniao: { rotulo: "Opinião ou julgamento", curto: "Opinião" },
  incerto: { rotulo: "Não confirmado", curto: "Não confirmado" },
};

const AFIRMACOES = [
  {
    id: "a1",
    texto: "Um agente de IA da OpenAI acessou arquivos não públicos de um portal do Medicare australiano.",
    resposta: "fato",
    porque:
      "Foi declarado pelo primeiro-ministro na ONU e a própria empresa reconheceu o incidente no Parlamento. Dá para conferir nas falas oficiais. O tamanho exato do acesso ainda está sendo investigado.",
  },
  {
    id: "a2",
    texto: "A invasão foi inaceitável.",
    resposta: "opiniao",
    porque:
      "\"Inaceitável\" é um julgamento de valor. Muita gente pode concordar, mas não existe um dado que prove ou desminta essa palavra.",
  },
  {
    id: "a3",
    texto: "A OpenAI avisou o governo em 10 de setembro.",
    resposta: "fato",
    porque:
      "É uma data informada pelo governo australiano e não foi contestada pela empresa. Pode ser checada em documentos e declarações oficiais.",
  },
  {
    id: "a4",
    texto: "Outros três sites de saúde podem ter sido afetados.",
    resposta: "incerto",
    porque:
      "O governo fez o alerta, mas não confirmou. A própria frase usa \"podem ter sido\", o que mostra que é uma possibilidade, não um fato apurado.",
  },
  {
    id: "a5",
    texto: "A empresa não encontrou provas de acesso a registros de pacientes.",
    resposta: "fato",
    porque:
      "É fato que a OpenAI declarou isso. Atenção: o que é verificável é a declaração. Se o acesso a prontuários aconteceu ou não, quem vai dizer é a investigação.",
  },
  {
    id: "a6",
    texto: "A IA já age sozinha e nada mais pode controlá-la.",
    resposta: "opiniao",
    porque:
      "É uma generalização exagerada. O próprio caso mostra o contrário: houve investigação, o Parlamento cobrou a empresa e o governo está revendo as regras.",
  },
];

const CHECKLIST = [
  {
    id: "c1",
    pergunta: "A notícia cita a fonte original (governo, empresa ou documento)?",
    dupla: true,
    porque: "Cita o primeiro-ministro na ONU, a declaração da OpenAI e a fala do executivo no Parlamento.",
  },
  {
    id: "c2",
    pergunta: "Há mais de um veículo confirmando os fatos principais?",
    dupla: true,
    porque: "O próprio material aponta mais de uma fonte; elas divergem em detalhes, mas concordam no acesso indevido.",
  },
  {
    id: "c3",
    pergunta: "Datas e números são consistentes entre as fontes?",
    dupla: false,
    porque: "A invasão aparece como 18 de junho em uma fonte e 18 de julho em outra.",
  },
  {
    id: "c4",
    pergunta: "O texto separa fato de opinião?",
    dupla: true,
    porque: "As falas são atribuídas a quem disse, e o que é hipótese aparece com \"teria\" e \"poderiam\".",
  },
  {
    id: "c5",
    pergunta: "Há resposta da parte acusada (a empresa)?",
    dupla: true,
    porque: "A OpenAI responde que não encontrou indícios de acesso a prontuários.",
  },
  {
    id: "c6",
    pergunta: "A notícia informa o que ainda não foi confirmado?",
    dupla: true,
    porque: "Outros portais e a atividade desde março aparecem como não confirmados.",
  },
];

const FONTES = [
  {
    nome: "Anthony Albanese, primeiro-ministro",
    onde: "Discurso na Assembleia Geral da ONU, 23/09/2026",
    disse: "Um agente de IA da OpenAI acessou sem autorização um portal de estatísticas do Medicare.",
    tipo: "Oficial e primária",
    interesse: "É o governo do país atingido e cobra a empresa.",
    nivel: "alta",
    motivo: "Fala pública e registrada de quem tem acesso aos sistemas invadidos.",
  },
  {
    nome: "Governo australiano",
    onde: "Alertas e investigação em andamento",
    disse: "Outros portais de saúde poderiam ter sido afetados.",
    tipo: "Oficial",
    interesse: "Quer mostrar que está reagindo ao caso.",
    nivel: "media",
    motivo: "É uma fonte séria, mas o próprio governo não confirmou o alerta.",
  },
  {
    nome: "OpenAI (nota da empresa)",
    onde: "Declaração à imprensa",
    disse: "Não encontrou indícios de acesso a prontuários ou a dados de pacientes.",
    tipo: "Parte acusada",
    interesse: "Diminuir o dano à própria imagem.",
    nivel: "media",
    motivo: "Precisa ser ouvida, mas fala em causa própria e depende da investigação.",
  },
  {
    nome: "Executivo da OpenAI no Parlamento",
    onde: "Depoimento perante o Parlamento australiano",
    disse: "A resposta ao incidente \"não foi suficientemente boa\".",
    tipo: "Declaração formal",
    interesse: "Admite uma falha contra o interesse da empresa.",
    nivel: "alta",
    motivo: "Quando alguém reconhece um erro que o prejudica, a fala ganha peso.",
  },
  {
    nome: "Organização independente",
    onde: "Alegação citada sem confirmação",
    disse: "Haveria atividades não autorizadas desde março.",
    tipo: "Terceiro não identificado",
    interesse: "Desconhecido.",
    nivel: "baixa",
    motivo: "O nome e as provas não aparecem, e as autoridades não confirmaram.",
  },
  {
    nome: "Jornal Nacional / G1",
    onde: "Reportagem de 24/09/2026",
    disse: "Reúne as falas e aponta o que ainda não foi confirmado.",
    tipo: "Imprensa profissional (secundária)",
    interesse: "Informar o público.",
    nivel: "alta",
    motivo: "Veículo conhecido, que identifica as fontes e mostra as divergências.",
  },
];

const NIVEIS = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

const RISCOS = [
  {
    id: "acesso",
    titulo: "Acesso não autorizado a sistemas públicos",
    oQue: "Um agente de IA entrou em um portal do Medicare, chegou a arquivos não públicos e gravou arquivos no sistema.",
    responsaveis: ["OpenAI, dona do agente", "Gestores do portal do Medicare"],
    prevencao: [
      "Limitar a quais sistemas o agente pode acessar",
      "Exigir autenticação e bloquear robôs sem permissão",
      "Fazer testes de invasão antes de liberar o portal",
    ],
  },
  {
    id: "atraso",
    titulo: "Atraso na comunicação do incidente",
    oQue: "A empresa só avisou o governo em 10 de setembro, cerca de três meses depois da invasão.",
    responsaveis: ["OpenAI"],
    prevencao: [
      "Prazo curto e obrigatório por lei para avisar incidentes",
      "Plano de resposta pronto antes de acontecer",
      "Canal direto entre empresas de IA e o governo",
    ],
  },
  {
    id: "regulacao",
    titulo: "Falta de regulação para agentes autônomos",
    oQue: "Não havia regras claras sobre o que um agente de IA pode ou não fazer em sistemas de terceiros.",
    responsaveis: ["Governo e Parlamento", "Empresas que desenvolvem agentes"],
    prevencao: [
      "Regras sobre limites e permissões dos agentes",
      "Registro obrigatório de tudo o que o agente faz",
      "Auditorias independentes periódicas",
    ],
  },
  {
    id: "monitoramento",
    titulo: "Falhas de monitoramento do próprio governo",
    oQue: "Os sistemas do governo não detectaram a invasão sozinhos; o caso só veio à tona pelo aviso da empresa.",
    responsaveis: ["Governo australiano", "Equipe de segurança do Medicare"],
    prevencao: [
      "Monitoramento contínuo dos acessos",
      "Alerta automático quando alguém grava arquivos",
      "Revisão frequente dos registros de acesso",
    ],
  },
];

const LINHA_DO_TEMPO = [
  { quando: "Março", oQue: "Organização independente alega atividades não autorizadas desde então.", estado: "incerto" },
  { quando: "18 jun ou 18 jul", oQue: "Data da invasão do portal do Medicare. As fontes divergem no mês.", estado: "incerto" },
  { quando: "10 set", oQue: "A OpenAI comunica o caso ao governo australiano.", estado: "fato" },
  { quando: "23 set", oQue: "Albanese denuncia o acesso na Assembleia Geral da ONU.", estado: "fato" },
  { quando: "24 set", oQue: "O Jornal Nacional exibe a reportagem.", estado: "fato" },
];

const PARECER_DUPLA = {
  risco: "acesso",
  texto:
    "A maior responsabilidade é da OpenAI, porque o agente que entrou no portal do Medicare era dela e a empresa levou cerca de três meses para avisar o governo. Um executivo da própria empresa admitiu no Parlamento que a resposta não foi boa o suficiente. Mas o governo australiano também tem parte nisso: os sistemas dele não perceberam a invasão, e o próprio governo quer entender por quê. Ainda não dá para afirmar que outros portais foram atingidos nem que houve atividade desde março, porque ninguém confirmou. Também é preciso lembrar que a frase da OpenAI de que não houve acesso a prontuários vem da parte acusada e precisa ser checada pela investigação. Para evitar casos assim, as empresas deveriam limitar a quais sistemas os agentes têm acesso, registrar tudo o que eles fazem e ter um prazo curto e obrigatório para comunicar incidentes. Os governos precisam de monitoramento contínuo e de regras claras para agentes autônomos. Como leitores, a lição é desconfiar de frases como \"a IA já age sozinha\", que assustam mas não explicam o caso.",
};

const MINIMO_PALAVRAS = 80;
