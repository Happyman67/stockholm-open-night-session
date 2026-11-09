"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LENGTH = 23.77;
const DOUBLES_W = 10.97;
const SINGLES_W = 8.23;
const SERVICE = 6.4;
const HALF_L = LENGTH / 2;
const HALF_DW = DOUBLES_W / 2;
const HALF_SW = SINGLES_W / 2;

function GlowLine({
  position,
  size,
  color = "#9aefff",
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  const wide: [number, number, number] = [
    size[0] > size[2] ? size[0] : size[0] * 2.4,
    0.012,
    size[2] > size[0] ? size[2] : size[2] * 2.4,
  ];
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#f7fdff"
          emissive={color}
          emissiveIntensity={3.2}
          roughness={0.25}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={wide} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function netTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, 256, 128);
  context.strokeStyle = "rgba(226, 244, 255, 0.72)";
  context.lineWidth = 1.2;
  for (let x = 0; x <= 256; x += 8) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 128);
    context.stroke();
  }
  for (let y = 0; y <= 128; y += 8) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(256, y);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Court() {
  const net = useMemo(() => netTexture(), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial color="#05070c" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[DOUBLES_W + 0.04, LENGTH + 0.04]} />
        <meshStandardMaterial
          color="#071833"
          emissive="#06122e"
          emissiveIntensity={0.35}
          roughness={0.62}
          metalness={0.04}
        />
      </mesh>
      <GlowLine position={[0, 0.03, HALF_L]} size={[DOUBLES_W, 0.02, 0.07]} />
      <GlowLine position={[0, 0.03, -HALF_L]} size={[DOUBLES_W, 0.02, 0.07]} />
      <GlowLine position={[-HALF_DW, 0.03, 0]} size={[0.07, 0.02, LENGTH]} />
      <GlowLine position={[HALF_DW, 0.03, 0]} size={[0.07, 0.02, LENGTH]} />
      <GlowLine position={[-HALF_SW, 0.03, 0]} size={[0.05, 0.018, LENGTH]} color="#d7f6ff" />
      <GlowLine position={[HALF_SW, 0.03, 0]} size={[0.05, 0.018, LENGTH]} color="#d7f6ff" />
      <GlowLine position={[0, 0.03, SERVICE]} size={[SINGLES_W, 0.016, 0.05]} />
      <GlowLine position={[0, 0.03, -SERVICE]} size={[SINGLES_W, 0.016, 0.05]} />
      <GlowLine position={[0, 0.03, 0]} size={[0.045, 0.016, SERVICE * 2]} />
      <GlowLine position={[0, 0.03, HALF_L - 0.28]} size={[0.045, 0.016, 0.36]} />
      <GlowLine position={[0, 0.03, -HALF_L + 0.28]} size={[0.045, 0.016, 0.36]} />

      <mesh position={[0, 0.48, 0]}>
        <planeGeometry args={[DOUBLES_W + 0.55, 0.92]} />
        <meshBasicMaterial
          map={net ?? undefined}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
          color="#d5e7f2"
        />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <boxGeometry args={[DOUBLES_W + 0.7, 0.035, 0.035]} />
        <meshStandardMaterial color="#f4fbff" emissive="#bfefff" emissiveIntensity={0.6} />
      </mesh>
      {[-HALF_DW - 0.28, HALF_DW + 0.28].map((x) => (
        <mesh key={x} position={[x, 0.52, 0]}>
          <boxGeometry args={[0.06, 1.07, 0.06]} />
          <meshStandardMaterial color="#d5dde6" roughness={0.45} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Seats({ lite }: { lite: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = lite ? 720 : 1680;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    if (!mesh.instanceColor) {
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    }
    const rows = lite ? 8 : 12;
    const perRow = Math.floor(count / rows);
    let index = 0;
    for (let row = 0; row < rows && index < count; row += 1) {
      const y = 0.55 + row * 0.46;
      for (let seat = 0; seat < perRow && index < count; seat += 1) {
        const t = seat / Math.max(perRow - 1, 1);
        const theta = -2.15 + t * 4.3;
        const radius = 14.2 + row * 0.72;
        const x = Math.sin(theta) * radius;
        const z = -12.4 - Math.cos(theta) * (1.4 + row * 0.28);
        dummy.position.set(x, y, z);
        dummy.lookAt(0, 0.2, -2);
        dummy.rotateX(-0.55);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        const mix = (seat + row) % 5;
        color.set(mix === 0 ? "#243044" : mix === 1 ? "#121820" : "#1a2230");
        mesh.instanceColor.setXYZ(index, color.r, color.g, color.b);
        index += 1;
      }
    }
    mesh.count = index;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;
  }, [count, lite]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.42, 0.18, 0.34]} />
      <meshStandardMaterial roughness={0.9} metalness={0.05} />
    </instancedMesh>
  );
}

function Bowl() {
  return (
    <group>
      <mesh position={[0, 7.5, -10]} rotation={[0.08, 0, 0]}>
        <cylinderGeometry args={[34, 28, 18, 64, 1, true, 0.35, Math.PI * 1.35]} />
        <meshStandardMaterial color="#070910" side={THREE.BackSide} roughness={1} />
      </mesh>
      <mesh position={[0, 16.2, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 36]} />
        <meshStandardMaterial color="#05060a" roughness={1} />
      </mesh>
      {[-4.2, 0, 4.2].map((x) => (
        <mesh key={x} position={[x, 13.6, -1]}>
          <boxGeometry args={[0.08, 0.08, 22]} />
          <meshStandardMaterial color="#2c3340" metalness={0.72} roughness={0.28} />
        </mesh>
      ))}
      <mesh position={[0, 13.6, -1]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 0.08, 12]} />
        <meshStandardMaterial color="#2c3340" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
  );
}

