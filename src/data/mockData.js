/**
 * mockData.js
 *
 * Dados estáticos (mock) do SoundWave.
 * Estrutura preparada para integração futura com a Spotify Web API.
 *
 * Substituição futura:
 *   GET https://api.spotify.com/v1/playlists/{id}/tracks  →  PLAYLISTS
 *   GET https://api.spotify.com/v1/albums/{id}/tracks     →  TRACKS
 */

// ---------------------------------------------------------------------------
// Playlists do usuário (sidebar)
// ---------------------------------------------------------------------------
export const PLAYLISTS = [
  { id: "pl1", name: "Chill Vibes",   emoji: "🎵", trackCount: 24 },
  { id: "pl2", name: "Deep Focus",    emoji: "🎧", trackCount: 18 },
  { id: "pl3", name: "Late Night",    emoji: "🌙", trackCount: 31 },
  { id: "pl4", name: "Energy Boost",  emoji: "⚡", trackCount: 15 },
];

// ---------------------------------------------------------------------------
// Artistas em destaque (sidebar — seção "Seguindo")
// ---------------------------------------------------------------------------
export const FOLLOWED_ARTISTS = [
  { id: "ar1", name: "Erik Satie",          initials: "ES", color: "#2a7abf" },
  { id: "ar2", name: "Claude Debussy",      initials: "CD", color: "#2a7a50" },
  { id: "ar3", name: "Ludwig van Beethoven",initials: "LB", color: "#8b2020" },
  { id: "ar4", name: "Antonio Vivaldi",     initials: "AV", color: "#8a6a10" },
];

// ---------------------------------------------------------------------------
// Faixas (domínio público via Wikimedia Commons)
//
// Campos espelhando a Spotify Track Object para migração fácil:
//   id, name (title), artists[], album{}, duration_ms, preview_url
//   + campos extras de UI: color, colorLight, genre
// ---------------------------------------------------------------------------
export const TRACKS = [
  {
    id: "t1",
    title: "Gymnopedie No. 1",
    artist: "Erik Satie",
    album: "Gymnopédies",
    albumId: "a1",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Gymnop%C3%A9die_01.jpg/300px-Gymnop%C3%A9die_01.jpg",
    // Cor dominante da capa — usada no gradiente dinâmico do header
    color: "#1a4a6e",
    colorLight: "#2a7abf",
    duration: 220, // segundos (fallback antes do áudio carregar)
    src: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Gymnop%C3%A9die_No._1_Performed_by_Frank_Levy.ogg",
    genre: "Classical",
    year: 1888,
  },
  {
    id: "t2",
    title: "Für Elise",
    artist: "Ludwig van Beethoven",
    album: "Piano Works",
    albumId: "a2",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/300px-Beethoven.jpg",
    color: "#4a1a1a",
    colorLight: "#8b2020",
    duration: 175,
    src: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Fur_elise.ogg",
    genre: "Classical",
    year: 1810,
  },
  {
    id: "t3",
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    album: "Piano Sonatas",
    albumId: "a3",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/300px-Beethoven.jpg",
    color: "#1a1a4a",
    colorLight: "#3030a0",
    duration: 312,
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Beethoven_Piano_Sonata_14_-_I._Adagio_sostenuto.ogg",
    genre: "Classical",
    year: 1802,
  },
  {
    id: "t4",
    title: "Clair de Lune",
    artist: "Claude Debussy",
    album: "Suite Bergamasque",
    albumId: "a4",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Debussy_Nadar.jpg/300px-Debussy_Nadar.jpg",
    color: "#1a3a2a",
    colorLight: "#2a7a50",
    duration: 290,
    src: "https://upload.wikimedia.org/wikipedia/commons/2/20/Debussy_-_Clair_de_lune.ogg",
    genre: "Classical",
    year: 1905,
  },
  {
    id: "t5",
    title: "Spring (Allegro)",
    artist: "Antonio Vivaldi",
    album: "The Four Seasons",
    albumId: "a5",
    cover:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vivaldi.jpg/300px-Vivaldi.jpg",
    color: "#3a2a0a",
    colorLight: "#8a6a10",
    duration: 198,
    src: "https://upload.wikimedia.org/wikipedia/commons/1/11/Vivaldi_-_Spring_mvt_1_Allegro_-_John_Harrison_violin.ogg",
    genre: "Classical",
    year: 1725,
  },
];
