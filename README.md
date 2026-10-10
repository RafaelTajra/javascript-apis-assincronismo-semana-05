# Objetos, Dados e Assincronismo - Semana 05

Projeto desenvolvido como entregável da Semana 05 da disciplina de Desenvolvimento Web.

## Objetivo

O objetivo deste projeto é praticar conceitos de JavaScript relacionados a:

- objetos;
- arrays;
- manipulação e validação de dados;
- Promises;
- `async/await`;
- Fetch API;
- consumo de APIs;
- manipulação dinâmica do DOM;
- tratamento de erros;
- estados de interface.

## Tecnologias utilizadas

- HTML5
- JavaScript ES6+
- Fetch API
- ViaCEP
- PokéAPI

## Estrutura do projeto

```text
javascript-apis-assincronismo-semana-05/
│
├── index.html
├── app.js
└── README.md
```

## Parte 1 - Manipulação de dados

Foi criado um array de objetos chamado `pedidos`.

Cada pedido possui informações como:

- cliente;
- valor;
- status.

Os pedidos são validados para garantir que o cliente não esteja vazio e que o valor seja um número maior que zero.

Depois disso, são selecionados apenas os pedidos com status `pago`.

O método `reduce()` é utilizado para calcular o total faturado.

Também são gerados textos no formato:

```text
Bia — R$ 120.00
```

utilizando o método `toFixed(2)`.

## Parte 2 - Buscador de CEP

O Buscador de CEP utiliza a API pública ViaCEP.

O usuário informa um CEP e o JavaScript:

1. remove espaços utilizando `trim()`;
2. limpa caracteres utilizando expressão regular;
3. verifica se existem exatamente 8 dígitos;
4. faz a requisição para a API;
5. converte a resposta JSON para um objeto JavaScript;
6. exibe as informações na tela.

A API utilizada é:

```text
https://viacep.com.br/ws/{cep}/json/
```

São exibidos:

- Rua;
- Bairro;
- Cidade;
- UF.

## Estados da interface

O projeto trata quatro estados principais.

### Carregando

Enquanto a requisição está sendo executada, aparece:

```text
Buscando...
```

O botão também permanece desabilitado.

### Erro

Erros HTTP ou falhas de rede são tratados utilizando `try/catch` e verificação de:

```javascript
response.ok
```

### Vazio ou não encontrado

Quando o ViaCEP retorna:

```javascript
erro: true
```

a interface mostra:

```text
CEP não encontrado
```

### Sucesso

Quando a busca funciona, os dados anteriores são removidos utilizando:

```javascript
replaceChildren()
```

Os novos elementos são criados com:

```javascript
createElement()
```

e os valores são inseridos com:

```javascript
textContent
```

Essa abordagem evita utilizar `innerHTML` com dados vindos de APIs externas.

## Histórico de CEP

As pesquisas bem-sucedidas são armazenadas em um array de objetos.

Cada pesquisa registra:

- CEP;
- cidade;
- UF.

Depois, o histórico é exibido dinamicamente na página.

## Parte 3 - Mini Pokédex

A Mini Pokédex utiliza a PokéAPI.

A API utilizada é:

```text
https://pokeapi.co/api/v2/pokemon/{nome}
```

O usuário pode pesquisar um Pokémon pelo nome.

O valor digitado é:

- tratado com `trim()`;
- convertido para minúsculas com `toLowerCase()`.

Quando encontrado, são exibidos:

- nome;
- imagem;
- tipos.

A imagem utiliza:

```javascript
sprites.front_default
```

Os tipos são obtidos através do array:

```javascript
pokemon.types
```

## Tratamento do erro 404

O `fetch()` não rejeita automaticamente uma Promise quando ocorre um erro HTTP.

Por isso, o projeto verifica explicitamente o status da resposta.

Quando a PokéAPI retorna status:

```text
404
```

é exibido:

```text
Pokémon não encontrado
```

## Async/Await

As requisições HTTP foram implementadas utilizando funções assíncronas:

```javascript
async function
```

e:

```javascript
await
```

Isso permite escrever o fluxo assíncrono de maneira mais legível.

## Promise.all

### Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?

Quando vários `await` são utilizados de forma sequencial, cada operação espera a anterior terminar antes de começar.

Exemplo:

```javascript
const resposta1 = await fetch(url1);
const resposta2 = await fetch(url2);
const resposta3 = await fetch(url3);
```

Nesse caso, a segunda requisição só começa depois que a primeira termina, e a terceira só começa depois da segunda.

Com `Promise.all`, as operações podem ser iniciadas praticamente ao mesmo tempo:

```javascript
const respostas = await Promise.all([
    fetch(url1),
    fetch(url2),
    fetch(url3)
]);
```

Assim, as requisições são executadas em paralelo e o programa espera todas terminarem juntas.

Por esse motivo, `Promise.all` pode reduzir o tempo total de espera quando as operações são independentes entre si, aproveitando melhor o tempo de rede.

## Event Loop

O JavaScript possui um modelo de execução baseado no Event Loop.

De forma simplificada, a ordem é:

1. código síncrono;
2. microtarefas, como Promises e continuação de `await`;
3. tarefas, como eventos e `setTimeout`.

Esse comportamento permite que operações assíncronas sejam executadas sem bloquear a interface da aplicação.

## Segurança

Dados recebidos das APIs não são inseridos utilizando `innerHTML`.

São utilizados:

```javascript
createElement()
```

e:

```javascript
textContent
```

Essa prática ajuda a reduzir riscos relacionados a ataques de XSS.

## Como executar

1. Clone ou baixe o repositório.
2. Abra a pasta no Visual Studio Code.
3. Abra `index.html` utilizando o navegador ou Live Server.
4. Pressione `F12`.
5. Abra a aba Console.
6. Teste o Buscador de CEP e a Mini Pokédex.

É necessário estar conectado à internet para que as APIs funcionem.

## Autor

Rafael Tajra
