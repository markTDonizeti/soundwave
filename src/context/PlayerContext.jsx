/**
 * PlayerContext.jsx
 *
 * Estado global do player de música via React Context API.
 *
 * Responsabilidades:
 *  - Controlar faixa atual, play/pause, progresso, volume
 *  - Lógica de shuffle (Fisher-Yates) e repeat (single/all)
 *  - Gerenciar lista de músicas curtidas
 *  - Expor API limpa para os componentes filhos
 *
 * Integração futura com Spotify:
 *  - Substituir `useAudioEngine` por `SpotifyPlayer.connect()`
 *  - Substituir TRACKS por chamadas à Spotify Web API
 *  - Manter a mesma interface de contexto — zero refatoração nos componentes
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { TRACKS } from "../data/mockData";
import { useAudioEngine } from "../hooks/useAudioEngine";

// ---------------------------------------------------------------------------
// Tipos de ação do reducer
// ---------------------------------------------------------------------------
const ACTIONS = {
  SET_TRACK:        "SET_TRACK",
  TOGGLE_PLAY:      "TOGGLE_PLAY",
  SET_PLAYING:      "SET_PLAYING",
  SET_PROGRESS:     "SET_PROGRESS",
  SET_VOLUME:       "SET_VOLUME",
  TOGGLE_SHUFFLE:   "TOGGLE_SHUFFLE",
  TOGGLE_REPEAT:    "TOGGLE_REPEAT",
  TOGGLE_LIKE:      "TOGGLE_LIKE",
};

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------
const initialState = {
  currentTrack:  TRACKS[0],
  isPlaying:     false,
  currentTime:   0,
  duration:      0,
  volume:        0.7,
  isShuffle:     false,
  // "none" | "all" | "one"
  repeatMode:    "none",
  likedIds:      new Set(),
};

// ---------------------------------------------------------------------------
// Reducer puro — toda lógica de estado aqui para fácil debug/teste
// ---------------------------------------------------------------------------
function playerReducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_TRACK:
      return { ...state, currentTrack: payload, currentTime: 0, duration: 0, isPlaying: true };

    case ACTIONS.TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying };

    case ACTIONS.SET_PLAYING:
      return { ...state, isPlaying: payload };

    case ACTIONS.SET_PROGRESS:
      return { ...state, currentTime: payload.currentTime, duration: payload.duration };

    case ACTIONS.SET_VOLUME:
      return { ...state, volume: Math.max(0, Math.min(1, payload)) };

    case ACTIONS.TOGGLE_SHUFFLE:
      return { ...state, isShuffle: !state.isShuffle };

    case ACTIONS.TOGGLE_REPEAT: {
      // Cicla entre os três modos: none → all → one → none
      const next = { none: "all", all: "one", one: "none" };
      return { ...state, repeatMode: next[state.repeatMode] };
    }

    case ACTIONS.TOGGLE_LIKE: {
      const liked = new Set(state.likedIds);
      liked.has(payload) ? liked.delete(payload) : liked.add(payload);
      return { ...state, likedIds: liked };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Algoritmo Fisher-Yates para embaralhar a fila
// ---------------------------------------------------------------------------
function shuffledQueue(currentId) {
  const others = TRACKS.filter((t) => t.id !== currentId);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return others;
}

// ---------------------------------------------------------------------------
// Criação do contexto
// ---------------------------------------------------------------------------
export const PlayerContext = createContext(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Fila de shuffle gerada dinamicamente (ref para não causar re-renders)
  const shuffleQueue = useRef([]);

  // Callbacks estáveis para o engine de áudio
  const handleTimeUpdate = useCallback((currentTime, duration) => {
    dispatch({
      type: ACTIONS.SET_PROGRESS,
      payload: { currentTime, duration },
    });
  }, []);

  const skipNext = useCallback(() => {
    const { currentTrack, isShuffle, repeatMode } = state;

    if (repeatMode === "one") {
      // Reinicia a mesma faixa — o engine vai detectar troca de `src`
      dispatch({ type: ACTIONS.SET_TRACK, payload: { ...currentTrack } });
      return;
    }

    let nextTrack;
    if (isShuffle) {
      if (shuffleQueue.current.length === 0) {
        shuffleQueue.current = shuffledQueue(currentTrack.id);
      }
      nextTrack = shuffleQueue.current.shift();
    } else {
      const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
      nextTrack = TRACKS[(idx + 1) % TRACKS.length];
    }

    dispatch({ type: ACTIONS.SET_TRACK, payload: nextTrack });
  }, [state]);

  // Exposto também como handleTrackEnd para o engine de áudio
  const handleTrackEnd = useCallback(() => {
    skipNext();
  }, [skipNext]);

  // Motor de áudio isolado
  const { seek: audioSeek } = useAudioEngine({
    src:        state.currentTrack.src,
    isPlaying:  state.isPlaying,
    volume:     state.volume,
    onTimeUpdate: handleTimeUpdate,
    onTrackEnd:   handleTrackEnd,
  });

  // ---------------------------------------------------------------------------
  // API pública do contexto
  // ---------------------------------------------------------------------------

  /** Toca uma faixa específica ou alterna play/pause da atual */
  const togglePlay = useCallback((track) => {
    if (track && track.id !== state.currentTrack.id) {
      shuffleQueue.current = []; // reseta a fila ao trocar de faixa manualmente
      dispatch({ type: ACTIONS.SET_TRACK, payload: track });
    } else {
      dispatch({ type: ACTIONS.TOGGLE_PLAY });
    }
  }, [state.currentTrack.id]);

  /** Volta para a faixa anterior (ou reinicia se > 3s tocados) */
  const skipPrev = useCallback(() => {
    if (state.currentTime > 3) {
      audioSeek(0);
      return;
    }
    const idx = TRACKS.findIndex((t) => t.id === state.currentTrack.id);
    const prev = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
    dispatch({ type: ACTIONS.SET_TRACK, payload: prev });
  }, [state.currentTrack.id, state.currentTime, audioSeek]);

  /**
   * Seek por percentual (0–100).
   * Chamado pelo componente Player ao arrastar a barra de progresso.
   */
  const seekByPercent = useCallback((pct) => {
    if (!state.duration) return;
    audioSeek((pct / 100) * state.duration);
  }, [state.duration, audioSeek]);

  const setVolume       = useCallback((v) => dispatch({ type: ACTIONS.SET_VOLUME,      payload: v }), []);
  const toggleShuffle   = useCallback(()  => dispatch({ type: ACTIONS.TOGGLE_SHUFFLE }), []);
  const toggleRepeat    = useCallback(()  => dispatch({ type: ACTIONS.TOGGLE_REPEAT  }), []);
  const toggleLike      = useCallback((id)=> dispatch({ type: ACTIONS.TOGGLE_LIKE,     payload: id }), []);

  // Progresso em % para a barra (memoizado para evitar recalc em todo render)
  const progressPercent = useMemo(() =>
    state.duration ? (state.currentTime / state.duration) * 100 : 0,
    [state.currentTime, state.duration]
  );

  // ---------------------------------------------------------------------------
  // Valor exposto
  // ---------------------------------------------------------------------------
  const value = useMemo(() => ({
    // Estado
    currentTrack:    state.currentTrack,
    isPlaying:       state.isPlaying,
    currentTime:     state.currentTime,
    duration:        state.duration,
    volume:          state.volume,
    isShuffle:       state.isShuffle,
    repeatMode:      state.repeatMode,
    likedIds:        state.likedIds,
    progressPercent,
    // Ações
    togglePlay,
    skipNext,
    skipPrev,
    seekByPercent,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  }), [
    state, progressPercent,
    togglePlay, skipNext, skipPrev, seekByPercent,
    setVolume, toggleShuffle, toggleRepeat, toggleLike,
  ]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook de conveniência
// ---------------------------------------------------------------------------
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer deve ser usado dentro de <PlayerProvider>");
  return ctx;
}
