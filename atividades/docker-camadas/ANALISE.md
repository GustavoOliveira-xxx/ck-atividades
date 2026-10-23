# Análise do material e do repositório

Análise em 23/10/2026. Repositório de entrega: `GustavoOliveira-xxx/ck-atividades`, consultado pelo conector GitHub na base `52fd573d9e90fe88fb822c3372b748eaedafa604` da main. O site `ck-group` foi analisado como referência na base `3fdae7c3341e013ed628782b7ffdf16db084b094`; as alterações desta atividade pertencem ao ck-atividades.

## Inventário integral do ZIP

Foram extraídos os 11 arquivos do ZIP fornecido. Foram lidos os textos do briefing, prompt, instruções, Aula 22 e dos cinco PDFs (73 páginas ao todo). A transcrição TXT do manual foi conferida como versão alternativa; o PDF é a referência. Também foram inspecionados a logo original, o esquema embutido na Aula 22 e o exemplo de margens do manual.

| Arquivo | Conteúdo e aplicação |
| --- | --- |
| PROMPT.md | Identificação, prazo, critérios, preferências de PDF/HTML/site e texto-base da Aula 20. Contém divergências com outros anexos. |
| LEIA-ME.txt | Orientações de uso do pacote e referência ao manual CPS. |
| briefing.json | Atividade, quatro prints, quatro questões, dupla, turma do perfil, data e preferências; preserva um snapshot de outra disciplina. |
| PTD do 1º bimestre, 2 páginas | Nuvem, IaaS/PaaS/SaaS, terminal, virtualização, containers, imagens e início de Dockerfile. |
| PTD do 2º bimestre, 2 páginas | Dockerfile, camadas, instruções, redes, integração, persistência e serviço web. |
| materiais/03-Aula 22.docx | Fonte operacional principal: sequência v1/v2, imagem versus container, quatro prints com legendas e quatro respostas. O esquema resume FROM, COPY e versões. |
| PTD do 3º bimestre, 2 páginas | Execução, permissões, imagens, registros, camadas (21/09 a 04/10) e execução de instruções (05/10 a 09/10). |
| PTD do 4º bimestre, 2 páginas | Redes, bridges, interfaces, portas, integração, IPTables e banco de dados. Na etapa de 12/10 a 25/10 há retomada de conteúdos e redes. Não transforma todos esses temas em requisitos da Aula 22. |
| normas/06-manualCPS.pdf, 65 páginas | Manual de TCC de 2015: monografia, protótipo/manual, maquete/memorial, artigo, projeto de pesquisa e relatório técnico; formatação, figuras, citações e referências. |
| normas/07-manualCPS-texto-completo.txt | Transcrição alternativa das 65 páginas; não é um enunciado adicional. |
| identidade/08-logo-CK.webp | Logo original CK com preto, roxo e amarelo; referência de identidade, sem requisitos operacionais adicionais. |

O relatório curto segue a prioridade explícita da Aula 22. Para a apresentação, aplicam-se A4, Arial 12, margens superior/esquerda de 3 cm e inferior/direita de 2 cm, títulos e fontes das figuras. O manual de TCC não cria, por si só, obrigação de transformar esta atividade curta em monografia com capa, sumário, resumo em inglês e dezenas de páginas. As seções 2.1.3, 2.1.13 e 2.6 orientam formato, figuras e conteúdo técnico.

## Divergências resolvidas ou a conferir

- **Repositório:** a atividade é entregue no ck-atividades, conforme o briefing e a confirmação do aluno. O ck-group é referência do projeto CK, não o destino dos commits desta entrega.
- **Disciplina:** PROMPT.md e o snapshot usam Interfaces Web II; o campo atual subject e os anexos tratam de Computação em Nuvem. O relatório usa Computação em Nuvem para Web, sujeito à conferência do aluno no ambiente escolar.
- **Docente/turma:** briefing cita Clayton e 2°C; PTDs de 1º/2º bimestres citam Felipe Garcia Fogal e 2A, e os de 3º/4º citam Stephany Martins Conceicao e 2A. O relatório mantém os nomes da dupla e 2°C do perfil; professor fica pendente de confirmação.
- **Calendário:** data da atividade 11/10/2026, entrega 23/10/2026 no briefing. O tema também aparece no fim do 3º bimestre; prevalece o exercício fornecido, sem inferir mudança de prazo.
- **Aula 20 x Aula 22:** o texto-base usa site-aula1/site-turma; a atividade atual exige site-aula2, projeto:v1/projeto:v2 e web-v1/web-v2. O roteiro usa os nomes da Aula 22.
- **Formato:** Aula 22 pede relatório curto; briefing seleciona PDF, HTML e SITE e descreve interatividade. O HTML de apoio reúne formulário, tabela de evidências, edição no DOM e layout responsivo; gera uma versão para impressão. Não há exigência expressa na Aula 22 de hospedagem, Docker Hub, vídeo ou efeitos 3D.
- **Texto jornalístico:** o texto-base contém uma reportagem sobre IA e um portal de saúde. Não participa de nenhuma questão da Aula 22; não foi utilizado como fato verificado nem incluído nas respostas.
- **Envio:** plataforma, horário limite, nome obrigatório do arquivo e envio por aluno/por dupla não estão definidos nos anexos. O aluno deve conferir essas informações no canal da escola.

