// para rodar: node cliente.js

const axios = require("axios");
main();

async function main(){
    const accessToken = await getAccessToken();
    const exs = await getExercicios(accessToken);
    console.log(exs);
    for(slug in exs){
        const ex = exs[slug];
        const entrada = ex.entrada
        const resolucao = await resolvendo(slug, entrada, accessToken);
        await enviarRespostas(slug, accessToken, resolucao);
    }
}

async function getAccessToken(){
    const options = {headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }};

    const response_at = await axios.post("https://tecweb-js.insper-comp.com.br/token", {username:"ilanaf"}, options);
    const accessToken = response_at.data.accessToken;
    // console.log(`access token adquirido: ${accessToken}`);
    return accessToken;
}

async function getExercicios(at){
    const options = {headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': 'Bearer '+at
    }};

    const response_exs = await axios.get("https://tecweb-js.insper-comp.com.br/exercicio", options);
    exs = response_exs.data;
    return exs;
}

async function resolvendo(slug, entrada, at){
    if(slug == 'soma'){
        return entrada.a + entrada.b;
    } else if(slug == 'tamanho-string') {
        return entrada.string.length;
    } else if(slug == 'nome-do-usuario'){
        return entrada.email.split('@')[0];
    } else if(slug == 'jaca-wars'){
        let d = entrada.v**2 * Math.sin(2*entrada.theta*Math.PI/180) / 9.8;
        if(d < 98){
            return -1;
        } else if(d > 102){
            return 1;
        } else {
            return 0;
        }
    } else if(slug == 'ano-bissexto'){
        let year = entrada.ano;
        if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
            return true;
        } else {
            return false;
        }
    } else if(slug == 'volume-da-pizza'){
        let area = Math.PI * entrada.z**2;
        return Math.round(area * entrada.a);
    } else if(slug == 'mru'){
        return entrada.s0 + entrada.v*entrada.t;
    } else if(slug == 'inverte-string'){
        let string_nova = '';
        for(let i = entrada.string.length; i >= 0 ; i--){
            string_nova += entrada.string.charAt(i);
        }
        return string_nova;
    } else if(slug == 'soma-valores'){
        let soma = 0;
        for(const valor of Object.values(entrada.objeto))
            soma += valor;
        return soma;
    } else if(slug == 'n-esimo-primo'){
        const isPrime = (num, primes) => primes.every(prime => prime * prime > num || num % prime);
        const primes = [2];
        for (let num = 3; primes.length < entrada.n; num += 2) {
          if (isPrime(num, primes)) primes.push(num);
        }
        return primes[entrada.n - 1];
    } else if(slug == 'maior-prefixo-comum'){
        let longestPrefix = '';
        for (let i = 0; i < entrada.strings.length; i++) {
          for (let j = i + 1; j < entrada.strings.length; j++) {
            let commonPrefix = '';
            for (let k = 0; k < entrada.strings[i].length && k < entrada.strings[j].length; k++) {
              if (entrada.strings[i][k] === entrada.strings[j][k]) {
                commonPrefix += entrada.strings[i][k];
              } else {
                break;
              }
            }
            if (commonPrefix.length > longestPrefix.length) {
              longestPrefix = commonPrefix;
            }
          }
        }
        return longestPrefix;
    } else if(slug == 'soma-segundo-maior-e-menor-numeros'){
        entrada.numeros.sort((a, b) => a - b);
        return entrada.numeros[1] + entrada.numeros[entrada.numeros.length-2]
    } else if(slug == 'conta-palindromos'){
        return entrada.palavras.filter(str => {
            const textoLimpo = str.replace(/\s/g, '').toLowerCase();
            const reverso = textoLimpo.split('').reverse().join('');
            return textoLimpo === reverso;
          }).length;
    } else if(slug == 'soma-de-strings-de-ints'){
        const numeros = entrada.strings.map(str => parseInt(str, 10) || 0);
        const soma = numeros.reduce((acumulador, valor) => acumulador + valor, 0);
        return soma;
    } else if(slug == 'soma-com-requisicoes'){
        return (await Promise.all(
            entrada.endpoints.map(endpoint => axios.get(endpoint, {
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer `+at
                }
            }))
            )).reduce((sum, response) => sum + response.data, 0);
    } else if(slug == 'caca-ao-tesouro'){
        let url = entrada.inicio;
        while (true) {
            try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer `+at
            }});
            const data = response.data;
            if (typeof data == "number") {
                return data;
            }
            url = data;
            } catch (error) {
            console.error(error);
            }
        }
    }
}

async function enviarRespostas(slug, at, resposta){
    const options = {headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': 'Bearer '+at
    }};
    await axios.post(`https://tecweb-js.insper-comp.com.br/exercicio/${slug.toLowerCase().replace(/ /g, '-')}`, {resposta:resposta}, options);
}