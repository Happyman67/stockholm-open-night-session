"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

type Frame = {
  width: number;
  height: number;
  mobile: boolean;
  project: (u: number, t: number) => Point;
};

function frameFor(width: number, height: number, lite: boolean): Frame {
  const mobile = lite || width < 760;
  const stage = mobile ? Math.min(height, 760) : height;
  const z0 = mobile ? 1.08 : 1.15;
  const z1 = mobile ? 3.15 : 3.55;
  const focal = stage * (mobile ? 0.72 : 0.78);
  const vpX = width * (mobile ? 0.56 : 0.5);
  const vpY = stage * (mobile ? 0.14 : 0.2);
  return {
    width,
    height,
    mobile,
    project(u, t) {
      const z = z0 + t * (z1 - z0);
      const y = vpY + focal / z;
      const half = (width * (mobile ? 0.62 : 0.42) * z0) / z;
      return { x: vpX + u * half, y };
    },
  };
}

function polygon(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
}

function strokeCourtLine(
  ctx: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  width: number,
) {
  ctx.save();
  ctx.strokeStyle = "rgba(150, 220, 255, 0.35)";
  ctx.lineWidth = width + 1.6;
  ctx.shadowColor = "rgba(120, 200, 255, 0.85)";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(244, 251, 255, 0.92)";
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.restore();
}

