/* ============================================================================
   CK ELEIÇÕES 2026 — PARTE 1 · A BASE DE DADOS EM XML
   ----------------------------------------------------------------------------
   Este arquivo guarda a variável `xmlTexto`, exatamente como no código-base do
   professor (linha 10 do script.js original). A diferença é o conteúdo: saiu o
   catálogo de piadas, entrou o mapa eleitoral de São Paulo.

   O XML tem dois blocos dentro de <eleicoes_sp>:

     <cargos>      → os 5 cargos em disputa, cada um com os atributos
                     titulo="..." e poder="..." e uma <descricao> interna.
                     É a estrutura pedida no Passo 1.1 da atividade.

     <candidatos>  → os candidatos apresentados no projeto, com nome, partido,
                     número, foto, biografia e três propostas cada.

   Nada aqui vem de servidor: é texto puro, dentro de uma template string, que
   o DOMParser transforma em um documento navegável (js/xml.js).

   ⚠ AVISO ACADÊMICO
   As propostas são RESUMOS EDITORIAIS escritos pelo grupo para fins didáticos,
   a partir da trajetória pública de cada candidato. Não são transcrição de
   programa de governo registrado. A fonte oficial é o portal DivulgaCandContas
   do TSE (divulgacandcontas.tse.jus.br). O campo <numero> traz o número do
   partido — que é o número de urna nas disputas majoritárias (Presidente e
   Governador); nas disputas proporcionais o número individual é definido no
   registro da candidatura.
   ========================================================================== */

