# Painel do Esporte + Gráfico de Gols (Chart.js)

Atividade **Nova Funcionalidade com IA**, Interface Web II, ETEC Taboão da Serra
Professor: Clayton de Almeida Souza
Dupla (2°C): **Gustavo Oliveira dos Santos** e **Paulo Henrique de Lima Silva**

Projeto escolhido: **Painel do Esporte**
Trilha: **3. Biblioteca extra**, gráfico de gols por jogador que se atualiza sozinho (Chart.js 4.5.1)

## Como executar

1. Descompacte o ZIP (não abra os arquivos de dentro do .zip).
2. Abra a pasta `PainelEsporte_NovaFunc` no VS Code.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
4. A página abre em `http://127.0.0.1:5500/` e já carrega o `jogadores.json` e o gráfico.
5. Aperte **F12** e abra a aba **Console** para conferir que não há erro vermelho.

> Abrindo com duplo clique (`file://`) a tabela e o gráfico ficam vazios, porque o navegador bloqueia o AJAX. A página mostra "Falha ao carregar o JSON. Use o Live Server.".

## O que a funcionalidade nova faz

- Mostra um gráfico de barras com os gols de cada jogador, logo abaixo da tabela.
- O gráfico se atualiza sozinho ao: carregar JSON ou XML, adicionar, remover, buscar, filtrar por posição e ordenar.
- Barras em amarelo = jogadores com média de gols ≥ 0,5 (mesma regra do destaque da tabela).
- Botão **Ver média por jogo** alterna o gráfico entre total de gols e média.
- Acompanha o tema claro/escuro (cookie do projeto original).
- Se o Chart.js não carregar, aparece um aviso na tela e a tabela continua funcionando.

## Arquivos

| Arquivo | O que mudou |
|---|---|
| `index.html` | Script do Chart.js (CDN com versão fixa + plano B local), seção `.grafico` com `#graficoGols`, `#btnMetrica`, `#tituloGrafico`, `#graficoAviso`; créditos no rodapé |
| `style.css` | Bloco "NOVA FUNCIONALIDADE: GRÁFICO DE GOLS" |
| `script.js` | BLOCO 7 (novo) e linhas marcadas com `[NOVO]` nos blocos 1, 2 e 3 |
| `chart.umd.min.js` | Cópia local do Chart.js 4.5.1 (licença MIT), usada sem internet |
| `jogadores.json`, `jogadores.xml`, `jquery-3.7.1.min.js` | Originais, sem alteração |

## Publicar no GitHub (opcional)

```bash
git init
git add .
git commit -m "Painel do Esporte: gráfico de gols com Chart.js"
git branch -M main
git remote add origin https://github.com/GustavoOliveira-xxx/ck-atividades.git
git push -u origin main
```

Troque o endereço do repositório se o nome for outro.

## Créditos

- Projeto base: Prof. Clayton de Almeida Souza (dados fictícios).
- Nova funcionalidade: Gustavo Oliveira dos Santos e Paulo Henrique de Lima Silva, com auxílio de IA (Claude, Anthropic), documentado no Word de evidências.
- Chart.js: https://www.chartjs.org (licença MIT). jQuery: https://jquery.com (licença MIT).
