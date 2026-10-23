# Aula 22 — o que você precisa fazer

**Prazo informado no briefing: 23/10/2026.** O horário e o canal de envio não constam no ZIP. Confira a atividade no ambiente da escola. Este roteiro prepara a entrega; não comprova execução.

Dupla: **Gustavo Oliveira dos Santos e Paulo Henrique de Lima Silva**. Equipe: Conscious Knowledge. Turma informada no perfil: **2°C**, Informática para Internet, ETEC Taboão da Serra.

## 1. Confira os dados e salve os arquivos no computador

O enunciado da Aula 22 trata de **Computação em Nuvem para Web**. O `PROMPT.md` usa “Interfaces Web II” e Clayton de Almeida Souza; os PTDs usam “Computação em Nuvem para Web I”, turma 2A e outros docentes. Confira a disciplina/professor na atividade da escola antes de entregar. O relatório deixa o professor para preencher e usa a turma do perfil, 2°C.

Baixe a branch `codex/atividade-docker-camadas-2026-10-23` pelo GitHub: selecione a branch, **Code → Download ZIP**, e extraia no computador. Guarde a pasta `atividades/docker-camadas` inteira. Abra `relatorio.html` com dois cliques no navegador; ela funciona localmente e não executa Docker.

Este material está no repositório `GustavoOliveira-xxx/ck-atividades`, na pasta `atividades/docker-camadas`. Você não precisa mesclar a PR para fazer o laboratório.

## 2. Abra o laboratório

