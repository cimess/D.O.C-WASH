import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedBubble = ({ position, scale, speed, color }: { position: [number, number, number], scale: number, speed: number, color: string }) => {
  const ref = useRef<any>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(ref.current) {
        ref.current.position.y = position[1] + Math.sin(t * speed) * 0.5;
        ref.current.rotation.x = t * 0.2;
        ref.current.rotation.z = t * 0.1;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 32, 32]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-50">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00bfff" />
        
        {/* Abstract Bubbles representing cleaning foam/water */}
        <AnimatedBubble position={[-2, 1, 0]} scale={1.5} speed={0.5} color="#a5f3fc" />
        <AnimatedBubble position={[3, -1, -2]} scale={2} speed={0.3} color="#bae6fd" />
        <AnimatedBubble position={[-3, -3, -1]} scale={1.2} speed={0.6} color="#e0f2fe" />
        <AnimatedBubble position={[4, 2, -3]} scale={1.8} speed={0.4} color="#7dd3fc" />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;