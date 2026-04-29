# ✝️ Jovens Luz do Mundo

> Aplicação web progressiva (PWA) para grupo jovem católico — espiritualidade, comunidade e fé na palma da mão.

![Versão](https://img.shields.io/badge/versão-1.0.0-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-ativo-success?style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/licença-MIT-green?style=flat-square)

---

## 📖 Sobre o Projeto

O **Jovens Luz do Mundo** é uma aplicação web progressiva desenvolvida para o grupo jovem católico de mesmo nome. O objetivo é reunir em um único lugar todas as ferramentas espirituais e de comunicação que o grupo precisa no dia a dia — desde a Bíblia e o Santo Terço até os avisos da comissão e as intenções de oração compartilhadas.

O projeto nasceu da necessidade real de um grupo jovem de ter um canal próprio, com identidade visual e conteúdo alinhado à fé católica, acessível de qualquer celular sem precisar instalar nada.

---

## ✨ Funcionalidades

### 🙏 Espiritualidade
- **Bíblia Sagrada** — Todos os 73 livros do cânon católico com leitor por capítulo, versículo do dia via API e Lectio Divina com o Evangelho do dia (calendário litúrgico da CNBB)
- **Santo Terço** — Mistérios Gozosos, Luminosos, Dolorosos e Gloriosos com guia passo a passo (modelo Pocket Terço), incluindo Rosário completo com Iniciação à Salve Rainha e Ladainha de Nossa Senhora
- **Orações** — 16 orações católicas com texto completo e história de cada uma, organizadas por categoria (Básicas, Marianas, Anjos, Proteção, Missa)
- **Santos** — Santo do dia via API litúrgica + 12 santos conhecidos com biografia detalhada

### 👥 Comunidade
- **Intenções de Oração** — Formulário com opção anônima, tipo de intenção e urgência. Intenções ficam ativas por 24h e são compartilhadas em tempo real via Firebase para todos os dispositivos
- **Avisos** — Mural de comunicados publicados pela comissão diretamente do painel administrativo
- **Eventos** — Agenda da paróquia com filtros por categoria, destaques e separação entre próximos e anteriores

### 📅 Conteúdo
- **Linha do Tempo da Fé** — História da Igreja Católica em 5 eras históricas com 20 marcos fundamentais, baseada no Catecismo da Igreja Católica (CIC)

### 🔐 Painel Administrativo
- Acesso restrito por e-mail e senha (Firebase Authentication)
- Publicação e exclusão de eventos e avisos sem tocar no código
- Interface dedicada para a comissão do grupo

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 / CSS3 / JavaScript ES6+ | Base da aplicação |
| Firebase Firestore | Banco de dados em tempo real |
| Firebase Authentication | Autenticação do painel admin |
| Claude API (Anthropic) | Pároco IA — assistente pastoral |
| API ABíbliaDigital | Versículo do dia |
| API Liturgia Canção Nova | Evangelho do dia (calendário litúrgico) |
| API Liturgia Diária | Santo do dia |
| Google Fonts (Cinzel + Lato) | Tipografia |

---

## 📁 Estrutura do Projeto

```
jovens-luz-do-mundo/
│
├── index.html              # Tela principal
├── admin.html              # Painel da comissão (acesso restrito)
│
├── pages/
│   ├── biblia.html         # Bíblia Sagrada
│   ├── terco.html          # Santo Terço e Rosário
│   ├── oracoes.html        # Orações católicas
│   ├── santos.html         # Santos e biografia
│   ├── intencoes.html      # Intenções de oração
│   ├── eventos.html        # Agenda de eventos
│   ├── avisos.html         # Avisos da comissão
│   └── historia.html       # Linha do tempo da Igreja
│
├── css/
│   └── style.css           # Estilos globais e design system
│
├── js/
│   ├── app.js              # Lógica principal (data, versículo, santo)
│   ├── firebase.js         # Configuração do Firebase
│   ├── paroco-ia.js        # Componente do Pároco IA
│   └── biblia.json         # Bíblia Ave Maria local (opcional, ver abaixo)
│
└── img/
    └── gemini-svg.svg      # Favicon
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [VS Code](https://code.visualstudio.com/) com a extensão **Live Server** instalada
- Conta no [Firebase](https://firebase.google.com/)
- Git instalado

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/jovens-luz-do-mundo.git
cd jovens-luz-do-mundo
```

### 2. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um projeto e ative o **Firestore Database**
3. Ative o **Firebase Authentication** com provedor E-mail/Senha
4. Registre um app Web e copie as credenciais
5. Substitua as credenciais nos arquivos `index.html`, `admin.html` e em todas as páginas que usam Firebase

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};
```

### 3. Configure as regras do Firestore

No Firebase Console → Firestore → Regras, publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /intencoes/{id} {
      allow read: if true;
      allow write: if true;
    }
    match /eventos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /avisos/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Crie o usuário administrador

No Firebase Console → Authentication → Usuários → Adicionar usuário:
- E-mail e senha que a comissão usará para acessar o `admin.html`

### 5. Bíblia Ave Maria local (opcional)

Para leitura offline da Bíblia na versão Ave Maria:
1. Acesse [github.com/fidalgobr/bibliaAveMariaJSON](https://github.com/fidalgobr/bibliaAveMariaJSON)
2. Baixe o arquivo `bibliaAveMaria.json`
3. Salve como `js/biblia.json`

Sem este arquivo, a leitura usa automaticamente a API ABíbliaDigital (requer internet).

### 6. Abra o projeto

No VS Code, clique com botão direito no `index.html` → **Open with Live Server**

---

## 🎨 Identidade Visual

O design segue a identidade do grupo **Jovens Luz do Mundo**:

| Cor | Hex | Uso |
|---|---|---|
| Azul Royal | `#1B4F9B` | Cor principal, cabeçalhos, botões |
| Rosa Coral | `#E8617A` | Destaques, intenções, urgente |
| Dourado | `#C9A84C` | Acentos, logo, separadores |
| Branco Gelo | `#F8F6F0` | Fundo principal |

