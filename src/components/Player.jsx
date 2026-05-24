/**
 * Player.jsx
 *
 * Rodapé fixo com o player de música completo.
 *
 * Seções:
 *  LEFT   — Capa + título + artista + botão de curtir
 *  CENTER — Controles (shuffle, prev, play/pause, next, repeat) + barra de progresso
 *  RIGHT  — Volume + ações secundárias
 */

import { useState, useCallback } from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  PlayIcon,
  PauseIcon,
  SkipNextIcon,
  SkipPrevIcon,
  ShuffleIcon,
  RepeatIcon,
  RepeatOneIcon,
  VolumeIcon,
  VolumeMuteIcon,
  HeartIcon,
  DotsIcon,
} from "./icons/Icons";
import EqBars from "./EqBars";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const fmtTime = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${sec}`;
};

// ---------------------------------------------------------------------------
// Sub-componente: barra de progresso com seek por drag
// ---------------------------------------------------------------------------
function ProgressBar() {
  const { progressPercent, currentTime, duration, seekByPercent } = usePlayer();

  // Estado local apenas para o drag — não precisa de re-render global
  const [dragging, setDragging] = useState(false);
  const [dragPct, setDragPct]   = useState(0);

  const displayPct     = dragging ? dragPct : progressPercent;
  const displayElapsed = dragging ? (dragPct / 100) * duration : currentTime;

  const handleChange = useCallback((e) => {
    setDragging(true);
    setDragPct(Number(e.target.value));
  }, []);

  const handleCommit = useCallback((e) => {
    seekByPercent(Number(e.target.value));
    setDragging(false);
  }, [seekByPercent]);

  return (
    <div className="flex items-center gap-2 w-full max-w-lg">
      {/* Tempo decorrido */}
      <span className="text-[11px] text-spotify-muted tabular-nums w-9 text-right">
        {fmtTime(displayElapsed)}
      </span>

      {/* Track + thumb */}
      <div className="group relative flex-1 flex items-center h-4">
        {/* Track de fundo */}
        <div className="absolute w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white group-hover:bg-spotify-green rounded-full transition-colors duration-150"
            style={{
              width: `${displayPct}%`,
              transition: dragging ? "none" : "width 0.1s linear",
            }}
          />
        </div>

        {/* Input range (invisível, cobre toda a área de clique) */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={displayPct}
          onChange={handleChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          aria-label="Progresso da música"
          className="absolute w-full opacity-0 cursor-pointer h-4"
        />

        {/* Thumb — aparece no hover ou durante drag */}
        <div
          className={`
            absolute w-3 h-3 bg-white rounded-full -translate-x-1/2
            transition-opacity duration-150
            ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
          style={{ left: `${displayPct}%` }}
        />
      </div>

      {/* Duração total */}
      <span className="text-[11px] text-spotify-muted tabular-nums w-9">
        {fmtTime(duration || 0)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: controle de volume
// ---------------------------------------------------------------------------
function VolumeControl() {
  const { volume, setVolume } = usePlayer();
  const isMuted = volume === 0;

  const toggleMute = useCallback(() => {
    setVolume(isMuted ? 0.7 : 0);
  }, [isMuted, setVolume]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Ativar som" : "Silenciar"}
        className="text-spotify-muted hover:text-white transition-colors p-1"
      >
        {isMuted ? <VolumeMuteIcon size={18} /> : <VolumeIcon size={18} />}
      </button>

      <div className="group relative flex items-center w-24 h-4">
        <div className="absolute w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white group-hover:bg-spotify-green rounded-full transition-colors"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="absolute w-full opacity-0 cursor-pointer h-4"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function Player() {
  const {
    currentTrack,
    isPlaying,
    isShuffle,
    repeatMode,
    likedIds,
    togglePlay,
    skipNext,
    skipPrev,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  const isLiked = likedIds.has(currentTrack.id);

  return (
    <footer
      className="
        bg-[#181818] border-t border-white/5
        px-4 flex items-center gap-4
        h-[90px] flex-shrink-0 select-none
      "
    >
      {/* ── LEFT: info da faixa ── */}
      <div className="flex items-center gap-3.5 w-[220px] min-w-0">
        {/* Capa */}
        <div className="relative flex-shrink-0">
          <img
            src={currentTrack.cover}
            alt={currentTrack.album}
            className="w-14 h-14 rounded object-cover"
            onError={(e) => {
              e.currentTarget.style.background = currentTrack.color;
              e.currentTarget.src = "";
            }}
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
              <EqBars size="sm" />
            </div>
          )}
        </div>

        {/* Título + artista */}
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-white truncate">
            {currentTrack.title}
          </p>
          <p className="text-[11px] text-spotify-muted truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>

        {/* Curtir */}
        <button
          onClick={() => toggleLike(currentTrack.id)}
          aria-label={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className={`
            flex-shrink-0 p-1 transition-all duration-150
            ${isLiked
              ? "text-spotify-green"
              : "text-spotify-muted hover:text-white"}
          `}
        >
          <HeartIcon
            size={16}
            className={isLiked ? "fill-spotify-green stroke-spotify-green" : ""}
          />
        </button>
      </div>

      {/* ── CENTER: controles + progresso ── */}
      <div className="flex-1 flex flex-col items-center gap-2">

        {/* Botões de controle */}
        <div className="flex items-center gap-5">

          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            aria-label="Embaralhar"
            aria-pressed={isShuffle}
            className={`
              relative p-1 transition-colors
              ${isShuffle ? "text-spotify-green" : "text-spotify-muted hover:text-white"}
            `}
          >
            <ShuffleIcon size={18} />
            {isShuffle && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-green" />
            )}
          </button>

          {/* Anterior */}
          <button
            onClick={skipPrev}
            aria-label="Faixa anterior"
            className="text-spotify-muted hover:text-white transition-colors hover:scale-105"
          >
            <SkipPrevIcon size={20} className="fill-current" />
          </button>

          {/* Play / Pause — botão principal */}
          <button
            onClick={() => togglePlay()}
            aria-label={isPlaying ? "Pausar" : "Tocar"}
            className="
              w-9 h-9 rounded-full bg-white text-black
              flex items-center justify-center flex-shrink-0
              hover:scale-105 active:scale-95
              transition-transform duration-100
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green
            "
          >
            {isPlaying ? (
              <PauseIcon size={16} className="fill-black" />
            ) : (
              <PlayIcon size={16} className="fill-black ml-0.5" />
            )}
          </button>

          {/* Próxima */}
          <button
            onClick={skipNext}
            aria-label="Próxima faixa"
            className="text-spotify-muted hover:text-white transition-colors hover:scale-105"
          >
            <SkipNextIcon size={20} className="fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            aria-label="Repetir"
            aria-pressed={repeatMode !== "none"}
            className={`
              relative p-1 transition-colors
              ${repeatMode !== "none"
                ? "text-spotify-green"
                : "text-spotify-muted hover:text-white"}
            `}
          >
            {repeatMode === "one" ? (
              <RepeatOneIcon size={18} />
            ) : (
              <RepeatIcon size={18} />
            )}
            {repeatMode !== "none" && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-green" />
            )}
          </button>
        </div>

        {/* Barra de progresso */}
        <ProgressBar />
      </div>

      {/* ── RIGHT: volume + ações ── */}
      <div className="flex items-center gap-2 w-[180px] justify-end">
        <VolumeControl />
        <button
          aria-label="Mais opções"
          className="text-spotify-muted hover:text-white transition-colors p-1 ml-1"
        >
          <DotsIcon size={18} />
        </button>
      </div>
    </footer>
  );
}
