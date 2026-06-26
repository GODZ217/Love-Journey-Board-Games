"use client";

import { snakes, slides, getTilePosition } from "@/data/board";

function getCenter(tileNumber: number) {
  const pos = getTilePosition(tileNumber);
  return {
    x: pos.col * 100 + 50,
    y: (9 - pos.row) * 100 + 50,
  };
}

function SnakeSVG({ start, end }: { start: number; end: number }) {
  const s = getCenter(start);
  const e = getCenter(end);

  const dx = e.x - s.x;
  const dy = e.y - s.y;

  const cp1x = s.x + dx * 0.25 + dy * 0.15;
  const cp1y = s.y + dy * 0.25 - dx * 0.15;
  const cp2x = s.x + dx * 0.75 - dy * 0.15;
  const cp2y = s.y + dy * 0.75 + dx * 0.15;

  const d = `M ${s.x} ${s.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.x} ${e.y}`;

  return (
    <g>
      <path d={d} fill="none" stroke="#22C55E" strokeWidth="12" strokeLinecap="round" opacity="0.2" />
      <path d={d} fill="none" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5,5" />
      <circle cx={s.x} cy={s.y} r="6" fill="#22C55E" stroke="#16A34A" strokeWidth="1" />
      <circle cx={s.x - 2} cy={s.y - 2} r="1.2" fill="white" />
      <circle cx={s.x + 2} cy={s.y - 2} r="1.2" fill="white" />
    </g>
  );
}

function SlideSVG({ start, end }: { start: number; end: number }) {
  const s = getCenter(start);
  const e = getCenter(end);

  const dx = e.x - s.x;
  const dy = e.y - s.y;

  const cp1x = s.x + dx * 0.3 + dy * 0.12;
  const cp1y = s.y + dy * 0.3 - dx * 0.12;
  const cp2x = s.x + dx * 0.7 - dy * 0.12;
  const cp2y = s.y + dy * 0.7 + dx * 0.12;

  const d = `M ${s.x} ${s.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.x} ${e.y}`;

  return (
    <g>
      <path d={d} fill="none" stroke="url(#rainbow)" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
      <path d={d} fill="none" stroke="url(#rainbow)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d={d} fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeDasharray="3,5" opacity="0.4" />
      <text x={s.x} y={s.y - 10} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" opacity="0.8">
        🌈
      </text>
    </g>
  );
}

export default function SnakeLadderLayer() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="20%" stopColor="#FFD93D" />
          <stop offset="40%" stopColor="#6BCB77" />
          <stop offset="60%" stopColor="#4D96FF" />
          <stop offset="80%" stopColor="#7C5CFC" />
          <stop offset="100%" stopColor="#FF6B9D" />
        </linearGradient>
      </defs>

      {snakes.map((s) => (
        <SnakeSVG key={`snk-${s.start}`} start={s.start} end={s.end} />
      ))}

      {slides.map((sl) => (
        <SlideSVG key={`sld-${sl.start}`} start={sl.start} end={sl.end} />
      ))}
    </svg>
  );
}
