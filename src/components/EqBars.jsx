/**
 * EqBars.jsx
 *
 * Indicador visual de "equalizador" animado.
 * Exibido quando uma faixa está tocando.
 *
 * Props:
 *  - size: "sm" | "md" (padrão: "md")
 */

export default function EqBars({ size = "md" }) {
  const barHeight = size === "sm" ? [6, 12, 5] : [8, 14, 6];
  const barWidth  = size === "sm" ? 2 : 3;

  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height: size === "sm" ? 14 : 18 }}
      aria-label="Tocando agora"
      role="img"
    >
      {barHeight.map((h, i) => (
        <span
          key={i}
          className="inline-block rounded-sm bg-spotify-green"
          style={{
            width: barWidth,
            height: h,
            animationName: "eqBar",
            animationDuration: "0.8s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${[0, 0.2, 0.1][i]}s`,
          }}
        />
      ))}

      {/* Keyframes injetados uma única vez via <style> */}
      <style>{`
        @keyframes eqBar {
          0%, 100% { transform: scaleY(0.4); }
          50%       { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
