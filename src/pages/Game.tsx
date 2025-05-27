import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const START_POSITION: THREE.Vector3Tuple = [-3, 0.5, 0];
const GOAL_POSITION: THREE.Vector3Tuple = [21, 0.5, 0];
const GOAL_RADIUS = 1;

type Wall = {
  position: THREE.Vector3Tuple;
  size: THREE.Vector3Tuple;
};

const Particles = ({ position }: { position: THREE.Vector3Tuple }) => {
  const count = 100;
  const particles = useRef<THREE.Points>(null!);

  const positions = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 2);

  useEffect(() => {
    const geometry = particles.current.geometry as THREE.BufferGeometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, []);

  useFrame(() => {
    const geometry = particles.current.geometry as THREE.BufferGeometry;
    const positionsAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < count * 3; i += 3) {
      positionsAttr.array[i + 1] += 0.05; 
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={particles} position={position}>
      <bufferGeometry />
      <pointsMaterial color="white" size={0.2} />
    </points>
  );
};

const Player = forwardRef(
  (
    {
      position,
      walls,
      onWin,
      onLose,
    }: {
      position: THREE.Vector3Tuple;
      walls: Wall[];
      onWin: () => void;
      onLose: () => void;
    },
    ref: React.Ref<THREE.Mesh>
  ) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const velocity = useRef(new THREE.Vector3());
    const keys = useRef({
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    });

    const speed = 0.15;
    const playerSize = 1;

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key in keys.current) {
          keys.current[e.key as keyof typeof keys.current] = true;
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key in keys.current) {
          keys.current[e.key as keyof typeof keys.current] = false;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    const checkCollision = (nextPos: THREE.Vector3): boolean => {
      const playerBox = new THREE.Box3(
        new THREE.Vector3().copy(nextPos).subScalar(playerSize / 2),
        new THREE.Vector3().copy(nextPos).addScalar(playerSize / 2)
      );

      return walls.some(wall => {
        const wallBox = new THREE.Box3(
          new THREE.Vector3().fromArray(wall.position).sub(new THREE.Vector3().fromArray(wall.size).multiplyScalar(0.5)),
          new THREE.Vector3().fromArray(wall.position).add(new THREE.Vector3().fromArray(wall.size).multiplyScalar(0.5))
        );
        return playerBox.intersectsBox(wallBox);
      });
    };

    const checkGoal = (pos: THREE.Vector3): boolean => {
      const goal = new THREE.Vector3(...GOAL_POSITION);
      return pos.distanceTo(goal) < GOAL_RADIUS;
    };

    useFrame(() => {
      const mesh = meshRef.current;
      velocity.current.set(0, 0, 0);

      if (keys.current.ArrowUp) velocity.current.z = -speed;
      if (keys.current.ArrowDown) velocity.current.z = speed;
      if (keys.current.ArrowLeft) velocity.current.x = -speed;
      if (keys.current.ArrowRight) velocity.current.x = speed;

      const nextPos = new THREE.Vector3().copy(mesh.position).add(velocity.current);

      if (checkGoal(nextPos)) {
        onWin();
      } else if (checkCollision(nextPos)) {
        onLose();
      } else {
        mesh.position.copy(nextPos);
      }
    });

    useEffect(() => {
      if (typeof ref === 'function') {
        ref(meshRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<THREE.Mesh>).current = meshRef.current;
      }
    }, [ref]);

    return (
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[playerSize, playerSize, playerSize]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }
);

const Maze = ({ walls }: { walls: Wall[] }) => (
  <>
    {walls.map((wall, index) => (
      <mesh key={`wall-${index}`} position={wall.position}>
        <boxGeometry args={wall.size} />
        <meshStandardMaterial color="gray" />
      </mesh>
    ))}
  </>
);

const CameraController = ({ targetRef }: { targetRef: React.RefObject<THREE.Object3D> }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (!targetRef.current) return;

    const targetPos = targetRef.current.position.clone();
    const cameraOffset = new THREE.Vector3(0, 10, 10); 
    const desiredPosition = targetPos.clone().add(cameraOffset);

    camera.position.lerp(desiredPosition, 0.1);
    camera.lookAt(targetPos);
  });

  return null;
};


const Game = () => {
  const playerRef = useRef<THREE.Mesh>(null!);
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [particlePos, setParticlePos] = useState<THREE.Vector3Tuple | null>(null);

  const walls: Wall[] = [
    { position: [7.5, 0, -5], size: [30, 1, 1] },
    { position: [7.5, 0, 5], size: [30, 1, 1] },
    { position: [-7, 0, 0], size: [1, 1, 10] },
    { position: [22, 0, 0], size: [1, 1, 10] },
    { position: [0, 0, 0], size: [1, 1, 4] },
    { position: [3, 0, -3], size: [1, 1, 4] },
    { position: [6, 0, 3], size: [1, 1, 5] },
    { position: [9, 0, -2], size: [1, 1, 4] },
    { position: [12, 0, 2], size: [1, 1, 4] },
    { position: [15, 0, 0], size: [1, 1, 6] },
    { position: [18, 0, -3], size: [1, 1, 4] },
  ];

  const handleReset = () => {
    setResult(null);
    setParticlePos(null);
    if (playerRef.current) {
      playerRef.current.position.set(...START_POSITION);
    }
  };

  const handleWin = () => {
    setParticlePos([GOAL_POSITION[0], 1, GOAL_POSITION[2]]);
    setResult('win');
    setTimeout(handleReset, 2000);
  };

  const handleLose = () => {
    if (playerRef.current) {
      const pos = playerRef.current.position;
      setParticlePos([pos.x, pos.y, pos.z]);
    }
    setResult('lose');
    setTimeout(handleReset, 2000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {!gameStarted && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px' }}>
          <h1>Laberinto 3D</h1>
          <p>Usa las flechas del teclado para moverte</p>
          <button onClick={() => setGameStarted(true)} style={{ padding: '10px 20px', fontSize: '18px', background: 'hotpink', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Comenzar
          </button>
        </div>
      )}

      <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Player ref={playerRef} position={START_POSITION} walls={walls} onWin={handleWin} onLose={handleLose} />
        <Maze walls={walls} />
        <CameraController targetRef={playerRef} />
        <mesh position={[7.5, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 10]} />
          <meshStandardMaterial color="darkgreen" />
        </mesh>
        <mesh position={GOAL_POSITION}>
          <sphereGeometry args={[GOAL_RADIUS, 16, 16]} />
          <meshStandardMaterial color="gold" />
        </mesh>
        {particlePos && <Particles position={particlePos} />}
      </Canvas>

      {result && (
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 10, fontSize: '24px', color: result === 'win' ? 'lime' : 'red' }}>
          {result === 'win' ? '¡Ganaste!' : '¡Perdiste!'}
        </div>
      )}

      {gameStarted && (
        <button onClick={handleReset} style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', zIndex: 10, background: 'hotpink', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Reiniciar
        </button>
      )}
    </div>
  );
};

export default Game;
