// Função para calcular o valor total da aposta e gerar as apostas
function calcularValor() {
    const quantidadeJogos = parseInt(document.getElementById("quantidadeJogos").value);
    const quantidadeNumeros = parseInt(document.getElementById("quantidadeNumeros").value);

    // Tabela de preços para cada quantidade de números (Lotofácil)
    const tabelaPrecos = {
        15: 3.00,
        16: 48.00,
        17: 408.00,
        18: 2448.00,
        19: 11628.00,
        20: 46512.00
    };

    // Calcula o valor total
    const valorAposta = tabelaPrecos[quantidadeNumeros];
    const valorTotal = valorAposta * quantidadeJogos;

    // Exibe o valor total
    document.getElementById("valorTotal").innerText = `Valor total: R$ ${valorTotal.toFixed(2)}`;

    // Gerar as apostas com base nos últimos jogos
    const resultados = window.resultados;
    const sugestoes = gerarSugestoes(resultados, quantidadeJogos, quantidadeNumeros);
    mostrarSugestoes(sugestoes);

    // Exibir a tabela de frequências
    exibirTabelaFrequencias(resultados);
}

// Função para ler e processar o CSV
function processarCSV(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        window.resultados = parseCSV(csvData); // Salva os resultados para uso posterior
    };
    reader.readAsText(file);
}

// Função para analisar o conteúdo do CSV e retornar os números jogados
function parseCSV(csvData) {
    const linhas = csvData.split('\n');
    const resultados = [];
    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (linha) {
            const numeros = linha.split(';').map(num => parseInt(num.trim(), 10));
            resultados.push(numeros);
        }
    }
    return resultados;
}

// Função para gerar sugestões baseadas nos últimos resultados
function gerarSugestoes(resultados, quantidadeJogos, quantidadeNumeros) {
    // Analisando a frequência dos números nos últimos jogos
    const frequencia = contarFrequencia(resultados);

    // Ordenar os números pela sua frequência de aparecimento
    const numerosFrequentes = Object.keys(frequencia)
        .sort((a, b) => frequencia[b] - frequencia[a])
        .slice(0, 25); // Pegando até 25 números mais frequentes, conforme a Lotofácil

    const apostas = [];

    // Gerar o primeiro jogo com os números mais frequentes
    const primeiroJogo = numerosFrequentes.slice(0, quantidadeNumeros);
    apostas.push(primeiroJogo);

    // Gerar os outros jogos como variações dos números mais frequentes
    while (apostas.length < quantidadeJogos) {
        // Gerar uma variação do primeiro jogo
        const novaAposta = gerarJogoUnico(numerosFrequentes, quantidadeNumeros);
        if (!apostas.some(existing => arraysIguais(existing, novaAposta))) {
            apostas.push(novaAposta);
        }
    }

    return apostas;
}

// Função para verificar se dois arrays são iguais
function arraysIguais(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
}

// Função para contar a frequência dos números
function contarFrequencia(resultados) {
    const frequencia = {};
    resultados.forEach(jogo => {
        jogo.forEach(num => {
            frequencia[num] = (frequencia[num] || 0) + 1;
        });
    });
    return frequencia;
}

// Função para gerar um jogo único, garantindo que os números sejam distintos
function gerarJogoUnico(numerosFrequentes, quantidadeNumeros) {
    const aposta = new Set(); // Usando Set para garantir que os números não se repitam
    while (aposta.size < quantidadeNumeros) {
        // Selecionando números aleatórios a partir da lista de números mais frequentes
        const numeroAleatorio = numerosFrequentes[Math.floor(Math.random() * numerosFrequentes.length)];
        aposta.add(parseInt(numeroAleatorio)); // O Set já evita números duplicados
    }

    // Converte o Set para array e ordena os números
    return Array.from(aposta).sort((a, b) => a - b);
}

// Função para exibir a tabela de frequências
function exibirTabelaFrequencias(resultados) {
    const frequencias = contarFrequencia(resultados);

    // Ordena os números pela sua frequência, da maior para a menor
    const numerosOrdenados = Object.keys(frequencias)
        .sort((a, b) => frequencias[b] - frequencias[a]);

    // Acessa a tabela de frequências
    const tabela = document.getElementById("tabelaFrequencias");
    tabela.innerHTML = ''; // Limpa a tabela existente

    // Cria o cabeçalho da tabela
    const header = tabela.createTHead();
    const row = header.insertRow();
    row.insertCell().textContent = 'Número';
    row.insertCell().textContent = 'Frequência';

    // Cria o corpo da tabela
    const body = tabela.createTBody();
    numerosOrdenados.forEach(num => {
        const row = body.insertRow();
        row.insertCell().textContent = num;
        row.insertCell().textContent = frequencias[num];
    });
}

// Função para exibir as sugestões
function mostrarSugestoes(sugestoes) {
    const sugestoesDiv = document.getElementById("sugestoes");
    sugestoesDiv.innerHTML = '';

    // Exibindo as apostas geradas
    sugestoes.forEach((aposta, index) => {
        const apostaText = `Jogo ${index + 1}: ${aposta.join(', ')}`;
        const p = document.createElement('p');
        p.textContent = apostaText;
        sugestoesDiv.appendChild(p);
    });
}

// Adicionar evento para o arquivo CSV
document.getElementById("csvFile").addEventListener("change", function(event) {
    processarCSV(event.target.files[0]);
});
