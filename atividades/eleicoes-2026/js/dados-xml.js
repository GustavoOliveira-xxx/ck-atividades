const xmlTexto = `<?xml version="1.0" encoding="UTF-8"?>
<eleicoes_sp ano="2026" uf="SP" atualizado="2026-09-11">
  <cargos>
    <cargo titulo="Presidente" poder="Executivo" ambito="Federal" vagas="1" mandato="4 anos" icone="planalto">
      <descricao>Chefe do poder executivo federal e chefe de Estado. Comanda a administração pública da União, sanciona ou veta leis aprovadas pelo Congresso, edita medidas provisórias e representa o Brasil nas relações internacionais.</descricao>
    </cargo>
    <cargo titulo="Governador" poder="Executivo" ambito="Estadual" vagas="1" mandato="4 anos" icone="bandeirantes">
      <descricao>Chefe do poder executivo estadual. Administra São Paulo, o estado mais populoso do país, respondendo por segurança pública, saúde, educação básica estadual, transporte metropolitano e pela execução do orçamento paulista.</descricao>
    </cargo>
    <cargo titulo="Senador" poder="Legislativo" ambito="Federal" vagas="2" mandato="8 anos" icone="senado">
      <descricao>Representa o estado de São Paulo no Senado Federal. Vota leis complementares, aprova autoridades e ministros de tribunais superiores, julga autoridades em crimes de responsabilidade e revisa a legislação vinda da Câmara.</descricao>
    </cargo>
    <cargo titulo="Deputado Federal" poder="Legislativo" ambito="Federal" vagas="70" mandato="4 anos" icone="camara">
      <descricao>Representa a população paulista na Câmara dos Deputados. Propõe e vota projetos de lei federais, fiscaliza o Executivo, aprova o orçamento da União e participa das comissões temáticas permanentes.</descricao>
    </cargo>
    <cargo titulo="Deputado Estadual" poder="Legislativo" ambito="Estadual" vagas="94" mandato="4 anos" icone="alesp">
      <descricao>Atua na Assembleia Legislativa de São Paulo (ALESP). Elabora leis estaduais, fiscaliza o governo do estado, aprova o orçamento paulista e responde diretamente pelas demandas dos 645 municípios de São Paulo.</descricao>
    </cargo>
  </cargos>

  <candidatos>

    <!-- ===================== PRESIDENTE ===================== -->
    <candidato cargo="Presidente" partido="PT" numero="13" foto="luis-inacio-lula">
      <nome>Luiz Inácio Lula da Silva</nome>
      <partido sigla="PT">Partido dos Trabalhadores</partido>
      <perfil>Ex-metalúrgico e sindicalista, presidente da República em três mandatos. Construiu sua trajetória política a partir do ABC paulista.</perfil>
      <propostas tipo="programa">
        <proposta eixo="Social">Manter e ampliar políticas de redução da pobreza e desigualdade.</proposta>
        <proposta eixo="Serviços públicos">Investir em saúde e educação públicas.</proposta>
        <proposta eixo="Trabalho">Buscar redução da jornada de trabalho para 40 horas semanais e o fim da escala 6x1, sem redução salarial.</proposta>
        <proposta eixo="Infraestrutura">Fortalecer investimentos em infraestrutura e indústria.</proposta>
        <proposta eixo="Energia">Ampliar políticas de transição energética e exploração de recursos estratégicos.</proposta>
        <proposta eixo="Tecnologia">Criar uma plataforma pública nacional de empregabilidade utilizando inteligência artificial.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Presidente" partido="PL" numero="22" foto="flavio-bolsonaro">
      <nome>Flávio Bolsonaro</nome>
      <partido sigla="PL">Partido Liberal</partido>
      <perfil>Senador pelo Rio de Janeiro, com atuação parlamentar concentrada em segurança pública e pautas conservadoras.</perfil>
      <propostas tipo="programa">
        <proposta eixo="Segurança">Endurecer o combate ao crime organizado e aumentar a capacidade do sistema penitenciário.</proposta>
        <proposta eixo="Segurança">Criar cinco novos presídios federais de segurança máxima.</proposta>
        <proposta eixo="Gestão">Criar um Ministério da Segurança Pública para ampliar a coordenação das forças policiais.</proposta>
        <proposta eixo="Estado">Reduzir despesas e ministérios do governo federal.</proposta>
        <proposta eixo="Fiscal">Substituir o atual arcabouço fiscal por um novo teto de gastos.</proposta>
        <proposta eixo="Tributos">Reduzir impostos sobre combustíveis.</proposta>
        <proposta eixo="Trabalho">Propor mudanças na legislação trabalhista permitindo maior flexibilidade na jornada.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Presidente" partido="PSD" numero="55" foto="ronaldo-caiado">
      <nome>Ronaldo Caiado</nome>
      <partido sigla="PSD">Partido Social Democrático</partido>
      <perfil>Médico e governador de Goiás, com trajetória ligada ao setor agropecuário e à administração estadual.</perfil>
      <propostas tipo="programa">
        <proposta eixo="Instituições">Encerrar a possibilidade de reeleição para cargos do Executivo.</proposta>
        <proposta eixo="Fiscal">Promover ajuste fiscal e maior controle das contas públicas.</proposta>
        <proposta eixo="Segurança">Combater o crime organizado e endurecer penas para crimes graves.</proposta>
        <proposta eixo="Social">Manter programas de transferência de renda, com maior controle contra fraudes.</proposta>
        <proposta eixo="Infraestrutura">Investir em infraestrutura e ampliar concessões e parcerias com o setor privado.</proposta>
        <proposta eixo="Energia">Incentivar biocombustíveis e veículos híbridos/flex.</proposta>
        <proposta eixo="Social">Ampliar investimentos em saúde, educação, moradia e inclusão produtiva.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== GOVERNADOR ===================== -->
    <candidato cargo="Governador" partido="Republicanos" numero="10" foto="tarcisio-de-freitas">
      <nome>Tarcísio de Freitas</nome>
      <partido sigla="Republicanos">Republicanos</partido>
      <perfil>Engenheiro militar e ex-ministro da Infraestrutura, governador de São Paulo com agenda centrada em obras e concessões.</perfil>
      <propostas tipo="programa">
        <proposta eixo="Infraestrutura">Continuar investimentos em infraestrutura, rodovias e obras públicas.</proposta>
        <proposta eixo="Concessões">Ampliar concessões e parcerias público-privadas.</proposta>
        <proposta eixo="Segurança">Expandir ações de segurança pública e combate ao crime organizado.</proposta>
        <proposta eixo="Tecnologia">Utilizar tecnologia e integração de dados na segurança.</proposta>
        <proposta eixo="Educação">Ampliar a rede de escolas com modelo cívico-militar/militar.</proposta>
        <proposta eixo="Infraestrutura">Continuar projetos de recuperação e modernização da infraestrutura paulista.</proposta>
        <proposta eixo="Segurança urbana">Desenvolver ações de combate à Cracolândia e políticas de segurança urbana.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Governador" partido="PT" numero="13" foto="fernando-haddad">
      <nome>Fernando Haddad</nome>
      <partido sigla="PT">Partido dos Trabalhadores</partido>
      <perfil>Professor universitário, ex-ministro da Educação, ex-prefeito de São Paulo e ex-ministro da Fazenda.</perfil>
      <propostas tipo="programa">
        <proposta eixo="Segurança">Priorizar segurança pública com foco em prevenção e integração das forças policiais.</proposta>
        <proposta eixo="Segurança">Ampliar câmeras corporais com gravação contínua.</proposta>
        <proposta eixo="Segurança">Criar iniciativas de combate a golpes e recuperação de celulares roubados.</proposta>
        <proposta eixo="Educação">Investir em educação pública e valorização dos profissionais da área.</proposta>
        <proposta eixo="Saúde">Ampliar investimentos em saúde.</proposta>
        <proposta eixo="Concessões">Rever políticas de privatização e concessões consideradas estratégicas.</proposta>
        <proposta eixo="Mobilidade">Buscar redução de custos para a população, incluindo críticas ao modelo de pedágios.</proposta>
        <proposta eixo="Interior">Levar investimentos e desenvolvimento econômico para o interior do estado.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Governador" partido="PSTU" numero="16" foto="vera-lucia">
      <nome>Vera Lúcia</nome>
      <partido sigla="PSTU">Partido Socialista dos Trabalhadores Unificado</partido>
      <perfil>Operária e dirigente sindical, candidata histórica do PSTU com atuação em pautas trabalhistas e antirracistas.</perfil>
      <propostas tipo="programa">
        <proposta eixo="Serviços públicos">Priorizar investimentos públicos em saúde e educação.</proposta>
        <proposta eixo="Servidores">Defender valorização salarial e melhores condições de trabalho para servidores.</proposta>
        <proposta eixo="Social">Ampliar políticas sociais e combate à desigualdade.</proposta>
        <proposta eixo="Estado">Defender serviços públicos sob controle estatal.</proposta>
        <proposta eixo="Moradia">Propor medidas voltadas à moradia popular.</proposta>
        <proposta eixo="Trabalho">Ampliar direitos trabalhistas e políticas de proteção aos trabalhadores.</proposta>
        <proposta eixo="Privatizações">Combater privatizações de serviços públicos.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== SENADOR ===================== -->
    <candidato cargo="Senador" partido="PP" numero="111" foto="guilherme-derrite">
      <nome>Guilherme Derrite</nome>
      <partido sigla="PP">Progressistas</partido>
      <perfil>Policial militar de carreira e deputado federal, foi secretário da Segurança Pública de São Paulo.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Segurança">Fortalecimento da segurança pública.</proposta>
        <proposta eixo="Crime organizado">Combate ao crime organizado.</proposta>
        <proposta eixo="Legislação">Endurecimento das políticas de combate à criminalidade.</proposta>
        <proposta eixo="Forças policiais">Valorização das forças policiais.</proposta>
        <proposta eixo="Integração">Ampliação da integração entre forças de segurança.</proposta>
        <proposta eixo="Estados">Defesa de políticas de segurança alinhadas ao governo estadual de São Paulo.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Senador" partido="REDE" numero="180" foto="marina-silva">
      <nome>Marina Silva</nome>
      <partido sigla="REDE">Rede Sustentabilidade</partido>
      <perfil>Ambientalista nascida no Acre, ex-senadora e ministra do Meio Ambiente em diferentes governos.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Meio ambiente">Proteção ambiental e combate ao desmatamento.</proposta>
        <proposta eixo="Desenvolvimento">Desenvolvimento sustentável.</proposta>
        <proposta eixo="Clima">Transição para uma economia de baixo carbono.</proposta>
        <proposta eixo="Biomas">Preservação da Amazônia e dos biomas brasileiros.</proposta>
        <proposta eixo="Clima">Fortalecimento de políticas climáticas.</proposta>
        <proposta eixo="Economia verde">Desenvolvimento econômico associado à sustentabilidade.</proposta>
        <proposta eixo="Social">Defesa de políticas sociais e de redução das desigualdades.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Senador" partido="PSB" numero="400" foto="simone-tebet">
      <nome>Simone Tebet</nome>
      <partido sigla="PSB">Partido Socialista Brasileiro</partido>
      <perfil>Advogada e ex-senadora por Mato Grosso do Sul, foi ministra do Planejamento e Orçamento.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Mulheres">Combate à violência contra as mulheres.</proposta>
        <proposta eixo="Mulheres">Fortalecimento das políticas de proteção às mulheres.</proposta>
        <proposta eixo="Educação">Defesa da educação e dos serviços públicos.</proposta>
        <proposta eixo="Economia">Desenvolvimento econômico com responsabilidade fiscal.</proposta>
        <proposta eixo="Social">Combate à desigualdade social.</proposta>
        <proposta eixo="Instituições">Fortalecimento das instituições e da democracia.</proposta>
        <proposta eixo="Proteção social">Ampliação das políticas de proteção social.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== DEPUTADO FEDERAL ===================== -->
    <candidato cargo="Deputado Federal" partido="PSOL" numero="5010" foto="guilherme-boulos">
      <nome>Guilherme Boulos</nome>
      <partido sigla="PSOL">Partido Socialismo e Liberdade</partido>
      <perfil>Psicólogo e coordenador de movimento de moradia, deputado federal por São Paulo.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Moradia">Defesa da moradia popular e políticas habitacionais.</proposta>
        <proposta eixo="Social">Combate à desigualdade social.</proposta>
        <proposta eixo="Serviços públicos">Ampliação de investimentos em saúde e educação públicas.</proposta>
        <proposta eixo="Trabalho">Defesa dos direitos dos trabalhadores.</proposta>
        <proposta eixo="Programas sociais">Fortalecimento de programas sociais.</proposta>
        <proposta eixo="Trabalho">Combate à pobreza e à precarização do trabalho.</proposta>
        <proposta eixo="Cidades">Defesa de políticas urbanas voltadas à população de baixa renda.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Federal" partido="PSB" numero="4040" foto="tabata-amaral">
      <nome>Tabata Amaral</nome>
      <partido sigla="PSB">Partido Socialista Brasileiro</partido>
      <perfil>Cientista política e física de formação, deputada federal por São Paulo com atuação centrada em educação.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Educação">Educação pública de qualidade.</proposta>
        <proposta eixo="Juventude">Ampliação de oportunidades educacionais para jovens.</proposta>
        <proposta eixo="Ciência">Investimentos em ciência, tecnologia e inovação.</proposta>
        <proposta eixo="Primeira infância">Políticas de primeira infância.</proposta>
        <proposta eixo="Gestão">Melhoria da gestão pública baseada em evidências.</proposta>
        <proposta eixo="Social">Defesa de políticas sociais e redução das desigualdades.</proposta>
        <proposta eixo="Legislativo">Atuação legislativa em saúde, educação e desenvolvimento social.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Federal" partido="PL" numero="2288" foto="major-mecca">
      <nome>Major Mecca</nome>
      <partido sigla="PL">Partido Liberal</partido>
      <perfil>Oficial da Polícia Militar de São Paulo, com atuação parlamentar voltada à segurança pública.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Segurança">Fortalecimento da segurança pública.</proposta>
        <proposta eixo="Forças policiais">Valorização das forças policiais.</proposta>
        <proposta eixo="Crime organizado">Combate ao crime organizado.</proposta>
        <proposta eixo="Legislação">Defesa de maior rigor contra criminosos.</proposta>
        <proposta eixo="Agentes públicos">Apoio a políticas de segurança para agentes públicos.</proposta>
        <proposta eixo="Costumes">Defesa de pautas conservadoras.</proposta>
        <proposta eixo="Estrutura">Fortalecimento da estrutura das forças de segurança.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== DEPUTADO ESTADUAL ===================== -->
    <candidato cargo="Deputado Estadual" partido="Republicanos" numero="10010" foto="bruna-furlan">
      <nome>Bruna Furlan</nome>
      <partido sigla="Republicanos">Republicanos</partido>
      <perfil>Advogada e ex-deputada federal por São Paulo, com base eleitoral em Barueri e região.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Social">Defesa de políticas sociais.</proposta>
        <proposta eixo="Saúde">Apoio a iniciativas voltadas à saúde.</proposta>
        <proposta eixo="Educação">Defesa de melhorias na educação.</proposta>
        <proposta eixo="Municípios">Fortalecimento de políticas públicas municipais e estaduais.</proposta>
        <proposta eixo="Desenvolvimento">Apoio a projetos de desenvolvimento regional.</proposta>
        <proposta eixo="Municípios">Atuação em pautas relacionadas à população e aos municípios paulistas.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Estadual" partido="PSOL" numero="50789" foto="carlos-giannazi">
      <nome>Carlos Giannazi</nome>
      <partido sigla="PSOL">Partido Socialismo e Liberdade</partido>
      <perfil>Professor da rede pública e deputado estadual, com longa atuação na defesa da educação paulista.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="Educação">Defesa da educação pública.</proposta>
        <proposta eixo="Servidores">Valorização dos professores e servidores públicos.</proposta>
        <proposta eixo="Aposentados">Defesa dos direitos dos aposentados.</proposta>
        <proposta eixo="Servidores">Melhoria das condições de trabalho dos servidores.</proposta>
        <proposta eixo="Servidores">Defesa do pagamento retroativo relacionado aos períodos congelados dos servidores.</proposta>
        <proposta eixo="Servidores">Restabelecimento das faltas abonadas para servidores estaduais.</proposta>
        <proposta eixo="Privatizações">Combate às políticas de privatização de serviços públicos.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Estadual" partido="PSD" numero="55300" foto="caio-aoqui" conferir="pautas">
      <nome>Caio Aoqui</nome>
      <partido sigla="PSD">Partido Social Democrático</partido>
      <perfil>Administrador, candidato a deputado estadual por São Paulo com candidatura deferida.</perfil>
      <propostas tipo="pautas">
        <proposta eixo="A catalogar">Pautas ainda não levantadas pelo grupo. Consulte a candidatura no DivulgaCandContas do TSE antes da apresentação.</proposta>
      </propostas>
    </candidato>

  </candidatos>
</eleicoes_sp>
`;

const CLASSE_PODER = {
  "Executivo": "badge-executivo",
  "Legislativo": "badge-legislativo",
};

const COR_PARTIDO = {
  "PT": "#c8102e",
  "PL": "#0b3d91",
  "PSD": "#1b998b",
  "Republicanos": "#0d6efd",
  "PSTU": "#e63946",
  "PP": "#0f5fa6",
  "REDE": "#2fbf71",
  "PSB": "#e4572e",
  "PSOL": "#f2b705",
};

window.CK_XML = { xmlTexto, CLASSE_PODER, COR_PARTIDO };