**Tipografia:**
- **Cinzel** — títulos e elementos de destaque (Google Fonts)
- **Lato** — texto corrido e interface

---

## 📱 PWA — Instalar como App

O projeto pode ser instalado como aplicativo no celular sem precisar da App Store ou Play Store:

**Android (Chrome):**
1. Abra o site no Chrome
2. Toque no menu (⋮) → "Adicionar à tela inicial"

**iPhone (Safari):**
1. Abra o site no Safari
2. Toque em Compartilhar → "Adicionar à Tela de Início"

---

## 🗺️ Roadmap

### v1.0.0 — Lançamento ✅
- [x] Bíblia com leitor e Lectio Divina
- [x] Santo Terço completo com Rosário
- [x] Orações católicas com histórico
- [x] Santos com biografia
- [x] Intenções de oração em tempo real (Firebase)
- [x] Eventos e avisos com painel admin
- [x] Linha do tempo da Igreja (CIC)
- [x] Design responsivo e identidade visual do grupo

### v1.1.0 — Planejado 🔜
- [ ] Notificações push (Web Push / OneSignal)
- [ ] Modo offline completo (Service Worker / PWA)
- [ ] Contador de "Rezei" nas intenções por usuário no Firebase
- [ ] Compartilhamento de versículos e orações

### v2.0.0 — Futuro 🔭
- [ ] Sistema de login para jovens (perfis)
- [ ] Galeria de fotos dos encontros
- [ ] Transmissão ao vivo de missas e encontros
- [ ] App nativo (React Native)
- [ ] Inserção de um ParocoIA

---

## 🤝 Contribuindo

Este projeto foi desenvolvido para o grupo jovem **Jovens Luz do Mundo**. Sugestões e melhorias são bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## 👨‍💻 Desenvolvedor

Desenvolvido com fé e dedicação para o grupo **Jovens Luz do Mundo** por Daniel Santos.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-danielssantosrx-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/danielssantosrx)
[![GitHub](https://img.shields.io/badge/GitHub-danielzinrx-black?style=flat-square&logo=github)](https://github.com/danielzinrx)

---

<div align="center">
  <sub>Feito com ✝️ e ☕ · <em>"Eu sou a luz do mundo. Quem me segue não andará nas trevas." — João 8,12</em></sub>
</div>
