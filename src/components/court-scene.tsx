"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function feltTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#d7e45a";
  context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2200; i += 1) {
    context.fillStyle = i % 2 ? "rgba(255,255,255,0.05)" : "rgba(70,80,10,0.09)";
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 512;
    const y = (Math.sin(i * 78.233) * 24634.6345) % 512;
    context.fillRect(Math.abs(x), Math.abs(y), 2, 2);
  }
  context.strokeStyle = "rgba(255,255,255,0.9)";
  context.lineWidth = 8;
  context.lineCap = "round";
  context.beginPath();
  context.ellipse(256, 270, 150, 190, 0.55, 0.15, 2.2);
  context.stroke();
  context.beginPath();
  context.ellipse(250, 250, 160, 180, -0.7, 0.9, 2.9);
  context.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function netTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, 256, 64);
  context.strokeStyle = "rgba(236,242,246,0.8)";
  context.lineWidth = 1.4;
  for (let x = 0; x <= 256; x += 8) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 64);
    context.stroke();
  }
  for (let y = 0; y <= 64; y += 8) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(256, y);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Mark({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#dff8ff"
        emissive="#7ee7ff"
        emissiveIntensity={0.65}
        roughness={0.35}
      />
    </mesh>
  );
}

function Court() {
  const net = useMemo(() => netTexture(), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -0.4]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#05060a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.2]} receiveShadow>
        <planeGeometry args={[7.1, 12.6]} />
        <meshStandardMaterial
          color="#1566e0"
          emissive="#0a3f9e"
          emissiveIntensity={0.45}
          roughness={0.38}
          metalness={0.12}
        />
      </mesh>
      <Mark position={[0, 0.02, 6.05]} size={[6.7, 0.025, 0.045]} />
      <Mark position={[0, 0.02, -6.45]} size={[6.7, 0.025, 0.045]} />
      <Mark position={[-3.35, 0.02, -0.2]} size={[0.04, 0.025, 12.5]} />
      <Mark position={[3.35, 0.02, -0.2]} size={[0.04, 0.025, 12.5]} />
      <Mark position={[-2.45, 0.02, -0.2]} size={[0.03, 0.02, 12.5]} />
      <Mark position={[2.45, 0.02, -0.2]} size={[0.03, 0.02, 12.5]} />
      <Mark position={[0, 0.02, 3.15]} size={[4.9, 0.02, 0.035]} />
      <Mark position={[0, 0.02, -3.55]} size={[4.9, 0.02, 0.035]} />
      <Mark position={[0, 0.02, -0.2]} size={[0.03, 0.02, 6.7]} />
      <Mark position={[0, 0.02, 5.55]} size={[0.03, 0.02, 0.7]} />
      <Mark position={[0, 0.02, -5.95]} size={[0.03, 0.02, 0.7]} />
      <mesh position={[0, 0.42, -0.2]}>
        <planeGeometry args={[6.9, 0.72]} />
        <meshBasicMaterial
          map={net ?? undefined}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[7.05, 0.035, 0.035]} />
        <meshStandardMaterial color="#f4f7f8" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Ball({ lite }: { lite: boolean }) {
  const ball = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const felt = useMemo(() => feltTexture(), []);
  useFrame(({ clock }) => {
    const cycle = 5.6;
    const u = (clock.getElapsedTime() % cycle) / cycle;
    const z = lite ? 1.4 - u * 5.2 : 4.6 - u * 8.8;
    const x = Math.sin(u * Math.PI * 2) * 0.72;
    const hop = (u * 4) % 1;
    const height = Math.sin(hop * Math.PI);
    const y = 0.2 + height * height * (1.45 - u * 0.45);
    if (ball.current) {
      ball.current.position.set(x, y, z);
      ball.current.rotation.x = clock.getElapsedTime() * 5.5;
      ball.current.rotation.z = clock.getElapsedTime() * 1.8;
    }
    if (shadow.current) {
      shadow.current.position.set(x, 0.03, z);
      const scale = 1.05 - Math.min(y, 1.5) / 2.4;
      shadow.current.scale.setScalar(Math.max(scale, 0.35));
    }
  });
  return (
    <group>
      <mesh ref={ball}>
        <sphereGeometry args={[0.18, 42, 42]} />
        <meshStandardMaterial
          map={felt ?? undefined}
          color="#e6f06a"
          roughness={0.72}
          emissive="#c4922a"
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2]}>
        <circleGeometry args={[0.2, 24]} />
        <meshBasicMaterial color="#04101f" transparent opacity={0.38} depthWrite={false} />
      </mesh>
    </group>
  );
}