const RIGS = [
  { color: "#7ee7ff", position: [-5.4, 10.4, 3.2] as [number, number, number], intensity: 14000, phase: 0.2 },
  { color: "#4aa3ff", position: [5.6, 10.8, 0.4] as [number, number, number], intensity: 11000, phase: 1.3 },
  { color: "#ffb15e", position: [-1.8, 11.2, -5.5] as [number, number, number], intensity: 9000, phase: 2.1 },
  { color: "#f4fbff", position: [1.4, 11.4, 5.2] as [number, number, number], intensity: 7000, phase: 0.7 },
  { color: "#a99bff", position: [4.2, 10.2, -7.6] as [number, number, number], intensity: 4200, phase: 2.7 },
];

function SpotRig({
  color,
  position,
  intensity,
  phase,
  playing,
}: {
  color: string;
  position: [number, number, number];
  intensity: number;
  phase: number;
  playing: boolean;
}) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);
  const cone = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = playing ? clock.getElapsedTime() : 0;
    const x = Math.sin(t * 0.16 + phase) * 3.6;
    const z = -1.5 + Math.cos(t * 0.11 + phase) * 5.2;
    if (target.current) target.current.position.set(x, 0.05, z);
    if (light.current && target.current) {
      light.current.target = target.current;
      target.current.updateMatrixWorld();
    }
    if (cone.current) {
      cone.current.rotation.z = Math.sin(t * 0.16 + phase) * 0.16;
      cone.current.rotation.x = 0.08 + Math.cos(t * 0.11 + phase) * 0.1;
    }
  });
  return (
    <group>
      <object3D ref={target} position={[0, 0.05, -2]} />
      <spotLight
        ref={light}
        position={position}
        color={color}
        intensity={intensity}
        angle={0.42}
        penumbra={0.72}
        distance={0}
        decay={2}
      />
      <group position={position}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.46, 0.28, 20]} />
          <meshStandardMaterial color="#161b24" metalness={0.7} roughness={0.32} />
        </mesh>
        <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.28, 20]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <group ref={cone} position={[0, -5.2, 0]}>
          <mesh>
            <coneGeometry args={[2.2, 10.2, 24, 1, true]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.09}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <coneGeometry args={[0.72, 10.2, 16, 1, true]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.16}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Rig({ drift }: { drift: boolean }) {
  useFrame(({ camera, clock }) => {
    const t = drift ? clock.getElapsedTime() : 0;
    camera.position.x = Math.sin(t * 0.07) * 0.42;
    camera.position.y = 7.4 + Math.sin(t * 0.05) * 0.06;
    camera.position.z = 15.6;
    camera.lookAt(0, 0.15, -2.4);
  });
  return null;
}

function DemandFrame({ playing }: { playing: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    invalidate();
  }, [invalidate, playing]);
  return null;
}

export function CourtScene({ lite, playing }: { lite: boolean; playing: boolean }) {
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.6]}
      frameloop={playing ? "always" : "demand"}
      camera={{ position: [0, 7.4, 15.6], fov: 40, near: 0.1, far: 90 }}
      gl={{ antialias: !lite, alpha: false, powerPreference: lite ? "low-power" : "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor("#05070c");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.22;
        camera.lookAt(0, 0.15, -2.4);
      }}
    >
      <fog attach="fog" args={["#05070c", 24, 70]} />
      <ambientLight intensity={0.18} color="#9eb4d4" />
      <DemandFrame playing={playing} />
      <Bowl />
      <Seats lite={lite} />
      <Court />
      {RIGS.slice(0, lite ? 4 : 5).map((rig) => (
        <SpotRig key={rig.color + rig.phase} {...rig} playing={playing && !lite ? playing : playing} />
      ))}
      <Rig drift={!lite && playing} />
    </Canvas>
  );
}
