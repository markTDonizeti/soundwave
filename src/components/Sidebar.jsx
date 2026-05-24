/**
 * Sidebar.jsx
 *
 * Painel lateral fixo com:
 *  - Logo + navegação principal (Home, Buscar)
 *  - Seção "Sua Biblioteca" com filtros, playlists e artistas seguidos
 *  - Indicador de músicas curtidas com contagem dinâmica
 */

import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { PLAYLISTS, FOLLOWED_ARTISTS } from "../data/mockData";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusIcon,
  HeartIcon,
} from "./icons/Icons";

// ---------------------------------------------------------------------------
// Sub-componente: item de biblioteca (playlist ou artista)
// ---------------------------------------------------------------------------
function LibraryItem({ cover, title, subtitle, isRound = false }) {
  return (
    <button
      className="
        flex items-center gap-3 w-full px-2 py-2 rounded-md
        text-left transition-colors duration-150
        hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-spotify-green
      "
    >
      {/* Thumbnail */}
      <div
        className={`
          w-11 h-11 flex-shrink-0 flex items-center justify-center
          text-xl overflow-hidden
          ${isRound ? "rounded-full" : "rounded-md"}
        `}
        style={{ background: cover.bg ?? "#282828" }}
      >
        {cover.emoji  && cover.emoji}
        {cover.initials && (
          <span className="text-sm font-bold text-white">{cover.initials}</span>
        )}
        {cover.gradient && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: cover.gradient }}
          >
            <HeartIcon size={20} className="text-white fill-white" />
          </div>
        )}
      </div>

      {/* Texto */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{title}</p>
        <p className="text-xs text-spotify-muted mt-0.5 truncate">{subtitle}</p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
const FILTER_TABS = ["Playlists", "Artistas", "Álbuns"];

export default function Sidebar({ activeSection, setActiveSection }) {
  const { likedIds } = usePlayer();
  const [activeFilter, setActiveFilter] = useState("Playlists");

  const likedCount = likedIds.size;

  return (
    <aside className="w-60 min-w-[240px] h-full flex flex-col gap-2 pb-2">

      {/* ── Bloco superior: Logo + Navegação ── */}
      <div className="bg-spotify-elevated rounded-lg px-4 py-5 flex flex-col gap-1">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center flex-shrink-0">
            {/* Logo SVG inline (sem dependência de arquivo externo) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.38c-.2.32-.63.42-.95.22-2.6-1.59-5.87-1.95-9.73-1.07-.37.08-.75-.16-.83-.53-.08-.37.16-.75.53-.83 4.22-.97 7.85-.55 10.77 1.24.32.2.42.63.21.97zm1.24-2.76c-.26.41-.8.54-1.21.28-2.97-1.83-7.5-2.36-11.02-1.29-.46.14-.94-.12-1.08-.58-.13-.46.12-.94.58-1.08 4.02-1.22 9.02-.63 12.46 1.47.41.26.54.8.27 1.2zm.11-2.87c-3.57-2.12-9.46-2.31-12.87-1.28-.55.17-1.13-.15-1.3-.7-.17-.55.15-1.13.7-1.3 3.92-1.19 10.43-.96 14.55 1.48.49.29.65.93.36 1.42-.29.49-.93.65-1.44.38z"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">SoundWave</span>
        </div>

        {/* Itens de navegação */}
        {[
          { id: "home",   label: "Home",   Icon: HomeIcon   },
          { id: "search", label: "Buscar", Icon: SearchIcon },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`
              flex items-center gap-4 px-3 py-2.5 rounded-md w-full text-left
              text-sm font-semibold transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green
              ${activeSection === id
                ? "bg-white/10 text-white"
                : "text-spotify-muted hover:text-white"}
            `}
          >
            <Icon size={22} className={activeSection === id ? "fill-white" : ""} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Bloco inferior: Biblioteca ── */}
      <div className="bg-spotify-elevated rounded-lg px-3 py-4 flex flex-col flex-1 overflow-hidden">

        {/* Cabeçalho da biblioteca */}
        <div className="flex items-center justify-between mb-4 px-1">
          <button className="flex items-center gap-2.5 text-sm font-semibold text-spotify-muted hover:text-white transition-colors">
            <LibraryIcon size={22} />
            Sua Biblioteca
          </button>
          <button
            aria-label="Criar playlist"
            className="text-spotify-muted hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <PlusIcon size={18} />
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green
                ${activeFilter === tab
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista da biblioteca (scrollável) */}
        <div className="overflow-y-auto flex-1 flex flex-col gap-0.5 pr-0.5">

          {/* Músicas curtidas */}
          <LibraryItem
            cover={{ gradient: "linear-gradient(135deg, #450af5, #c4efd9)" }}
            title="Músicas Curtidas"
            subtitle={`Playlist • ${likedCount} música${likedCount !== 1 ? "s" : ""}`}
          />

          {/* Playlists do usuário */}
          {activeFilter !== "Artistas" &&
            PLAYLISTS.map((pl) => (
              <LibraryItem
                key={pl.id}
                cover={{ bg: "#282828", emoji: pl.emoji }}
                title={pl.name}
                subtitle={`Playlist • ${pl.trackCount} faixas`}
              />
            ))}

          {/* Artistas seguidos */}
          {activeFilter !== "Playlists" &&
            FOLLOWED_ARTISTS.map((artist) => (
              <LibraryItem
                key={artist.id}
                cover={{ bg: artist.color, initials: artist.initials }}
                title={artist.name}
                subtitle="Artista"
                isRound
              />
            ))}
        </div>
      </div>
    </aside>
  );
}
