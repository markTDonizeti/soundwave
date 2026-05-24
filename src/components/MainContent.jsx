/**
 * MainContent.jsx
 *
 * Área central com scroll independente. Contém:
 *  - Header com gradiente dinâmico (cor da faixa atual)
 *  - Saudação contextual por hora do dia
 *  - Grid de acesso rápido (4 itens 2×2)
 *  - Grid de álbuns com hover play e indicador de equalizer
 *  - Tabela completa de faixas com colunas interativas
 */

import { useState, useMemo, useCallback } from "react";
import { TRACKS } from "../data/mockData";
import { usePlayer } from "../context/PlayerContext";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./icons/Icons";
import EqBars from "./EqBars";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmtTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${sec}`;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

// ---------------------------------------------------------------------------
// Sub-componente: Card de álbum na grade
// ---------------------------------------------------------------------------
function AlbumCard({ track }) {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const [hovered, setHovered] = useState(false);
  const isActive = currentTrack.id === track.id;

  const handlePlay = useCallback(
    (e) => {
      e.stopPropagation();
      togglePlay(track);
    },
    [togglePlay, track]
  );

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-[#181818] hover:bg-[#282828] rounded-lg p-3.5 cursor-pointer transition-colors duration-200"
    >
      {/* Capa do álbum */}
      <div className="relative mb-3.5">
        <div className="aspect-square rounded-md overflow-hidden bg-spotify-elevated">
          <img
            src={track.cover}
            alt={track.album}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Botão de play flutuante — aparece no hover */}
        <button
          onClick={handlePlay}
          aria-label={isActive && isPlaying ? "Pausar" : `Tocar ${track.title}`}
          className={`
            absolute bottom-2 right-2
            w-11 h-11 rounded-full bg-spotify-green text-black
            flex items-center justify-center shadow-xl
            transition-all duration-200 ease-out
            hover:scale-105 hover:bg-[#1ed760]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
            ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
        >
          {isActive && isPlaying ? (
            <PauseIcon size={18} className="fill-black" />
          ) : (
            <PlayIcon size={18} className="fill-black ml-0.5" />
          )}
        </button>

        {/* Equalizador animado quando está tocando e não está em hover */}
        {isActive && isPlaying && !hovered && (
          <div className="absolute bottom-3 right-3.5">
            <EqBars />
          </div>
        )}
      </div>

      {/* Informações */}
      <p
        className={`text-sm font-bold leading-snug truncate mb-1 ${
          isActive ? "text-spotify-green" : "text-white"
        }`}
      >
        {track.title}
      </p>
      <p className="text-xs text-spotify-muted truncate">{track.artist}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Linha da tabela de faixas
// ---------------------------------------------------------------------------
function TrackRow({ track, index }) {
  const { currentTrack, isPlaying, likedIds, togglePlay, toggleLike } =
    usePlayer();
  const [hovered, setHovered] = useState(false);
  const isActive = currentTrack.id === track.id;
  const isLiked = likedIds.has(track.id);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={() => togglePlay(track)}
      className={`
        grid grid-cols-[16px_1fr_1fr_auto_auto] gap-x-4 items-center
        px-4 py-2.5 rounded-md transition-colors duration-150 cursor-pointer
        ${hovered ? "bg-white/7" : "bg-transparent"}
      `}
    >
      {/* Número / play icon / eq bars */}
      <div className="flex items-center justify-center">
        {hovered ? (
          <button
            onClick={() => togglePlay(track)}
            className="text-white hover:scale-110 transition-transform"
          >
            {isActive && isPlaying ? (
              <PauseIcon size={14} className="fill-white" />
            ) : (
              <PlayIcon size={14} className="fill-white" />
            )}
          </button>
        ) : isActive && isPlaying ? (
          <EqBars size="sm" />
        ) : (
          <span
            className={`text-sm ${
              isActive ? "text-spotify-green" : "text-spotify-muted"
            }`}
          >
            {index + 1}
          </span>
        )}
      </div>

      {/* Título + artista */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={track.cover}
          alt={track.album}
          className="w-10 h-10 rounded flex-shrink-0 object-cover"
          onError={(e) => {
            e.currentTarget.style.background = track.color;
            e.currentTarget.src = "";
          }}
        />
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isActive ? "text-spotify-green" : "text-white"
            }`}
          >
            {track.title}
          </p>
          <p className="text-xs text-spotify-muted truncate mt-0.5">
            {track.artist}
          </p>
        </div>
      </div>

      {/* Álbum */}
      <p className="text-sm text-spotify-muted truncate">{track.album}</p>

      {/* Curtir */}
      <button
        onClick={() => toggleLike(track.id)}
        aria-label={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className={`
          p-1 rounded-full transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green
          ${isLiked
            ? "text-spotify-green opacity-100"
            : hovered
            ? "text-white/50 opacity-100"
            : "opacity-0"}
        `}
      >
        <HeartIcon
          size={16}
          className={isLiked ? "fill-spotify-green stroke-spotify-green" : ""}
        />
      </button>

      {/* Duração */}
      <span className="text-sm text-spotify-muted tabular-nums">
        {fmtTime(track.duration)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function MainContent() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();

  // Gradiente dinâmico — muda conforme a faixa atual
  const gradientStyle = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${currentTrack.color} 0%, #121212 50%)`,
      transition: "background 1.2s ease",
    }),
    [currentTrack.color]
  );

  return (
    <main className="flex-1 overflow-y-auto rounded-lg bg-[#121212] relative">

      {/* ── Zona do gradiente ── */}
      <div style={gradientStyle} className="px-7 pt-6 pb-2">

        {/* Barra superior de navegação */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[ChevronLeftIcon, ChevronRightIcon].map((Icon, i) => (
              <button
                key={i}
                className="
                  w-8 h-8 rounded-full bg-black/30 flex items-center justify-center
                  text-white hover:bg-black/50 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                "
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-black rounded-full px-3.5 py-1.5 text-white text-xs font-bold hover:scale-105 transition-transform">
              Premium
            </button>
            <div className="w-8 h-8 rounded-full bg-[#535353] flex items-center justify-center text-sm font-bold cursor-pointer hover:scale-105 transition-transform">
              U
            </div>
          </div>
        </div>

        {/* Saudação */}
        <h1 className="text-3xl font-black mb-5">{greeting()}</h1>

        {/* Grade de acesso rápido 2×2 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {TRACKS.slice(0, 4).map((track) => {
            const isActive = currentTrack.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => togglePlay(track)}
                className="
                  flex items-center gap-3 rounded-md overflow-hidden
                  bg-white/10 hover:bg-white/20 transition-colors duration-200
                  text-left focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-spotify-green relative
                "
              >
                <img
                  src={track.cover}
                  alt={track.album}
                  className="w-[52px] h-[52px] object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.background = track.color;
                    e.currentTarget.src = "";
                  }}
                />
                <span className="text-sm font-bold text-white pr-2 leading-snug line-clamp-2">
                  {track.album}
                </span>
                {isActive && isPlaying && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <EqBars />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Seção: Grade de álbuns ── */}
      <div className="px-7 pt-7 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black">Tocadas Recentemente</h2>
          <button className="text-xs font-bold text-spotify-muted hover:text-white transition-colors">
            Ver tudo
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-4">
          {TRACKS.map((track) => (
            <AlbumCard key={track.id} track={track} />
          ))}
        </div>
      </div>

      {/* ── Seção: Tabela de faixas ── */}
      <div className="px-7 pb-8">
        <h2 className="text-xl font-black mb-4">Todas as Faixas</h2>

        {/* Cabeçalho da tabela */}
        <div className="grid grid-cols-[16px_1fr_1fr_auto_auto] gap-x-4 px-4 pb-2 border-b border-white/10 mb-1">
          {["#", "Título", "Álbum", "❤", "⏱"].map((col) => (
            <span key={col} className="text-xs font-medium text-spotify-muted">
              {col}
            </span>
          ))}
        </div>

        {TRACKS.map((track, idx) => (
          <TrackRow key={track.id} track={track} index={idx} />
        ))}
      </div>
    </main>
  );
}