function unit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function Architecture({ lite }: { lite: boolean }) {
  const dust = useMemo(
    () =>
      Array.from({ length: lite ? 18 : 42 }, (_, index) => ({
        position: [
          (unit(index + 1) - 0.5) * 12,
          0.4 + unit(index + 40) * 4.6,
          -7 + unit(index + 80) * 12,
        ] as [number, number, number],
        scale: 0.012 + unit(index + 120) * 0.02,
        color: unit(index + 160) > 0.72 ? "#8eebff" : "#ffc27a",
      })),
    [lite],
  );
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.015;
  });
  return (
    <group>
      <mesh position={[0, 0.2, -7.1]}>
        <torusGeometry args={[3.55, 0.045, 16, 80, Math.PI]} />
        <meshStandardMaterial color="#d9fbff" emissive="#3ad4ff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0, 1.15, -6.3]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[6.4, 0.28, 12, 40, Math.PI]} />
        <meshStandardMaterial color="#6b4124" roughness={0.78} metalness={0.04} />
      </mesh>
      {[-2.2, 0, 2.2].map((x) => (
        <mesh key={x} position={[x, 4.7, -1.5]} rotation={[0.55, 0, 0]}>
          <boxGeometry args={[0.035, 0.035, 11]} />
          <meshStandardMaterial color="#242830" metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 3.85, -2.4]}>
        <boxGeometry args={[2.2, 0.62, 0.08]} />
        <meshStandardMaterial
          color="#0c1016"
          emissive="#123044"
          emissiveIntensity={0.55}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-1.5, 4.2, 1.2]} rotation={[0.15, 0.1, 0.15]}>
        <coneGeometry args={[1.5, 6.5, 20, 1, true]} />
        <meshBasicMaterial color="#e39a45" transparent opacity={0.045} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.4, 3.2, -1]} rotation={[0.4, -0.4, -0.5]}>
        <coneGeometry args={[1.1, 5.5, 16, 1, true]} />
        <meshBasicMaterial color="#67e7ff" transparent opacity={0.04} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={group}>
        {dust.map((speck, index) => (
          <mesh key={index} position={speck.position}>
            <sphereGeometry args={[speck.scale, 6, 6]} />
            <meshBasicMaterial color={speck.color} transparent opacity={0.55} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Rig({ drift }: { drift: boolean }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = drift ? Math.sin(t * 0.12) * 0.22 : 0;
    camera.position.y = 2.25 + (drift ? Math.sin(t * 0.08) * 0.04 : 0);
    camera.lookAt(0, 0.45, -0.8);
  });
  return null;
}

export function CourtScene({
  lite,
  playing,
}: {
  lite: boolean;
  playing: boolean;
}) {
  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.5]}
      frameloop={playing ? "always" : "never"}
      camera={{ position: [0, 2.25, 8.1], fov: 36, near: 0.1, far: 40 }}
      gl={{ antialias: !lite, alpha: false, powerPreference: lite ? "low-power" : "default" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#07080c");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
      }}
    >
      <fog attach="fog" args={["#07080c", 9, 22]} />
      <ambientLight intensity={0.55} color="#c5d8ff" />
      <spotLight
        position={[-2.2, 7.5, 3.2]}
        angle={0.62}
        penumbra={0.75}
        intensity={90}
        color="#ffb15e"
        distance={24}
      />
      <spotLight
        position={[4.2, 4.6, -1.5]}
        angle={0.7}
        penumbra={0.8}
        intensity={36}
        color="#7ee7ff"
        distance={20}
      />
      <pointLight position={[0, 1.4, 2.2]} intensity={6} color="#ffe0b0" distance={8} />
      <Court />
      <Ball lite={lite} />
      <Architecture lite={lite} />
      <Rig drift={!lite && playing} />
    </Canvas>
  );
}