const xmlTexto = `<?xml version="1.0" encoding="UTF-8"?>
<eleicoes_sp ano="2026" uf="SP" atualizado="2026-09-02">

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
      <propostas>
        <proposta eixo="Social">Ampliação dos programas de transferência de renda e de segurança alimentar, com foco na redução da pobreza extrema.</proposta>
        <proposta eixo="Economia">Retomada do investimento público em infraestrutura e habitação como motor de geração de emprego formal.</proposta>
        <proposta eixo="Educação">Expansão da rede federal de ensino técnico e superior e continuidade das políticas de acesso à universidade.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Presidente" partido="PL" numero="22" foto="flavio-bolsonaro">
      <nome>Flávio Bolsonaro</nome>
      <partido sigla="PL">Partido Liberal</partido>
      <perfil>Senador pelo Rio de Janeiro, com atuação parlamentar concentrada em segurança pública e pautas conservadoras.</perfil>
      <propostas>
        <proposta eixo="Segurança">Endurecimento da legislação penal e ampliação do apoio federal às forças de segurança dos estados.</proposta>
        <proposta eixo="Economia">Redução da carga tributária sobre empresas e simplificação de exigências regulatórias para pequenos negócios.</proposta>
        <proposta eixo="Estado">Diminuição do tamanho da máquina pública federal e revisão de gastos obrigatórios da União.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Presidente" partido="PSD" numero="55" foto="ronaldo-caiado">
      <nome>Ronaldo Caiado</nome>
      <partido sigla="PSD">Partido Social Democrático</partido>
      <perfil>Médico e governador de Goiás, com trajetória ligada ao setor agropecuário e à administração estadual.</perfil>
      <propostas>
        <proposta eixo="Segurança">Integração nacional das polícias e uso intensivo de tecnologia e inteligência no combate ao crime organizado.</proposta>
        <proposta eixo="Saúde">Reorganização da atenção primária e ampliação de mutirões de cirurgias eletivas em parceria com os estados.</proposta>
        <proposta eixo="Agronegócio">Ampliação do crédito rural e da infraestrutura logística voltada ao escoamento da produção.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== GOVERNADOR ===================== -->
    <candidato cargo="Governador" partido="Republicanos" numero="10" foto="tarcisio-de-freitas">
      <nome>Tarcísio de Freitas</nome>
      <partido sigla="Republicanos">Republicanos</partido>
      <perfil>Engenheiro militar e ex-ministro da Infraestrutura, governador de São Paulo com agenda centrada em obras e concessões.</perfil>
      <propostas>
        <proposta eixo="Mobilidade">Continuidade do programa de concessões de linhas de metrô, trens metropolitanos e rodovias estaduais.</proposta>
        <proposta eixo="Segurança">Expansão do uso de câmeras corporais, videomonitoramento e integração de dados entre as polícias paulistas.</proposta>
        <proposta eixo="Educação">Ampliação das escolas técnicas estaduais e das parcerias com o setor produtivo para empregabilidade jovem.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Governador" partido="PT" numero="13" foto="fernando-haddad">
      <nome>Fernando Haddad</nome>
      <partido sigla="PT">Partido dos Trabalhadores</partido>
      <perfil>Professor universitário, ex-ministro da Educação, ex-prefeito de São Paulo e ex-ministro da Fazenda.</perfil>
      <propostas>
        <proposta eixo="Educação">Recomposição do investimento estadual em educação básica e ampliação do ensino em tempo integral na rede pública.</proposta>
        <proposta eixo="Saúde">Fortalecimento dos hospitais estaduais e redução das filas de exames e cirurgias eletivas.</proposta>
        <proposta eixo="Mobilidade">Prioridade ao transporte público de operação estatal e revisão do modelo de concessões em curso.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Governador" partido="PSTU" numero="16" foto="vera-lucia">
      <nome>Vera Lúcia</nome>
      <partido sigla="PSTU">Partido Socialista dos Trabalhadores Unificado</partido>
      <perfil>Operária e dirigente sindical, candidata histórica do PSTU com atuação em pautas trabalhistas e antirracistas.</perfil>
      <propostas>
        <proposta eixo="Trabalho">Redução da jornada de trabalho sem redução de salário e combate à precarização por aplicativos.</proposta>
        <proposta eixo="Serviços públicos">Reestatização de serviços concedidos e ampliação de concursos públicos na saúde e na educação.</proposta>
        <proposta eixo="Moradia">Programa estadual de habitação popular com uso de imóveis ociosos nos centros urbanos.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== SENADOR ===================== -->
    <candidato cargo="Senador" partido="PP" numero="11" foto="guilherme-derrite">
      <nome>Guilherme Derrite</nome>
      <partido sigla="PP">Progressistas</partido>
      <perfil>Policial militar de carreira e deputado federal, foi secretário da Segurança Pública de São Paulo.</perfil>
      <propostas>
        <proposta eixo="Segurança">Agravamento das penas para crimes cometidos por facções e organizações criminosas.</proposta>
        <proposta eixo="Legislação">Revisão da legislação sobre excludente de ilicitude na atuação policial.</proposta>
        <proposta eixo="Fronteiras">Reforço do controle de fronteiras e do combate ao tráfico interestadual de armas e drogas.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Senador" partido="Rede" numero="18" foto="marina-silva">
      <nome>Marina Silva</nome>
      <partido sigla="Rede">Rede Sustentabilidade</partido>
      <perfil>Ambientalista nascida no Acre, ex-senadora e ministra do Meio Ambiente em diferentes governos.</perfil>
      <propostas>
        <proposta eixo="Meio ambiente">Marco legal de combate ao desmatamento e metas verificáveis de redução de emissões.</proposta>
        <proposta eixo="Clima">Política nacional de adaptação climática para cidades, com foco em enchentes e ondas de calor.</proposta>
        <proposta eixo="Economia verde">Incentivo à bioeconomia e ao financiamento de cadeias produtivas sustentáveis.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Senador" partido="PSB" numero="40" foto="simone-tebet">
      <nome>Simone Tebet</nome>
      <partido sigla="PSB">Partido Socialista Brasileiro</partido>
      <perfil>Advogada e ex-senadora por Mato Grosso do Sul, foi ministra do Planejamento e Orçamento.</perfil>
      <propostas>
        <proposta eixo="Orçamento">Responsabilidade fiscal com preservação dos investimentos sociais prioritários.</proposta>
        <proposta eixo="Primeira infância">Ampliação das políticas de creche e de atenção integral à primeira infância.</proposta>
        <proposta eixo="Instituições">Defesa da independência entre os poderes e do fortalecimento dos órgãos de controle.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== DEPUTADO FEDERAL ===================== -->
    <candidato cargo="Deputado Federal" partido="PSOL" numero="50" foto="guilherme-boulos">
      <nome>Guilherme Boulos</nome>
      <partido sigla="PSOL">Partido Socialismo e Liberdade</partido>
      <perfil>Psicólogo e coordenador de movimento de moradia, deputado federal por São Paulo.</perfil>
      <propostas>
        <proposta eixo="Moradia">Ampliação da faixa 1 dos programas habitacionais e uso social de imóveis públicos ociosos.</proposta>
        <proposta eixo="Trabalho">Regulamentação do trabalho por aplicativos com direitos previdenciários garantidos.</proposta>
        <proposta eixo="Tributação">Tributação progressiva sobre altas rendas e grandes fortunas.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Federal" partido="PSB" numero="40" foto="tabata-amaral">
      <nome>Tabata Amaral</nome>
      <partido sigla="PSB">Partido Socialista Brasileiro</partido>
      <perfil>Cientista política e física de formação, deputada federal por São Paulo com atuação centrada em educação.</perfil>
      <propostas>
        <proposta eixo="Educação">Prioridade orçamentária à alfabetização na idade certa e ao ensino médio em tempo integral.</proposta>
        <proposta eixo="Juventude">Programas de permanência escolar e combate à evasão no ensino médio público.</proposta>
        <proposta eixo="Transparência">Ampliação dos mecanismos de fiscalização e rastreabilidade das emendas parlamentares.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Federal" partido="PL" numero="22" foto="nikolas-ferreira">
      <nome>Nikolas Ferreira</nome>
      <partido sigla="PL">Partido Liberal</partido>
      <perfil>Deputado federal por Minas Gerais, com forte atuação digital e pautas conservadoras.</perfil>
      <propostas>
        <proposta eixo="Costumes">Defesa de pautas conservadoras nas áreas de família e educação.</proposta>
        <proposta eixo="Liberdade de expressão">Oposição a projetos de regulação de conteúdo em plataformas digitais.</proposta>
        <proposta eixo="Tributos">Redução da carga tributária sobre o consumo e sobre a renda do trabalhador.</proposta>
      </propostas>
    </candidato>

    <!-- ===================== DEPUTADO ESTADUAL ===================== -->
    <candidato cargo="Deputado Estadual" partido="PSDB" numero="45" foto="bruna-furlan">
      <nome>Bruna Furlan</nome>
      <partido sigla="PSDB">Partido da Social Democracia Brasileira</partido>
      <perfil>Advogada e ex-deputada federal por São Paulo, com base eleitoral em Barueri e região.</perfil>
      <propostas>
        <proposta eixo="Saúde da mulher">Ampliação da rede estadual de atendimento e prevenção ao câncer de mama e de colo de útero.</proposta>
        <proposta eixo="Municípios">Repasse estadual mais previsível para prefeituras da Grande São Paulo.</proposta>
        <proposta eixo="Empreendedorismo">Linhas estaduais de crédito e desburocratização para micro e pequenas empresas.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Estadual" partido="PL" numero="22" foto="major-mecca">
      <nome>Major Mecca</nome>
      <partido sigla="PL">Partido Liberal</partido>
      <perfil>Oficial da Polícia Militar de São Paulo e deputado estadual, com atuação voltada à segurança pública.</perfil>
      <propostas>
        <proposta eixo="Segurança">Reestruturação da carreira e ampliação do efetivo das polícias estaduais paulistas.</proposta>
        <proposta eixo="Equipamento">Investimento em viaturas, coletes e tecnologia embarcada para o policiamento.</proposta>
        <proposta eixo="Prevenção">Programas de policiamento comunitário e projetos sociais em áreas de alta vulnerabilidade.</proposta>
      </propostas>
    </candidato>

    <candidato cargo="Deputado Estadual" partido="PSOL" numero="50" foto="carlos-giannazi">
      <nome>Carlos Giannazi</nome>
      <partido sigla="PSOL">Partido Socialismo e Liberdade</partido>
      <perfil>Professor da rede pública e deputado estadual, com longa atuação na defesa da educação paulista.</perfil>
      <propostas>
        <proposta eixo="Educação">Valorização salarial e concurso público para professores da rede estadual.</proposta>
        <proposta eixo="Escola pública">Oposição à transferência de escolas estaduais para gestão privada ou por organizações sociais.</proposta>
        <proposta eixo="Estudantes">Ampliação do passe livre estudantil e da merenda escolar na rede estadual.</proposta>
      </propostas>
    </candidato>

  </candidatos>
</eleicoes_sp>
`;

/* Mapa que liga cada PODER do cargo à classe CSS do badge institucional.
   É o Passo 1.2 da atividade: em vez de mapear categoria de humor, mapeamos
   o atributo poder="..." para uma cor. Mantivemos o fallback com || para que
   um poder não mapeado nunca quebre a interface. */
const CLASSE_PODER = {
  "Executivo": "badge-executivo",
  "Legislativo": "badge-legislativo",
};

/* Cor de acento por partido — usada nos cards de candidato. */
const COR_PARTIDO = {
  "PT": "#c8102e",
  "PL": "#0b3d91",
  "PSD": "#1b998b",
  "Republicanos": "#0d6efd",
  "PSTU": "#e63946",
  "PP": "#0f5fa6",
  "Rede": "#2fbf71",
  "PSB": "#e4572e",
  "PSOL": "#f2b705",
  "PSDB": "#0072bb",
};

window.CK_XML = { xmlTexto, CLASSE_PODER, COR_PARTIDO };
