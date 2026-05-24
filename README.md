# 🎵 SoundWave — Premium Spotify Web Player Clone

![SoundWave Preview](./public/preview.png)

> Um clone premium e responsivo do Spotify Web Player, construído com **React 18**, **Vite** e **Tailwind CSS**. Projeto focado em portfólio com player de áudio 100% funcional, gerenciamento de estado global e UX idêntica ao Spotify.

---

## ✨ Features

| Feature | Detalhe |
|---|---|
| 🎵 **Player de áudio real** | Web Audio API com faixas de domínio público |
| 🔀 **Shuffle (Fisher-Yates)** | Algoritmo de embaralhamento sem repetições consecutivas |
| 🔁 **Repeat** | Três modos: desligado → repetir tudo → repetir uma |
| ⏩ **Skip inteligente** | Prev reseta a faixa se >3s tocados |
| 📊 **Equalizador animado** | Barrinhas CSS puras em sync com o player |
| 🎨 **Gradiente dinâmico** | Header muda de cor conforme o álbum selecionado |
| 💚 **Play flutuante nos cards** | Botão verde aparece no hover, exatamente como no Spotify |
| ❤️ **Curtir músicas** | Estado persistido no contexto global |
| 🔊 **Controle de volume** | Slider com mute toggle |
| 🎯 **Seek por drag** | Barra de progresso clicável e arrastável |

---

## 🛠️ Stack

- **React 18** — Hooks + Context API
- **Vite 5** — Build tool com HMR instantâneo
- **Tailwind CSS 3** — Utilitários para o design dark mode
- **Web Audio API** — Player de áudio nativo (sem bibliotecas)

---

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/soundwave.git
cd soundwave

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse em http://localhost:5173
```

---

## 📁 Estrutura do projeto

```
soundwave/
├── src/
│   ├── context/
│   │   └── PlayerContext.jsx   # Estado global + reducer
│   ├── hooks/
│   │   └── useAudioEngine.js   # Web Audio API isolada
│   ├── components/
│   │   ├── icons/
│   │   │   └── Icons.jsx       # Ícones SVG inline
│   │   ├── EqBars.jsx          # Equalizador animado
│   │   ├── Sidebar.jsx         # Painel lateral
│   │   ├── MainContent.jsx     # Área principal + grid
│   │   └── Player.jsx          # Rodapé do player
│   ├── data/
│   │   └── mockData.js         # Faixas + playlists (mock)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🔌 Integração com Spotify Web API (roadmap)

O código foi estruturado para facilitar a migração:

1. **`mockData.js`** → substituir por `GET /v1/me/playlists` + `GET /v1/albums/{id}/tracks`
2. **`useAudioEngine.js`** → substituir por `SpotifyPlayer.connect()` (Web Playback SDK)
3. **`PlayerContext.jsx`** → a interface pública permanece idêntica — zero refatoração nos componentes

---

## 📄 Licença

MIT — sinta-se livre para usar, modificar e distribuir.

---

<p align="center">
  Feito com ☕ e muito CSS dark mode
</p>
