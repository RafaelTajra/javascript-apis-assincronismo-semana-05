// ======================================================
// SEMANA 05 - OBJETOS, DADOS E ASSINCRONISMO
// ======================================================



// ======================================================
// PARTE 1 - MANIPULAÇÃO E VALIDAÇÃO DE DADOS
// ======================================================

console.log(
    "===== PARTE 1 - MANIPULAÇÃO DE DADOS ====="
);


// Array de objetos

const pedidos = [

    {
        cliente: "Bia",
        valor: 120,
        status: "pago"
    },

    {
        cliente: "Carlos",
        valor: 80,
        status: "pendente"
    },

    {
        cliente: "Ana",
        valor: 200,
        status: "pago"
    },

    {
        cliente: "",
        valor: 100,
        status: "pago"
    },

    {
        cliente: "Lucas",
        valor: -20,
        status: "pago"
    },

    {
        cliente: "Mariana",
        valor: 50,
        status: "pago"
    }

];



// ------------------------------------------------------
// Validar pedidos
// Cliente não pode estar vazio.
// Valor deve ser número e maior que zero.
// ------------------------------------------------------

const pedidosValidos = pedidos.filter((pedido) => {

    const clienteValido =
        typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "";


    const valorValido =
        typeof pedido.valor === "number" &&
        Number.isFinite(pedido.valor) &&
        pedido.valor > 0;


    return clienteValido && valorValido;

});


console.log(
    "Pedidos válidos:",
    pedidosValidos
);



// ------------------------------------------------------
// Filtrar apenas pedidos pagos
// ------------------------------------------------------

const pedidosPagos = pedidosValidos.filter((pedido) => {

    return pedido.status === "pago";

});


console.log(
    "Pedidos pagos:",
    pedidosPagos
);



// ------------------------------------------------------
// Calcular total faturado com reduce
// ------------------------------------------------------

const totalFaturado = pedidosPagos.reduce(
    (total, pedido) => {

        return total + pedido.valor;

    },
    0
);


console.log(
    `Total faturado: R$ ${totalFaturado.toFixed(2)}`
);



// ------------------------------------------------------
// Gerar textos formatados
// ------------------------------------------------------

const pedidosFormatados = pedidosPagos.map((pedido) => {

    return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;

});


console.log(
    "Pedidos formatados:"
);


pedidosFormatados.forEach((texto) => {

    console.log(texto);

});





// ======================================================
// PARTE 2 - BUSCADOR DE CEP
// ======================================================


// Elementos do DOM

const formCep =
    document.querySelector("#form-cep");


const inputCep =
    document.querySelector("#cep");


const botaoCep =
    document.querySelector("#botao-cep");


const statusCep =
    document.querySelector("#status-cep");


const resultadoCep =
    document.querySelector("#resultado-cep");


const historicoCepElemento =
    document.querySelector("#historico-cep");



// Histórico de pesquisas

const historicoCeps = [];



// ------------------------------------------------------
// Função para criar pares dt/dd
// ------------------------------------------------------

function adicionarCampoCep(titulo, valor) {

    const dt =
        document.createElement("dt");


    const dd =
        document.createElement("dd");


    dt.textContent =
        titulo;


    dd.textContent =
        valor || "Não informado";


    resultadoCep.append(
        dt,
        dd
    );

}



// ------------------------------------------------------
// Renderizar histórico
// ------------------------------------------------------

function renderizarHistoricoCep() {

    historicoCepElemento.replaceChildren();


    historicoCeps.forEach((item) => {

        const li =
            document.createElement("li");


        li.textContent =
            `${item.cep} - ${item.cidade}/${item.uf}`;


        historicoCepElemento.append(li);

    });

}



// ------------------------------------------------------
// Buscar CEP
// ------------------------------------------------------

async function buscarCep(cep) {

    const url =
        `https://viacep.com.br/ws/${cep}/json/`;


    // Timeout de 5 segundos quando suportado.

    const signal =
        typeof AbortSignal !== "undefined" &&
        typeof AbortSignal.timeout === "function"
            ? AbortSignal.timeout(5000)
            : undefined;


    const response = await fetch(
        url,
        {
            signal: signal
        }
    );


    // fetch não gera erro automaticamente
    // para status HTTP como 404 ou 500.

    if (!response.ok) {

        throw new Error(
            `Erro HTTP: ${response.status}`
        );

    }


    const dados =
        await response.json();


    return dados;

}



// ------------------------------------------------------
// Submit do formulário CEP
// ------------------------------------------------------

