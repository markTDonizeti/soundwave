/**
 * App.jsx
 *
 * Componente raiz. Monta o layout de 3 camadas:
 *  1. Topo: Sidebar + MainContent (flex row, scroll independente)
 *  2. Rodapé: Player fixo
 *
 * O <PlayerProvider> envolve tudo para que o estado do player
 * seja acessível por qualquer componente da árvore.
 */

import { useState } from "react";
import { PlayerProvider } from "./context/PlayerContext";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Player from "./components/Player";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <PlayerProvider>
      <div className="h-screen w-full flex flex-col bg-black p-2 gap-2 overflow-hidden font-sans">

        {/* Área principal: sidebar + conteúdo */}
        <div className="flex flex-1 gap-2 overflow-hidden min-h-0">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <MainContent />
        </div>

        {/* Player fixo no rodapé */}
        <div className="rounded-xl overflow-hidden flex-shrink-0">
          <Player />
        </div>

      </div>
    </PlayerProvider>
  );
}
