"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: "heart" | "sparkle" | "circle";
  color: string;
}

const COLORS = ["#ec4899", "#a78bfa", "#06b6d4", "#f472b6", "#8b5cf6", "#22d3ee"];

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const spawnParticle = useCallback((w: number, h: number): Particle => {
    const types: ("heart" | "sparkle" | "circle")[] = ["heart", "sparkle", "circle"];
    return {
      x: Math.random() * w,
      y: h + 10,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 1.5 + 0.5),
      opacity: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 200 + 150,
      type: types[Math.floor(Math.random() * types.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      if (frameCount % 3 === 0 && particlesRef.current.length < 50) {
        particlesRef.current.push(spawnParticle(canvas.width, canvas.height));
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity *= 0.998;

        ctx.save();
        ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;

        if (p.type === "heart") {
          const s = p.size;
          ctx.font = `${s * 3}px serif`;
          ctx.textAlign = "center";
          ctx.fillText("♥", p.x, p.y);
        } else if (p.type === "sparkle") {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.lineTo(p.x + Math.cos(angle) * p.size, p.y + Math.sin(angle) * p.size);
            ctx.lineTo(p.x + Math.cos(angle + Math.PI / 4) * p.size * 0.5, p.y + Math.sin(angle + Math.PI / 4) * p.size * 0.5);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return p.life < p.maxLife && p.y > -20;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [spawnParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