formCep.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // Limpar espaços.

        const cepDigitado =
            inputCep.value.trim();


        // Limpar caracteres que não sejam números.

        const cepLimpo =
            cepDigitado.replace(/\D/g, "");


        // Limpar resultados antigos.

        resultadoCep.replaceChildren();


        // --------------------------------------------------
        // VALIDAÇÃO
        // --------------------------------------------------

        if (!/^\d{8}$/.test(cepLimpo)) {

            statusCep.textContent =
                "Digite um CEP válido com 8 números.";

            return;

        }



        // --------------------------------------------------
        // ESTADO: CARREGANDO
        // --------------------------------------------------

        statusCep.textContent =
            "Buscando...";


        botaoCep.disabled =
            true;



        try {

            const dados =
                await buscarCep(cepLimpo);



            // --------------------------------------------------
            // ESTADO: VAZIO / NÃO ENCONTRADO
            // --------------------------------------------------

            if (dados.erro) {

                resultadoCep.replaceChildren();


                statusCep.textContent =
                    "CEP não encontrado";


                return;

            }



            // --------------------------------------------------
            // ESTADO: SUCESSO
            // --------------------------------------------------

            resultadoCep.replaceChildren();


            adicionarCampoCep(
                "Rua:",
                dados.logradouro
            );


            adicionarCampoCep(
                "Bairro:",
                dados.bairro
            );


            adicionarCampoCep(
                "Cidade:",
                dados.localidade
            );


            adicionarCampoCep(
                "UF:",
                dados.uf
            );


            // Limpar mensagem de status.

            statusCep.textContent =
                "";



            // --------------------------------------------------
            // BÔNUS - HISTÓRICO
            // --------------------------------------------------

            const pesquisa = {

                cep: cepLimpo,

                cidade:
                    dados.localidade,

                uf:
                    dados.uf

            };


            historicoCeps.push(
                pesquisa
            );


            renderizarHistoricoCep();


        } catch (erro) {

            // --------------------------------------------------
            // ESTADO: ERRO
            // --------------------------------------------------

            console.error(
                erro
            );


            resultadoCep.replaceChildren();


            if (erro.name === "TimeoutError") {

                statusCep.textContent =
                    "A busca demorou demais. Tente novamente.";

            } else {

                statusCep.textContent =
                    "Falha na conexão. Tente novamente.";

            }


        } finally {

            botaoCep.disabled =
                false;

        }

    }
);





// ======================================================
// PARTE 3 - MINI POKÉDEX
// ======================================================


// Elementos DOM

const formPokemon =
    document.querySelector("#form-pokemon");


const inputPokemon =
    document.querySelector("#pokemon");


const botaoPokemon =
    document.querySelector("#botao-pokemon");


const statusPokemon =
    document.querySelector("#status-pokemon");


const resultadoPokemon =
    document.querySelector("#resultado-pokemon");



// ------------------------------------------------------
// Buscar Pokémon
// ------------------------------------------------------

async function buscarPokemon(nome) {

    const url =
        `https://pokeapi.co/api/v2/pokemon/${nome}`;


    const response =
        await fetch(url);



    // 404 significa Pokémon não encontrado.

    if (response.status === 404) {

        return null;

    }



    // Outros erros HTTP.

    if (!response.ok) {

        throw new Error(
            `Erro HTTP: ${response.status}`
        );

    }


    const dados =
        await response.json();


    return dados;

}



// ------------------------------------------------------
// Renderizar Pokémon
// ------------------------------------------------------

function renderizarPokemon(pokemon) {

    // Limpar conteúdo anterior.

    resultadoPokemon.replaceChildren();



    // Nome

    const nome =
        document.createElement("h3");


    nome.textContent =
        pokemon.name;



    // Imagem

    const imagem =
        document.createElement("img");


    imagem.src =
        pokemon.sprites.front_default;


    imagem.alt =
        `Imagem do Pokémon ${pokemon.name}`;



    // Título dos tipos

    const tituloTipos =
        document.createElement("strong");


    tituloTipos.textContent =
        "Tipos:";



    // Lista dos tipos

    const listaTipos =
        document.createElement("ul");


    pokemon.types.forEach((item) => {

        const li =
            document.createElement("li");


        li.textContent =
            item.type.name;


        listaTipos.append(li);

    });



    resultadoPokemon.append(
        nome,
        imagem,
        tituloTipos,
        listaTipos
    );

}



// ------------------------------------------------------
// Submit Pokédex
// ------------------------------------------------------

formPokemon.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();



        // Limpar espaços e converter para minúsculas.

        const nomePokemon =
            inputPokemon.value
                .trim()
                .toLowerCase();



        resultadoPokemon.replaceChildren();



        // --------------------------------------------------
        // VALIDAÇÃO / ESTADO VAZIO
        // --------------------------------------------------

        if (nomePokemon === "") {

            statusPokemon.textContent =
                "Digite o nome de um Pokémon.";

            return;

        }



        // --------------------------------------------------
        // ESTADO: CARREGANDO
        // --------------------------------------------------

        statusPokemon.textContent =
            "Buscando...";


        botaoPokemon.disabled =
            true;



        try {

            const pokemon =
                await buscarPokemon(
                    nomePokemon
                );



            // --------------------------------------------------
            // ESTADO: NÃO ENCONTRADO
            // --------------------------------------------------

            if (pokemon === null) {

                statusPokemon.textContent =
                    "Pokémon não encontrado";


                resultadoPokemon.replaceChildren();


                return;

            }



            // --------------------------------------------------
            // ESTADO: SUCESSO
            // --------------------------------------------------

            renderizarPokemon(
                pokemon
            );


            statusPokemon.textContent =
                "";


        } catch (erro) {

            // --------------------------------------------------
            // ESTADO: ERRO
            // --------------------------------------------------

            console.error(
                erro
            );


            resultadoPokemon.replaceChildren();


            statusPokemon.textContent =
                "Falha na conexão. Tente novamente.";


        } finally {

            botaoPokemon.disabled =
                false;

        }

    }
);