Abra o [Ubuntu Playground do Killercoda](https://killercoda.com/playgrounds/scenario/ubuntu) e inicie sua sessão. Se houver pedido de login, faça-o pessoalmente. **Todos os comandos abaixo são para o terminal Linux dentro dessa página. Não execute Docker no PowerShell do seu computador.**

Digite uma linha por vez e aguarde o resultado. Não copie o prefixo `$` ou `root@...`. Não continue depois de um erro sem entender o motivo. No laboratório:

```bash
docker --version
git clone --depth 1 --branch codex/atividade-docker-camadas-2026-10-23 https://github.com/GustavoOliveira-xxx/ck-atividades.git ck-atividades-docker
cd ck-atividades-docker/atividades/docker-camadas/site-aula2
pwd
ls -a
cat index.html
cat Dockerfile
```

Use uma sessão nova para evitar nomes/portas antigos. O clone já traz a pasta `site-aula2`. Ela tem seu próprio Dockerfile com exatamente:

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

Se `git` não estiver disponível, ou se for preciso criar tudo manualmente como na aula, use uma sessão nova e execute `mkdir -p site-aula2`, `cd site-aula2`, `nano index.html` e `nano Dockerfile`, um comando por vez. Copie o conteúdo dos arquivos fornecidos; em `index.html`, use inicialmente `versoes/index-v1.html`. No Nano: Ctrl+O, Enter, Ctrl+X. No Mac, use Control, não Command. Para a versão 2, repita o Nano com o arquivo `versoes/index-v2.html` como referência. Não é preciso instalar Docker localmente.

## 3. Construa a versão 1 e faça o print 1

Dentro de `site-aula2`:

```bash
docker build -t projeto:v1 .
docker images
docker history projeto:v1
```

O ponto final do build indica a pasta atual como contexto. Aguarde a construção terminar sem erro.

**PRINT 1 — `01-history-v1.png`:** mostre o comando `docker history projeto:v1` e uma parte legível do histórico, incluindo `COPY` e instruções herdadas da imagem base. Pode haver várias linhas e entradas `<missing>`; isso não é, sozinho, uma falha. Caso precise ler a instrução inteira, consulte também `docker history --no-trunc projeto:v1`. Não é necessário capturar uma tela gigantesca nem inventar IDs, tamanhos ou número de camadas.

Legenda sugerida, a confirmar com seu print: “O comando `docker history projeto:v1` mostra o histórico de criação da imagem, incluindo a instrução COPY e etapas herdadas de nginx:alpine.”

## 4. Inicie a versão 1 e faça o print 2

```bash
docker run -d --name web-v1 -p 8080:80 projeto:v1
docker ps
curl http://localhost:8080
```

**PRINT 2 — `02-curl-v1.png`:** mostre o comando `curl`, o HTML com `<h1>Versão 1</h1>` e o nome da equipe. O terminal mostra o código HTML; isso é o esperado.

Legenda sugerida: “O comando curl consulta o servidor na porta 8080; a resposta com Versão 1 identifica o conteúdo servido pelo container web-v1, criado a partir de projeto:v1.”

Se o `curl` for muito rápido e a conexão ainda não estiver pronta, aguarde alguns segundos e execute-o novamente. Se persistir, consulte `docker ps -a` e `docker logs web-v1`.

## 5. Altere o arquivo e observe que o container continua na versão 1

```bash
nano index.html
```

Troque `<h1>Versão 1</h1>` por `<h1>Versão 2 - página atualizada</h1>` e adicione antes de `</body>`:

```html
<p>Turma: 2°C - Informática para Internet</p>
```

Salve: Ctrl+O, Enter, Ctrl+X. O arquivo `versoes/index-v2.html` já contém o resultado preparado para conferência. Alternativa ao Nano, no clone fornecido: `cp versoes/index-v2.html index.html` faz a mesma substituição.

```bash
cat index.html
curl http://localhost:8080
```

O arquivo deve conter a versão 2, mas o `curl` ainda deve mostrar a versão 1. **Observe isso pessoalmente.** Se desejar, salve `extra-arquivo-v2-container-v1.png` com as duas saídas; é evidência adicional, não um dos quatro prints obrigatórios.

Nesta atividade não usamos volume/bind mount. A instrução COPY copiou o arquivo durante o build anterior; editar a pasta do laboratório não altera essa cópia.

## 6. Construa a versão 2 e faça o print 3

```bash
docker build -t projeto:v2 .
docker images
docker history projeto:v2
```

**PRINT 3 — `03-images-v1-v2.png`:** fotografe a saída de `docker images` com as duas linhas do repositório `projeto`, tags `v1` e `v2`, legíveis. Compare os históricos e localize COPY. O build de v2 não substitui o container já em execução.

Legenda sugerida: “O comando docker images lista projeto com as tags v1 e v2, mostrando que as imagens das duas versões coexistem depois da nova construção.”

## 7. Substitua o container e faça o print 4

```bash
docker stop web-v1
docker rm web-v1
docker run -d --name web-v2 -p 8080:80 projeto:v2
curl http://localhost:8080
```

**PRINT 4 — `04-curl-v2.png`:** mostre, se couber, a criação de `web-v2` e o `curl` com “Versão 2 - página atualizada”, equipe e turma.

Legenda sugerida: “Após a substituição por web-v2, o comando curl retorna a página atualizada e a turma; o novo container utiliza projeto:v2.”

Parar o container libera a porta que ele ocupava; removê-lo elimina o container parado. Esses comandos não apagam a imagem v1. Para encerrar a comparação:

```bash
docker ps
docker images
```

Confira `web-v2` em execução e ambas as tags disponíveis. Um print extra dessa comparação é opcional.

## 8. Salve as evidências e complete o relatório

1. No Windows, use Win+Shift+S e salve cada captura como PNG na pasta de evidências do seu computador. No Mac, use Shift+Command+4. Capture o comando e a saída real, com fonte legível. Evite incluir abas pessoais, senhas e identificadores desnecessários.
2. Abra a cópia local de `relatorio.html`. Clique nos textos sublinhados para corrigir identificação, professor, legendas e respostas. Informe a data real da execução; não confunda com o prazo.
3. Insira as quatro imagens nos campos numerados. As imagens ficam somente na página aberta; não há envio automático nem salvamento automático.
4. Leia as quatro respostas e adapte a redação ao que compreendeu. Confirme que cada legenda corresponde ao resultado real. Se a saída não coincidiu, resolva o erro ou descreva a divergência; não apresente uma expectativa como resultado.
5. Clique em **Baixar relatório HTML** para guardar uma cópia com imagens e textos incorporados. Reabra o HTML baixado para verificar que ficou completo. Guarde também os PNGs originais. Se o navegador cancelar o download, mantenha a página aberta até salvar o PDF no próximo passo e preserve os prints separadamente; não conte com salvamento automático. O relatório preenchido pode conter dados acadêmicos: não é necessário adicioná-lo ao repositório público.
6. Marque a confirmação de revisão e clique em **Imprimir ou salvar PDF**. Escolha “Salvar como PDF”, papel A4, escala 100%, sem cabeçalhos/rodapés automáticos do navegador. Confira a prévia e a legibilidade dos quatro prints antes de salvar. Se um print ficar pequeno, recapture só a parte necessária com fonte maior.
7. Nome sugerido (não imposto no enunciado): `Relatorio_Docker_Gustavo_Paulo_2C.pdf`. Abra o PDF salvo e confira os nomes, turma, quatro prints, quatro legendas e quatro respostas. O PDF modelo sem prints não está pronto para entregar.
8. Envie o PDF na atividade indicada pelo professor. O ZIP não informa plataforma, horário limite nem regra de envio individual/por dupla: confira na escola. Guarde o comprovante de envio.

O enunciado pede relatório curto, não apenas prints. O briefing seleciona PDF e HTML/SITE; o relatório HTML permite preparar o PDF e manter uma versão web local. Hospedar um site, fazer merge da PR, publicar imagem no Docker Hub, gravar vídeo e criar banco de dados não aparecem como exigências na Aula 22. Só envie código/HTML/link adicional se o campo da atividade ou o professor pedir.

## 9. Respostas de apoio para compreender e revisar

**1. Por que o container antigo não mudou ao editar index.html?** Porque o COPY colocou uma cópia do arquivo na imagem durante o build. O container web-v1 usa essa imagem, e não a pasta local como volume. A edição só entra na nova imagem depois de outro build; é necessário criar um novo container com ela para servir a atualização.

**2. Qual a função de docker history?** Mostrar o histórico de criação de uma imagem, com instruções, datas e tamanhos associados às entradas. Ele ajuda a localizar COPY e etapas herdadas da imagem base. Não mostra os logs de execução do servidor nem um mapa exato de cada arquivo/camada física.

**3. Por que parar o antigo antes de usar a mesma porta 8080?** Porque web-v1 já ocupa a publicação TCP da porta 8080 do ambiente para a porta 80 do container. Outro container não pode publicar a mesma combinação de endereço/porta/protocolo simultaneamente. O stop libera essa publicação; o rm remove o container parado. Os dois containers poderiam coexistir com portas do ambiente diferentes.

**4. Diferença entre construir imagem e executar container?** Construir com docker build processa o Dockerfile e gera a imagem com os arquivos. Executar com docker run cria e inicia um container a partir dela. Uma imagem pode originar vários containers. Construir v2 não muda v1 nem troca o container antigo automaticamente; parar/remover um container também não apaga sua imagem.

| Ação | Imagem | Container já existente |
| --- | --- | --- |
| Editar index.html | A imagem construída permanece igual | web-v1 continua com v1 |
| Construir projeto:v2 | Uma imagem atualizada recebe a tag v2 | web-v1 continua com v1 |
| Criar web-v2 com projeto:v2 | A imagem não muda por essa execução | O novo web-v2 usa v2 |

Tags são rótulos que podem ser apontados para outra imagem em builds futuros; a imutabilidade se refere ao conteúdo das imagens/camadas já construídas. Não reconstrua `projeto:v1` depois de editar para v2 se quiser preservar a comparação do exercício.

## Se algo der errado

- **Docker não responde:** confira `docker --version` e peça ajuda/inicie um laboratório funcional. O comando de versão confirma o cliente, não a disponibilidade do serviço. Não instale nem rode Docker no computador por causa deste roteiro.
- **Dockerfile não encontrado ou falha no COPY:** use `pwd`, `ls -a`, `cat Dockerfile` e `cat index.html`; a pasta correta termina em `atividades/docker-camadas/site-aula2`. Mantenha o ponto no build.
- **Porta já alocada:** execute `docker ps` e identifique quem usa 8080. Pare só o container que você criou; não remova containers de colegas. Em dúvida, inicie uma sessão nova.
- **Nome web-v1 ou web-v2 já existe:** use `docker ps -a`. Se for uma tentativa sua sem evidências necessárias, pare e remova somente esse container, depois repita o run. Não use remoção em massa nem `docker system prune`.
- **Página padrão do Nginx:** confira o caminho `/usr/share/nginx/html/index.html`, o arquivo local e a pasta do build; reconstrua a versão correta e recrie o container correspondente.
- **Versão errada após build:** build não recria containers. Confira a coluna IMAGE em `docker ps`, o HTML local e o nome/tag usados no run.
- **Sessão expirou:** reabra o laboratório e refaça as etapas; o clone e seus arquivos locais permitem reconstruí-las. Salve os quatro prints durante a execução.

## Fontes técnicas consultadas

- Material fornecido: `materiais/03-Aula 22.docx`, “Camadas e execução de instruções”; `briefing.json`; `PROMPT.md`.
- [Dockerfile e COPY](https://docs.docker.com/reference/dockerfile/).
- [Histórico de imagem](https://docs.docker.com/reference/cli/docker/image/history/).
- [Camadas de imagem](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/).
- [Construção e tags](https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/).
- [Publicação de portas](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

Consulta em 23/10/2026. Veja [ANALISE.md](ANALISE.md) para o inventário do ZIP, divergências e alcance das verificações.
