/**
 * useAudioEngine.js
 *
 * Hook isolado que encapsula toda a lógica da Web Audio API.
 * Separar o "motor de áudio" do contexto React facilita:
 *   - testes unitários do player sem renderizar UI
 *   - futura migração para a Spotify Web Playback SDK
 */

import { useRef, useEffect, useCallback } from "react";

/**
 * @param {object} params
 * @param {string}   params.src       URL do áudio atual
 * @param {boolean}  params.isPlaying
 * @param {number}   params.volume    0–1
 * @param {Function} params.onTimeUpdate   (currentTime, duration) => void
 * @param {Function} params.onTrackEnd     () => void
 */
export function useAudioEngine({ src, isPlaying, volume, onTimeUpdate, onTrackEnd }) {
  const audioRef = useRef(null);

  // Cria o elemento <audio> uma única vez
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
  }

  // Troca a fonte quando a faixa muda
  useEffect(() => {
    const audio = audioRef.current;
    audio.src = src;
    audio.load();

    // Se já estava tocando, inicia a nova faixa automaticamente
    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay pode ser bloqueado pelo browser na primeira interação
        console.warn("Autoplay bloqueado. Aguardando interação do usuário.");
      });
    }
    // Não incluímos `isPlaying` nas deps para evitar loop —
    // o efeito abaixo cuida exclusivamente do play/pause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Controla play / pause sem recarregar o áudio
  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sincroniza o volume em tempo real
  useEffect(() => {
    audioRef.current.volume = Math.max(0, Math.min(1, volume));
  }, [volume]);

  // Listeners de evento (evitamos re-registrar a cada render com useCallback)
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () =>
      onTimeUpdate(audio.currentTime, audio.duration || 0);

    const handleEnded = () => onTrackEnd();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate, onTrackEnd]);

  // Expõe o método seek para o contexto chamar diretamente
  const seek = useCallback((seconds) => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = seconds;
    }
  }, []);

  return { seek };
}
