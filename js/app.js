// ===== JOVENS LUZ DO MUNDO =====
// app.js — Lógica principal

// --- Data de hoje ---
const diasSemana = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function atualizarData() {
  const hoje = new Date();
  const diaSemana = diasSemana[hoje.getDay()];
  const dia = hoje.getDate();
  const mes = meses[hoje.getMonth()];
  const ano = hoje.getFullYear();
  const el = document.getElementById('data-hoje');
  if (el) el.textContent = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

atualizarData();

// ===== VERSÍCULO DO DIA - PÁGINA INICIAL =====
async function carregarVersiculoHome() {
    // Busca os elementos HTML onde o texto vai aparecer
    const textoEl = document.querySelector('.versiculo-texto');
    const refEl = document.querySelector('.versiculo-ref');

    // Se não estiver na página inicial, a função para aqui e não dá erro
    if (!textoEl || !refEl) return;

    try {
        // Tenta buscar o versículo aleatório na API
        const r = await fetch('https://www.abibliadigital.com.br/api/verses/nvi/random');
        if (!r.ok) throw new Error('Falha na API');
        
        const d = await r.json();
        
        // Insere o texto e a referência na tela
        textoEl.innerHTML = `"${d.text}"`;
        refEl.innerHTML = `${d.book.name} ${d.chapter},${d.number}`;
        
    } catch (erro) {
        console.warn("Usando versículo de fallback:", erro);
        
        // Plano B: Se o usuário estiver sem internet ou a API falhar
        const fallback = [
            { t: 'Tudo posso naquele que me fortalece.', r: 'Filipenses 4,13' },
            { t: 'O Senhor é meu pastor e nada me faltará.', r: 'Salmo 23,1' },
            { t: 'Eu sou a luz do mundo. Quem me segue não andará nas trevas, mas terá a luz da vida.', r: 'João 8,12' },
            { t: 'Buscai primeiro o Reino de Deus e a sua justiça, e todas essas coisas vos serão acrescentadas.', r: 'Mateus 6,33' }
        ];
        
        // Pega um versículo diferente baseado no dia do ano
        const data = new Date();
        const diaDoAno = Math.floor((data - new Date(data.getFullYear(), 0, 0)) / 86400000);
        const v = fallback[diaDoAno % fallback.length];

        textoEl.innerHTML = `"${v.t}"`;
        refEl.innerHTML = v.r;
    }
}

// Inicia a função assim que a página carrega
carregarVersiculoHome();

// ===== SANTO DO DIA - 100% AUTOMÁTICO =====
async function carregarSantoDoDia() {
    const nomeEl = document.getElementById('santo-nome');
    const descEl = document.getElementById('santo-desc');
    const dataEl = document.getElementById('santo-data-txt');

    if (!nomeEl || !descEl || !dataEl) return;

    const hoje = new Date();
    const mesesExtenso = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const dataFormatada = `${hoje.getDate()} de ${mesesExtenso[hoje.getMonth()]}`;

    try {
        // Usamos uma ferramenta (AllOrigins) para pular o bloqueio do navegador 
        // e conseguir ler o HTML do site da Canção Nova de forma oculta
        const urlAlvo = 'https://santo.cancaonova.com/';
        const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(urlAlvo)}`);
        
        if (!r.ok) throw new Error("Erro na conexão");
        const dados = await r.json();
        
        // Transformamos o texto gigante que voltou em um documento legível para o código
        const parser = new DOMParser();
        const doc = parser.parseFromString(dados.contents, "text/html");
        
        // A Canção Nova sempre coloca o nome do santo dentro da tag <h1> com a classe "entry-title"
        const tituloSite = doc.querySelector('h1.entry-title');
        
        if (tituloSite) {
            // O título costuma vir assim: "São Galdino, cardeal caridoso que defendeu a fé"
            const textoCompleto = tituloSite.textContent.trim();
            
            let nomeFinal = textoCompleto;
            let descFinal = "Exemplo de fé, amor e santidade na Igreja";

            // Se o texto tiver uma vírgula, nós cortamos para separar o Nome da Descrição
            if (textoCompleto.includes(',')) {
                const partes = textoCompleto.split(/,(.+)/); // Corta na primeira vírgula exata
                nomeFinal = partes[0].trim();
                descFinal = partes[1].trim();
            } else if (textoCompleto.includes(' - ')) { // Ou tenta cortar pelo traço
                const partes = textoCompleto.split(/ - (.+)/);
                nomeFinal = partes[0].trim();
                descFinal = partes[1].trim();
            }

            // Capitaliza a primeira letra da descrição por estética
            descFinal = descFinal.charAt(0).toUpperCase() + descFinal.slice(1);

            // Joga os dados fresquinhos na tela!
            nomeEl.textContent = nomeFinal;
            descEl.textContent = descFinal;
            dataEl.textContent = `${dataFormatada} · Toque para saber mais`;
            
            return; // Tudo certo, o código para aqui!
        }
    } catch (erro) {
        console.warn("A busca automática falhou ou usuário está sem internet. Usando genérico.");
    }

    // Se tudo der errado (site cair ou sem internet), ele mostra um card elegante
    nomeEl.textContent = "Santo do Dia";
    descEl.textContent = "Conheça os santos e intercessores da nossa Igreja";
    dataEl.textContent = `${dataFormatada} · Toque para saber mais`;
}

// Inicia a função do Santo
carregarSantoDoDia();