function drawStands(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { width, height, mobile, project } = frame;
  const far = project(0, 1);
  const farHalf = project(1, 1).x - far.x;
  ctx.save();
  const bowl = ctx.createRadialGradient(far.x, far.y, farHalf * 0.2, far.x, far.y - height * 0.08, width * 0.55);
  bowl.addColorStop(0, "rgba(18, 28, 44, 0.55)");
  bowl.addColorStop(0.45, "rgba(8, 12, 20, 0.35)");
  bowl.addColorStop(1, "rgba(4, 6, 10, 0)");
  ctx.fillStyle = bowl;
  ctx.fillRect(0, 0, width, height);

  const rows = mobile ? 7 : 11;
  for (let row = 0; row < rows; row += 1) {
    const y = far.y - 6 - row * (mobile ? 8 : 11);
    const rx = farHalf * 1.05 + row * (mobile ? 16 : 28);
    const ry = 6 + row * 0.35;
    ctx.beginPath();
    ctx.ellipse(far.x, y, rx, ry, 0, Math.PI * 0.92, Math.PI * 2.08);
    ctx.strokeStyle = row % 2 === 0 ? "rgba(36, 50, 72, 0.95)" : "rgba(16, 24, 38, 0.95)";
    ctx.lineWidth = mobile ? 6 : 9;
    ctx.stroke();
    ctx.strokeStyle = "rgba(70, 96, 128, 0.28)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (const side of [-1, 1]) {
    for (let row = 0; row < (mobile ? 4 : 6); row += 1) {
      ctx.beginPath();
      for (let step = 4; step <= 10; step += 1) {
        const point = project(side * (1.08 + row * 0.07), step / 10);
        const y = point.y - row * (mobile ? 4 : 6);
        if (step === 0) ctx.moveTo(point.x, y);
        else ctx.lineTo(point.x, y);
      }
      ctx.strokeStyle = "rgba(28, 40, 58, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawCourt(ctx: CanvasRenderingContext2D, frame: Frame) {
  const { project } = frame;
  const corner = (u: number, t: number) => project(u, t);
  const apron = [corner(-1.45, 0), corner(1.45, 0), corner(1.45, 1), corner(-1.45, 1)];
  ctx.fillStyle = "#070b12";
  polygon(ctx, apron);
  ctx.fill();

  const surface = [corner(-1, 0), corner(1, 0), corner(1, 1), corner(-1, 1)];
  const near = project(0, 0);
  const far = project(0, 1);
  const surfacePaint = ctx.createLinearGradient(near.x, near.y, far.x, far.y);
  surfacePaint.addColorStop(0, "#08203f");
  surfacePaint.addColorStop(1, "#061428");
  ctx.fillStyle = surfacePaint;
  polygon(ctx, surface);
  ctx.fill();

  const singles = 8.23 / 10.97;
  const serviceNear = 0.5 - 6.4 / 23.77;
  const serviceFar = 0.5 + 6.4 / 23.77;
  const boundary: Array<[number, number, number, number]> = [
    [-1, 0, 1, 0],
    [-1, 1, 1, 1],
    [-1, 0, -1, 1],
    [1, 0, 1, 1],
    [-singles, 0, -singles, 1],
    [singles, 0, singles, 1],
    [-singles, serviceNear, singles, serviceNear],
    [-singles, serviceFar, singles, serviceFar],
    [0, serviceNear, 0, serviceFar],
    [0, 0.02, 0, 0.07],
    [0, 0.93, 0, 0.98],
  ];
  for (const [u0, t0, u1, t1] of boundary) {
    const a = project(u0, t0);
    const b = project(u1, t1);
    const scale = 1.15 - ((t0 + t1) / 2) * 0.55;
    strokeCourtLine(ctx, a, b, Math.max(0.7, scale));
  }

  const left = project(-1.04, 0.5);
  const right = project(1.04, 0.5);
  const netHeight = frame.mobile ? 12 : 16;
  ctx.save();
  ctx.strokeStyle = "rgba(214, 230, 242, 0.28)";
  ctx.lineWidth = 1;
  const steps = 18;
  for (let index = 0; index <= steps; index += 1) {
    const x = left.x + ((right.x - left.x) * index) / steps;
    const y = left.y + ((right.y - left.y) * index) / steps;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - netHeight);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(244, 251, 255, 0.8)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(left.x, left.y - netHeight);
  ctx.lineTo(right.x, right.y - netHeight);
  ctx.stroke();
  ctx.restore();
}

function drawBeams(ctx: CanvasRenderingContext2D, frame: Frame, time: number) {
  const { width, height, mobile } = frame;
  const beams = mobile
    ? [
        { x: 0.22, rgb: "244, 246, 255", fixture: "#f7f8ff", glow: "rgba(255,255,255,0.85)", tilt: -0.04, phase: 0.2, travel: 0.55 },
        { x: 0.5, rgb: "255, 132, 28", fixture: "#ffb15a", glow: "rgba(255,140,40,0.9)", tilt: 0.02, phase: 2.3, travel: 0.62 },
        { x: 0.78, rgb: "186, 96, 255", fixture: "#e4c2ff", glow: "rgba(180,90,255,0.9)", tilt: 0.05, phase: 4.2, travel: 0.55 },
      ]
    : [
        { x: 0.16, rgb: "244, 246, 255", fixture: "#f7f8ff", glow: "rgba(255,255,255,0.9)", tilt: -0.18, phase: 0.3, travel: 0.72 },
        { x: 0.38, rgb: "255, 128, 24", fixture: "#ffb15a", glow: "rgba(255,140,40,0.9)", tilt: -0.02, phase: 2.6, travel: 0.8 },
        { x: 0.62, rgb: "176, 84, 255", fixture: "#e4c2ff", glow: "rgba(176,90,255,0.9)", tilt: 0.04, phase: 4.5, travel: 0.76 },
        { x: 0.84, rgb: "255, 248, 240", fixture: "#fffaf4", glow: "rgba(255,255,255,0.85)", tilt: 0.18, phase: 1.2, travel: 0.64 },
      ];
  const length = height * (mobile ? 0.36 : 0.6);
  const spread = mobile ? 46 : 100;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const beam of beams) {
    const sweep = Math.sin(time / 1100 + beam.phase) * beam.travel;
    const white = beam.rgb.startsWith("244") || beam.rgb.startsWith("255, 248");
    const layers = mobile ? 5 : 7;
    ctx.save();
    ctx.translate(width * beam.x, height * 0.05);
    ctx.rotate(beam.tilt + sweep);
    for (let layer = layers; layer >= 1; layer -= 1) {
      const t = layer / layers;
      const strength = (white ? 0.1 : 0.16) * t * t * (mobile ? 0.85 : 1);
      const paint = ctx.createLinearGradient(0, 0, 0, length);
      paint.addColorStop(0, `rgba(${beam.rgb}, ${strength})`);
      paint.addColorStop(0.32, `rgba(${beam.rgb}, ${strength * 0.32})`);
      paint.addColorStop(1, `rgba(${beam.rgb}, 0)`);
      ctx.fillStyle = paint;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo((-spread * t) / 2, length);
      ctx.lineTo((spread * t) / 2, length);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = beam.fixture;
    ctx.shadowColor = beam.glow;
    ctx.shadowBlur = mobile ? 8 : 14;
    ctx.fillRect(width * beam.x - 9, height * 0.046, 18, 4);
  }
  ctx.restore();
}

function paint(ctx: CanvasRenderingContext2D, width: number, height: number, lite: boolean, time: number) {
  const frame = frameFor(width, height, lite);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#04060b";
  ctx.fillRect(0, 0, width, height);
  const ambient = ctx.createRadialGradient(width * 0.5, height * 0.28, 20, width * 0.5, height * 0.35, width * 0.48);
  ambient.addColorStop(0, "rgba(28, 58, 96, 0.28)");
  ambient.addColorStop(1, "rgba(4, 6, 11, 0)");
  ctx.fillStyle = ambient;
  ctx.fillRect(0, 0, width, height);
  drawStands(ctx, frame);
  drawCourt(ctx, frame);
  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.45, width * 0.2, width * 0.5, height * 0.5, width * 0.72);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.38)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  drawBeams(ctx, frame, time);
}

export function CourtScene({ lite, playing }: { lite: boolean; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    const draw = (time: number) => {
      const bounds = parent.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(context, width, height, lite, playing ? time : 0);
    };
    const resize = () => draw(0);
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    const loop = (time: number) => {
      draw(time);
      if (playing) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [lite, playing]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
