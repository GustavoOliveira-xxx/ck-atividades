# Minha Lista de Estudos

Atividade prática de **Interfaces Web II** (2º C · M-Tec Informática para Internet, Etec de Taboão da Serra), feita por **Gustavo Oliveira dos Santos** com orientação do Prof. Clayton de Almeida Souza.

- **Online:** <https://gustavooliveira-xxx.github.io/ck-atividades/atividades/minha-lista-estudos/>
- **Pasta para entrega:** [`MinhaListaEstudos.zip`](MinhaListaEstudos.zip) (a pasta pedida no enunciado, com os três arquivos e a logo)

Uma lista de estudos inspirada no Painel de Tarefas da aula, para praticar seletores jQuery, eventos, variáveis, funções, validação com `if` e criação de elementos no DOM. O visual segue a identidade **Conscious Knowledge** (preto, roxo elétrico e amarelo-dourado).

## Arquivos

```
minha-lista-estudos/
├── index.html      estrutura da página
├── style.css       aparência (tema CK, 3D e responsivo)
├── script.js       lógica com jQuery + efeitos visuais
├── img/
│   └── logo-ck.webp   logo original da Conscious Knowledge
├── RESPOSTAS.md    respostas das 5 perguntas da atividade
├── MinhaListaEstudos.zip   pasta pronta para entregar ao professor
└── README.md
```

## Como executar

1. Baixe o `MinhaListaEstudos.zip` e extraia (ou clone o repositório e entre nesta pasta).
2. Abra o arquivo `index.html` no navegador (dois cliques já funcionam).
   No VS Code também dá para usar a extensão **Live Server**: botão direito no `index.html` → *Open with Live Server*.
3. É preciso estar com **internet**, porque o jQuery é carregado pelo CDN `https://code.jquery.com/jquery-3.7.1.min.js`. Sem conexão, a página mostra um aviso em vez de quebrar em silêncio.

## Como testar (roteiro da atividade)

1. Clique em **Adicionar** com o campo vazio: aparece "Digite uma atividade antes de adicionar." em vermelho.
2. Digite "Estudar JavaScript" e clique em **Adicionar**: a atividade entra na lista.
3. Adicione mais duas atividades (pode usar a tecla **Enter**) e veja o contador subir.
4. Confira que o campo fica limpo depois de cada inclusão.

## O que tem além do pedido

| Item | Onde |
| --- | --- |
| Adicionar com **Enter** (desafio extra), sem duplicar a lógica | `script.js`, função `adicionarAtividade()` + evento `keydown` |
| Campo com `<label>`, mensagem com `aria-live` e campo marcado como inválido no erro | `index.html` e `script.js` |
| Aviso na tela se o jQuery não carregar | início do `script.js` |
| Cubos 3D no fundo, painel que inclina com o mouse, itens que entram girando, faíscas ao adicionar | `style.css` e Parte 2 do `script.js` |
| Respeita "reduzir movimento" do sistema e desenha menos cubos em aparelhos simples | `style.css` (media query) e `script.js` |
| Layout para celular sem rolagem lateral | `style.css`, seção 12 |
| Respostas das perguntas dentro da própria página | seção "Entendendo o código" |

O `script.js` é dividido em duas partes. A **Parte 1** é a lógica pedida pelo professor, com jQuery. A **Parte 2** só cuida dos efeitos visuais e apenas observa a página; se for apagada, a lista continua funcionando igual.

## Checklist de entrega

- [x] `index.html`, `style.css` e `script.js` na mesma pasta
- [x] CSS e JavaScript em arquivos separados
- [x] O botão adiciona uma atividade à lista
- [x] Campo vazio mostra mensagem
- [x] Contador atualizado corretamente
- [x] Consigo explicar um seletor jQuery, uma função e uma condição `if` (ver `RESPOSTAS.md`)

## Créditos

- Código e textos: Gustavo Oliveira dos Santos.
- Logo: Conscious Knowledge (arquivo original fornecido, sem alterações).
- Biblioteca: [jQuery 3.7.1](https://jquery.com/) (licença MIT).
- Fontes: Space Grotesk, Inter e JetBrains Mono, via Google Fonts (licença SIL Open Font).
