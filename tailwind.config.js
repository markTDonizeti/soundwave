/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores do design system SoundWave / Spotify
        "spotify-green":    "#1DB954",
        "spotify-green-hover": "#1ed760",
        "spotify-bg":       "#000000",
        "spotify-elevated": "#121212",
        "spotify-card":     "#181818",
        "spotify-hover":    "#282828",
        "spotify-muted":    "#b3b3b3",
        "spotify-white":    "#FFFFFF",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      backgroundOpacity: {
        7: "0.07",
        8: "0.08",
      },
    },
  },
  plugins: [],
};