## Repositório CK consultado como referência

A árvore completa da base possui **45 arquivos: 8 de código (3 HTML, 3 CSS e 2 JavaScript) e 37 imagens PNG/WebP**. Há a página institucional na raiz, a apresentação final em `apresentacao/` e a prévia em `apresentacao-projeto/`. Não há package.json, backend, banco de dados, Dockerfile, Compose, README ou workflow versionado na base examinada.

Foram obtidos os oito arquivos de código pelo conector e inventariados os 37 recursos binários. A inspeção estática das referências `src`, `href` e `srcset` dos três HTML não encontrou caminhos locais ausentes nem IDs duplicados. Os dois arquivos JavaScript passaram pela verificação de sintaxe. Isso não certifica todas as interações do site nem a disponibilidade de serviços externos.

O site contém navegação, efeitos visuais progressivos, preferências de movimento reduzido e calculadoras em JavaScript. Apresentações compartilham CSS/JS. Google Fonts, links para FinCK/DynamiCK e o documento no SharePoint são externos; seus serviços e conteúdos não estão incluídos na imagem Nginx nem foram auditados. Não é necessário copiá-los para concluir o exercício.

## Repositório de entrega

O ck-atividades mantém cada trabalho em uma subpasta de `atividades/` e carrega o catálogo por `atividades.js`. O material foi adaptado para `atividades/docker-camadas/` e registrado no acervo com status `andamento`, que a interface mostra como “Em andamento”. Os oito registros anteriores foram preservados. A atividade `analise-critica-ia` já existente tem outro escopo e permanece intacta. Não foi copiado para a raiz o Dockerfile específico da estrutura do ck-group.

## Preparação

- Dockerfile mínimo no laboratório `atividades/docker-camadas/site-aula2`, com contexto limitado pelo .dockerignore local.
- Laboratório separado com Dockerfile mínimo FROM/COPY e arquivos v1/v2. Nenhum volume foi configurado, preservando o experimento de imutabilidade.
- Roteiro com comandos individuais, checkpoints de captura, legendas, quatro respostas, diagnóstico de erros e instruções de envio.
- Relatório HTML local para editar identificação/respostas, incorporar os prints verdadeiros, salvar cópia preenchida e imprimir em PDF.
- .gitignore para evitar incluir evidências/relatórios preenchidos no repositório por acidente.

Não foram executados comandos Docker, builds, containers ou testes HTTP com Nginx. Não foram produzidos prints do terminal do aluno. O relatório só poderá ser finalizado depois da execução pessoal e da revisão. Os campos de resultado permanecem identificados como pendentes; as legendas são sugestões a confirmar.

## Verificações do material preparado

A sintaxe JavaScript do relatório foi validada. Em navegador automatizado, foram conferidos: inserção de quatro imagens de teste claramente identificadas, bloqueio da impressão enquanto faltam dados/revisão, geração do HTML com imagens incorporadas, reabertura desse conteúdo, remoção de imagem com reinício da revisão, ausência de erros JavaScript e adaptação a tela de 390 px. A impressão de teste produziu três páginas e foi inspecionada visualmente. As imagens de teste não integram os entregáveis e não são evidências de Docker.

Limitação observada: o navegador automatizado cancelou a gravação pelo mecanismo de download. Foi possível validar o conteúdo exato gerado pelo botão, salvá-lo pelo teste e reabri-lo com texto/imagens preservados; a gravação pelo navegador do aluno precisa ser conferida. O roteiro orienta a preservar os PNGs e salvar o PDF antes de fechar a página se o download do HTML falhar.
