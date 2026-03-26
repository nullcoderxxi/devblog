import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingParticles() {
  const mesh = useRef();
  const count = 120;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.39, 0.40, 0.96], // indigo
      [0.06, 0.71, 0.76], // cyan
      [0.55, 0.22, 0.97], // purple
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.04;
    mesh.current.rotation.x = Math.sin(t * 0.02) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function FloatingCubes() {
  const group = useRef();
  const cubes = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      pos: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 - 2],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.15 + Math.random() * 0.25,
      speed: 0.3 + Math.random() * 0.5,
      color: ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981'][i % 4],
    })), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      child.rotation.x = t * cubes[i].speed * 0.5;
      child.rotation.y = t * cubes[i].speed;
      child.position.y = cubes[i].pos[1] + Math.sin(t * cubes[i].speed * 0.4 + i) * 0.3;
    });
  });

  return (
    <group ref={group}>
      {cubes.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={c.color} transparent opacity={0.25} wireframe />
        </mesh>
      ))}
    </group>
  );
}

export default function BlogHero() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true, antialias: false }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
        <FloatingParticles />
        <FloatingCubes />
      </Canvas>
    </div>
  );
}
