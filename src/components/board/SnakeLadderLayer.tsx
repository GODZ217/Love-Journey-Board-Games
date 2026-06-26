"use client";

import { ladders, snakes, slides, getTilePosition } from "@/data/board";

function getCenter(tileNumber: number) {
  const pos = getTilePosition(tileNumber);
  return {
    x: pos.col * 100 + 50,
    y: (9 - pos.row) * 100 + 50,
  };
}

function LadderSVG({ start, end }: { start: number; end: number }) {
  const s = getCenter(start);
  const e = getCenter(end);

  const dx = e.x - s.x;
  const dy = e.y - s.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;

  const nx = -dy / len;
  const ny = dx / len;
  const offset = 14;

  const p1x = s.x + nx * offset;
  const p1y = s.y + ny * offset;
  const p2x = e.x + nx * offset;
  const p2y = e.y + ny * offset;
  const p3x = s.x - nx * offset;
  const p3y = s.y - ny * offset;
  const p4x = e.x - nx * offset;
  const p4y = e.y - ny * offset;

  const rungCount = 6;
  const rungs = Array.from({ length: rungCount }, (_, i) => {
    const t = (i + 1) / (rungCount + 1);
    return {
      x1: p1x + (p2x - p1x) * t,
      y1: p1y + (p2y - p1y) * t,
      x2: p3x + (p4x - p3x) * t,
      y2: p3y + (p4y - p3y) * t,
    };
  });

  return (
    <g>
      <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1={p3x} y1={p3y} x2={p4x} y2={p4y} stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1={p1x} y1={p1y} x2={p2x} y2={p2y} stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={p3x} y1={p3y} x2={p4x} y2={p4y} stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      {rungs.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </g>
  );
}

function SnakeSVG({ start, end }: { start: number; end: number }) {
  const s = getCenter(start);
  const e = getCenter(end);

  const dx = e.x - s.x;
  const dy = e.y - s.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  const cp1x = s.x + dx * 0.25 + dy * 0.15;
  const cp1y = s.y + dy * 0.25 - dx * 0.15;
  const cp2x = s.x + dx * 0.75 - dy * 0.15;
  const cp2y = s.y + dy * 0.75 + dx * 0.15;

  const d = `M ${s.x} ${s.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.x} ${e.y}`;

  return (
    <g>
      <path d={d} fill="none" stroke="#22C55E" strokeWidth="12" strokeLinecap="round" opacity="0.25" />
      <path d={d} fill="none" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeDasharray="6,6" />
      {/* Head */}
      <circle cx={s.x} cy={s.y} r="8" fill="#22C55E" stroke="#16A34A" strokeWidth="1.5" />
      <circle cx={s.x - 2.5} cy={s.y - 2.5} r="1.5" fill="white" />
      <circle cx={s.x + 2.5} cy={s.y - 2.5} r="1.5" fill="white" />
    </g>
  );
}

function SlideSVG({ start, end }: { start: number; end: number }) {
  const s = getCenter(start);
  const e = getCenter(end);

  const dx = e.x - s.x;
  const dy = e.y - s.y;

  const cp1x = s.x + dx * 0.3 + dy * 0.1;
  const cp1y = s.y + dy * 0.3 - dx * 0.1;
  const cp2x = s.x + dx * 0.7 - dy * 0.1;
  const cp2y = s.y + dy * 0.7 + dx * 0.1;

  const d = `M ${s.x} ${s.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${e.x} ${e.y}`;

  return (
    <g>
      <path d={d} fill="none" stroke="url(#rainbow)" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <path d={d} fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3,6" opacity="0.5" />
      <text x={s.x} y={s.y - 8} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
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
          <stop offset="25%" stopColor="#FFD93D" />
          <stop offset="50%" stopColor="#6BCB77" />
          <stop offset="75%" stopColor="#4D96FF" />
          <stop offset="100%" stopColor="#9B59B6" />
        </linearGradient>
      </defs>

      {ladders.map((l) => (
        <LadderSVG key={`lad-${l.start}`} start={l.start} end={l.end} />
      ))}

      {snakes.map((s) => (
        <SnakeSVG key={`snk-${s.start}`} start={s.start} end={s.end} />
      ))}

      {slides.map((sl) => (
        <SlideSVG key={`sld-${sl.start}`} start={sl.start} end={sl.end} />
      ))}
    </svg>
  );
}
