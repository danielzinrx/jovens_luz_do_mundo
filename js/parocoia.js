// =============================================================
// PÁROCO IA — Assistente Pastoral Digital
// Jovens Luz do Mundo
// Inclua este script no final do <body> de todas as páginas:
// <script src="../js/paroco-ia.js"></script>  (em pages/)
// <script src="js/paroco-ia.js"></script>     (no index.html)
// =============================================================

(function () {

    // ===== PROMPT DE SISTEMA =====
    // Define quem é o Pároco IA, o que pode e não pode fazer
    const SYSTEM_PROMPT = `Você é o "Pároco IA", um assistente pastoral digital do grupo jovem católico "Jovens Luz do Mundo". Seu papel é acolher, orientar e responder dúvidas de fé com carinho, profundidade e fidelidade ao Magistério da Igreja Católica.

IDENTIDADE E TOM:
- Você é um assistente pastoral, NÃO um padre, NÃO um psicólogo e NÃO um médico.
- Fale sempre com acolhimento, calor humano e linguagem acessível para jovens.
- Use expressões católicas naturalmente: "graça de Deus", "paz e bem", "que Deus abençoe".
- Seja gentil, paciente e nunca julgue o jovem.

FONTES PERMITIDAS — responda APENAS com base em:
- Catecismo da Igreja Católica (CIC) — cite o número quando possível (ex: CIC 1422)
- Sagrada Escritura (Bíblia Católica com os 73 livros, incluindo deuterocanônicos)
- Documentos do Magistério: encíclicas, concílios, exortações apostólicas
- Doutrina e Tradição Apostólica da Igreja Católica

HONESTIDADE EPISTÊMICA — REGRA ABSOLUTA:
- Se não tiver certeza de uma informação, diga explicitamente: "Não tenho certeza sobre isso. Te recomendo consultar o Catecismo da Igreja Católica ou conversar com seu pároco."
- NUNCA invente citações, números de cânones ou passagens bíblicas.
- NUNCA afirme algo como doutrina católica se não tiver certeza de que é.

LIMITES PASTORAIS — GATILHOS OBRIGATÓRIOS:
Se o jovem mencionar qualquer um dos temas abaixo, acolha com empatia e IMEDIATAMENTE redirecione para ajuda humana:
- Confissão / absolvição → "Só um padre pode administrar o Sacramento da Reconciliação. Procure seu pároco ou um sacerdote da sua diocese."
- Depressão, ansiedade grave, pensamentos de se machucar → "Isso que você está sentindo é sério e merece atenção. Converse com um adulto de confiança, com seu pároco ou ligue para o CVV: 188."
- Crise espiritual profunda / abandono da fé → acolha, ore junto, sugira encontro com pároco humano.
- Pedidos de aconselhamento matrimonial ou familiar grave → redirecione ao pároco.
- Dúvidas sobre vocação sacerdotal ou religiosa → incentive e redirecione ao pároco ou diretor espiritual.

VOCÊ NÃO PODE:
- Dar absolvição ou simular sacramentos de qualquer forma.
- Substituir o acompanhamento espiritual de um padre real.
- Dar diagnósticos médicos ou psicológicos.
- Aprovar ou reprovar comportamentos fora do que o Magistério trata claramente.
- Discutir política partidária, times de futebol, celebridades ou assuntos mundanos.
- Opinar sobre outras religiões de forma negativa ou comparativa.

FORA DO ESCOPO — resposta educada:
Se o jovem perguntar sobre videogames, músicas, filmes, memes, esportes, piadas ou qualquer assunto não pastoral, responda com gentileza:
"Meu foco aqui é te ajudar a caminhar na fé e tirar dúvidas sobre a vida cristã e a Igreja Católica. Sobre esse assunto, não sou a pessoa certa para conversar — mas se tiver uma dúvida de fé ou quiser rezar juntos, estou aqui! 🙏"

FORMATO DAS RESPOSTAS:
- Respostas curtas a médias (máximo 3-4 parágrafos para perguntas simples).
- Use linguagem acessível, sem excesso de termos técnicos.
- Quando citar o Catecismo, indique o número: (CIC 1234).
- Quando citar a Bíblia, indique o livro e versículo: (Jo 3,16).
- Termine respostas longas com um encorajamento ou oração curta quando apropriado.
- Use emojis com moderação: ✝️ 🙏 🌹 são bem-vindos, mas sem exagero.

EXEMPLOS DE BOA CONDUTA:
- Jovem pergunta "O que é a Eucaristia?" → responda com base no CIC 1322-1419.
- Jovem pergunta "Sinto que Deus não existe mais" → acolha com muito cuidado, não minimize, sugira diálogo com pároco.
- Jovem diz "Me sinto muito triste e sem vontade de nada" → não diagnostique, acolha e sugira CVV 188 e apoio do pároco.
- Jovem pergunta "Qual o melhor jogo de PS5?" → redirecione educadamente.
- Jovem pergunta "A Igreja é contra o aborto?" → responda com o ensinamento do Magistério (CIC 2270-2275) sem militância política.`;

    // ===== ESTILOS =====
    const style = document.createElement('style');
    style.textContent = `
    #paroco-btn {
      position: fixed;
      bottom: 88px;
      right: 18px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1B4F9B, #2E6EC7);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(27,79,155,0.40);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 150;
      transition: all 0.3s ease;
      animation: paroco-pulse 3s ease-in-out infinite;
    }
    #paroco-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(27,79,155,0.55);
    }
    #paroco-btn .paroco-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      background: var(--dourado, #C9A84C);
      border-radius: 50%;
      border: 2px solid #fff;
    }
    @keyframes paroco-pulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(27,79,155,0.40); }
      50%       { box-shadow: 0 4px 28px rgba(27,79,155,0.65); }
    }

    /* ===== JANELA DO CHAT ===== */
    #paroco-chat {
      position: fixed;
      bottom: 88px;
      right: 18px;
      width: calc(100vw - 36px);
      max-width: 420px;
      height: 70vh;
      max-height: 600px;
      background: #F8F6F0;
      border-radius: 20px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.22);
      z-index: 160;
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: paroco-slideup 0.3s ease;
    }
    #paroco-chat.aberto { display: flex; }
    @keyframes paroco-slideup {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Topo do chat */
    .paroco-topo {
      background: linear-gradient(135deg, #0F3070, #1B4F9B);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .paroco-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: rgba(201,168,76,0.20);
      border: 2px solid rgba(201,168,76,0.50);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .paroco-topo-info h4 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 14px; font-weight: 700;
      color: #fff; margin-bottom: 1px;
    }
    .paroco-topo-info p {
      font-size: 11px;
      color: rgba(255,255,255,0.65);
    }
    .paroco-fechar {
      margin-left: auto;
      background: rgba(255,255,255,0.12);
      border: none; border-radius: 8px;
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #fff; font-size: 18px;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .paroco-fechar:hover { background: rgba(255,255,255,0.22); }

    /* Aviso pastoral */
    .paroco-aviso {
      background: rgba(201,168,76,0.12);
      border-bottom: 1px solid rgba(201,168,76,0.25);
      padding: 8px 14px;
      font-size: 11px;
      color: #7A5C00;
      line-height: 1.5;
      flex-shrink: 0;
      text-align: center;
    }

    /* Mensagens */
    .paroco-msgs {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .paroco-msgs::-webkit-scrollbar { width: 4px; }
    .paroco-msgs::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }

    .msg {
      max-width: 85%;
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.6;
      word-wrap: break-word;
    }
    .msg-ia {
      background: #fff;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      color: #2C2820;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .msg-user {
      background: #1B4F9B;
      color: #fff;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }
    .msg-nome {
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 4px;
      opacity: 0.6;
      letter-spacing: 0.04em;
    }

    /* Digitando */
    .msg-digitando {
      display: flex; gap: 4px; align-items: center; padding: 12px 14px;
    }
    .msg-digitando span {
      width: 7px; height: 7px; border-radius: 50%;
      background: #1B4F9B; opacity: 0.5;
      animation: paroco-dot 1.2s ease-in-out infinite;
    }
    .msg-digitando span:nth-child(2) { animation-delay: 0.2s; }
    .msg-digitando span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes paroco-dot {
      0%,80%,100% { transform: scale(0.7); opacity:0.4; }
      40%          { transform: scale(1.1); opacity:1; }
    }

    /* Input */
    .paroco-input-area {
      padding: 10px 12px;
      background: #fff;
      border-top: 1px solid #EAE8E0;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }
    .paroco-input {
      flex: 1;
      border: 1.5px solid #EAE8E0;
      border-radius: 12px;
      padding: 9px 13px;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
      color: #2C2820;
      resize: none;
      outline: none;
      max-height: 100px;
      line-height: 1.5;
      background: #F8F6F0;
      transition: border-color 0.2s;
    }
    .paroco-input:focus { border-color: #1B4F9B; }
    .paroco-input::placeholder { color: #9A9890; }
    .paroco-enviar {
      width: 38px; height: 38px;
      background: #1B4F9B;
      border: none; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    .paroco-enviar:hover { background: #0F3070; }
    .paroco-enviar:disabled { opacity: 0.4; cursor: default; }

    /* Sugestões rápidas */
    .paroco-sugestoes {
      display: flex; gap: 6px; flex-wrap: wrap;
      padding: 0 12px 8px;
      background: #fff;
      flex-shrink: 0;
    }
    .sug-btn {
      background: rgba(27,79,155,0.08);
      color: #1B4F9B;
      border: 1px solid rgba(27,79,155,0.20);
      border-radius: 14px;
      padding: 5px 11px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .sug-btn:hover { background: #1B4F9B; color: #fff; }
  `;
    document.head.appendChild(style);

    // ===== HTML DO COMPONENTE =====
    const wrap = document.createElement('div');
    wrap.innerHTML = `
    <!-- Botão flutuante -->
    <button id="paroco-btn" onclick="parocoToggle()" title="Pároco IA — Assistente Pastoral">
      <div class="paroco-badge"></div>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <!-- Cruz estilizada -->
        <rect x="10.5" y="3" width="3" height="18" rx="1.5" fill="rgba(255,255,255,0.95)"/>
        <rect x="4"    y="9" width="16" height="3"  rx="1.5" fill="rgba(255,255,255,0.95)"/>
      </svg>
    </button>

    <!-- Janela de chat -->
    <div id="paroco-chat">
      <div class="paroco-topo">
        <div class="paroco-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="10.5" y="2" width="3" height="14" rx="1.5" fill="#C9A84C"/>
            <rect x="4" y="8"   width="16" height="3"  rx="1.5" fill="#C9A84C"/>
          </svg>
        </div>
        <div class="paroco-topo-info">
          <h4>Pároco IA</h4>
          <p>Assistente pastoral · Jovens Luz do Mundo</p>
        </div>
        <button class="paroco-fechar" onclick="parocoToggle()">✕</button>
      </div>

      <div class="paroco-aviso">
        ✦ Assistente de fé — não substitui sacramentos nem acompanhamento pastoral humano
      </div>

      <div class="paroco-msgs" id="paroco-msgs"></div>

      <div class="paroco-sugestoes" id="paroco-sugestoes">
        <button class="sug-btn" onclick="parocoSugestao(this)">O que é a Eucaristia?</button>
        <button class="sug-btn" onclick="parocoSugestao(this)">Como me confessar?</button>
        <button class="sug-btn" onclick="parocoSugestao(this)">Por que rezar o terço?</button>
        <button class="sug-btn" onclick="parocoSugestao(this)">Me sinto longe de Deus</button>
      </div>

      <div class="paroco-input-area">
        <textarea
          id="paroco-input"
          class="paroco-input"
          placeholder="Escreva sua dúvida de fé..."
          rows="1"
          onkeydown="parocoKeydown(event)"
          oninput="parocoAutoResize(this)">
        </textarea>
        <button class="paroco-enviar" id="paroco-enviar" onclick="parocoEnviar()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
    document.body.appendChild(wrap);

    // ===== ESTADO =====
    let chatAberto = false;
    let carregando = false;
    let historico = []; // { role: 'user'|'assistant', content: string }
    let primeiraVez = true;

    // ===== FUNÇÕES GLOBAIS =====
    window.parocoToggle = function () {
        chatAberto = !chatAberto;
        const chat = document.getElementById('paroco-chat');
        chat.classList.toggle('aberto', chatAberto);

        if (chatAberto && primeiraVez) {
            primeiraVez = false;
            adicionarMsg('ia', `Paz de Cristo! ✝️\n\nSou o Pároco IA, assistente pastoral do grupo Jovens Luz do Mundo. Estou aqui para ajudar com dúvidas sobre a fé católica, a Bíblia, os sacramentos e a vida cristã.\n\nLembre-se: sou um assistente de fé, não um padre. Para os sacramentos e acompanhamento espiritual profundo, procure sempre seu pároco. 🙏\n\nComo posso te ajudar hoje?`);
        }

        if (chatAberto) {
            setTimeout(() => document.getElementById('paroco-input').focus(), 300);
        }
    };

    window.parocoSugestao = function (btn) {
        const texto = btn.textContent.trim();
        document.getElementById('paroco-sugestoes').style.display = 'none';
        enviarMensagem(texto);
    };

    window.parocoKeydown = function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            parocoEnviar();
        }
    };

    window.parocoAutoResize = function (el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    };

    window.parocoEnviar = function () {
        const input = document.getElementById('paroco-input');
        const texto = input.value.trim();
        if (!texto || carregando) return;
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('paroco-sugestoes').style.display = 'none';
        enviarMensagem(texto);
    };

    // ===== LÓGICA DO CHAT =====
    function adicionarMsg(role, texto) {
        const msgs = document.getElementById('paroco-msgs');
        const div = document.createElement('div');
        div.className = `msg msg-${role === 'ia' ? 'ia' : 'user'}`;

        if (role === 'ia') {
            div.innerHTML = `<div class="msg-nome">PÁROCO IA</div>${formatarTexto(texto)}`;
        } else {
            div.innerHTML = `<div class="msg-nome">VOCÊ</div>${escapeHtml(texto)}`;
        }

        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
        return div;
    }

    function mostrarDigitando() {
        const msgs = document.getElementById('paroco-msgs');
        const div = document.createElement('div');
        div.className = 'msg msg-ia';
        div.id = 'paroco-digitando';
        div.innerHTML = `<div class="msg-nome">PÁROCO IA</div><div class="msg-digitando"><span></span><span></span><span></span></div>`;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function removerDigitando() {
        const el = document.getElementById('paroco-digitando');
        if (el) el.remove();
    }

    function formatarTexto(texto) {
        return texto
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    async function enviarMensagem(texto) {
        if (carregando) return;
        carregando = true;

        adicionarMsg('user', texto);
        historico.push({ role: 'user', content: texto });

        document.getElementById('paroco-enviar').disabled = true;
        mostrarDigitando();

        try {
            const resposta = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1000,
                    system: SYSTEM_PROMPT,
                    messages: historico
                })
            });

            if (!resposta.ok) throw new Error('Erro na API');
            const data = await resposta.json();
            const textoResposta = data.content?.[0]?.text || 'Desculpe, não consegui processar sua pergunta. Tente novamente.';

            removerDigitando();
            adicionarMsg('ia', textoResposta);
            historico.push({ role: 'assistant', content: textoResposta });

            // Limita histórico a 20 mensagens para não explodir o contexto
            if (historico.length > 20) historico = historico.slice(-20);

        } catch (e) {
            removerDigitando();
            adicionarMsg('ia', 'Ops! Tive um problema de conexão. Verifique sua internet e tente novamente. 🙏');
        }

        carregando = false;
        document.getElementById('paroco-enviar').disabled = false;
        document.getElementById('paroco-input').focus();
    }

})();