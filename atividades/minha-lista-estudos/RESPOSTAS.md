# Respostas · Atividade Prática "Minha Lista de Estudos"

**Estudante:** Gustavo Oliveira dos Santos
**Componente:** Interfaces Web II
**Professor:** Clayton de Almeida Souza
**Entrega:** 30/10/2026

---

### 1. Para que serve o seletor `$("#campoAtividade")`?

Ele usa o seletor de **id** do jQuery (o `#` significa id, igual no CSS) para encontrar na página o elemento com `id="campoAtividade"`, que é o campo de texto. Com o campo selecionado, o código lê o que foi digitado com `.val()`, limpa o campo com `.val("")` e devolve o cursor para ele com `.focus()`.

### 2. Qual é a função do evento `.on("click", ...)`?

Ele liga um evento ao botão. É como dizer ao navegador: "quando alguém clicar no `#btnAdicionar`, execute esta função". Sem o `.on()` a função até existe, mas nunca roda. No meu código a função chamada no clique é `adicionarAtividade`.

### 3. Por que usamos `if (atividade === "")`?

É a validação. Antes de criar o item, o código confere se o texto está vazio. Como o `.trim()` tira os espaços do começo e do fim, quem digita só espaços também cai nessa condição. Se estiver vazio, aparece a mensagem de erro e o `return` encerra a função, então nenhum item em branco entra na lista e o contador não sobe à toa. O `===` compara o valor e o tipo.

### 4. Qual é a função de `.append()` neste código?

O `.append()` coloca o novo `<li>`, criado com `$("<li>").text(atividade)`, no final da `<ul id="listaAtividades">`. É a parte que mexe no DOM: a página ganha um elemento novo sem precisar recarregar. Como o texto entra com `.text()`, o que a pessoa digita aparece como texto comum e não vira código HTML.

### 5. O que a variável `total` armazena?

A quantidade de atividades adicionadas desde que a página abriu. Ela começa em 0 (`let total = 0`), soma 1 com `total++` a cada atividade válida e é usada para mostrar "Atividades: X". É `let` porque o valor muda, e fica fora da função para não voltar a zero a cada clique. Como nada é salvo no navegador, ao recarregar a página ela recomeça do 0.

---

## Desafio extra: tecla Enter

No código da aula (Painel de Tarefas) o evento de teclado usado é o `keydown`, conferindo se `evento.key === "Enter"`. Para não duplicar a lógica, coloquei tudo o que acontece ao adicionar dentro da função `adicionarAtividade()`. Assim o clique e o Enter chamam a mesma função:

```js
$("#btnAdicionar").on("click", adicionarAtividade);

$("#campoAtividade").on("keydown", function (evento) {
  if (evento.key === "Enter") {
    adicionarAtividade();
  }
});
```

---

## Roteiro rápido para explicar ao professor

- **Um seletor jQuery:** `$("#mensagem")` pega o parágrafo de id `mensagem` para trocar o texto com `.text()` e a cor com `.attr("class", "erro")` ou `"ok"`.
- **Uma função:** `adicionarAtividade()` junta os cinco passos: captura o texto, valida, cria o `<li>`, atualiza o contador e limpa o campo.
- **Uma condição if:** `if (atividade === "")` impede adicionar item vazio; o `return` faz a função parar ali.
