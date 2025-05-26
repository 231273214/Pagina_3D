import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const START_POSITION: THREE.Vector3Tuple = [-3, 0.5, 0];

type Wall = {
    position: THREE.Vector3Tuple;
    size: [number, number, number];
};

// === Componente del Jugador ===
const Player = forwardRef(({ position, walls }: { position: THREE.Vector3Tuple; walls: Wall[] }, ref: React.Ref<THREE.Mesh>) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const keys = useRef<Record<string, boolean>>({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    });

    const speed = 0.1;
    const [playerPosition, setPlayerPosition] = useState<THREE.Vector3Tuple>(position);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (keys.current[e.key] !== undefined) keys.current[e.key] = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (keys.current[e.key] !== undefined) keys.current[e.key] = false;
        };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
}, []);

    const checkCollision = (nextPos: THREE.Vector3): boolean => {
        for (const wall of walls) {
        const wallMin = new THREE.Vector3(
            wall.position[0] - wall.size[0] / 2,
            wall.position[1] - wall.size[1] / 2,
            wall.position[2] - wall.size[2] / 2
        );
        const wallMax = new THREE.Vector3(
            wall.position[0] + wall.size[0] / 2,
            wall.position[1] + wall.size[1] / 2,
            wall.position[2] + wall.size[2] / 2
        );

        const playerMin = nextPos.clone().addScalar(-0.5);
        const playerMax = nextPos.clone().addScalar(0.5);

        if (
            playerMin.x <= wallMax.x &&
            playerMax.x >= wallMin.x &&
            playerMin.y <= wallMax.y &&
            playerMax.y >= wallMin.y &&
            playerMin.z <= wallMax.z &&
            playerMax.z >= wallMin.z
        ) {
            return true;
        }
        }
        return false;
    };

    useFrame(() => {
        const mesh = meshRef.current;
        const nextPos = mesh.position.clone();

        if (keys.current.ArrowUp) nextPos.z -= speed;
        if (keys.current.ArrowDown) nextPos.z += speed;
        if (keys.current.ArrowLeft) nextPos.x -= speed;
        if (keys.current.ArrowRight) nextPos.x += speed;

        if (checkCollision(nextPos)) {
        // Colisión: volver al inicio
        mesh.position.set(...START_POSITION);
        setPlayerPosition(START_POSITION);
        } else {
        mesh.position.copy(nextPos);
        setPlayerPosition([nextPos.x, nextPos.y, nextPos.z]);
        }
    });

    useEffect(() => {
        if (typeof ref === 'function') ref(meshRef.current);
        else if (ref) (ref as React.MutableRefObject<THREE.Mesh>).current = meshRef.current;
    }, [ref]);

    return (
        <mesh ref={meshRef} position={playerPosition}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
        </mesh>
    );
});

// === Componente Laberinto ===
const Laberinto = ({ paredes }: { paredes: Wall[] }) => {
    return (
        <>
        {paredes.map((pared, index) => (
            <mesh key={index} position={pared.position}>
            <boxGeometry args={pared.size} />
            <meshStandardMaterial color="gray" />
            </mesh>
        ))}
        </>
    );
};

// === Cámara que sigue al jugador ===
const CameraController = ({ targetRef }: { targetRef: React.RefObject<THREE.Mesh> }) => {
    useFrame(({ camera }) => {
        const target = targetRef.current;
        if (target) {
        const targetPos = target.position.clone();
        camera.position.lerp(
            new THREE.Vector3(targetPos.x, targetPos.y + 5, targetPos.z + 10),
            0.1
        );
        camera.lookAt(targetPos);
        }
    });

    return null;
};

// === Juego principal ===
const LaberintoGame = () => {
    const playerRef = useRef<THREE.Mesh>(null!);

const paredes: Wall[] = [
    // Bordes horizontales
    { position: [7.5, 0, -5], size: [30, 1, 1] },
    { position: [7.5, 0, 5], size: [30, 1, 1] },

    // Bordes verticales
    { position: [-7, 0, 0], size: [1, 1, 10] },
    { position: [22, 0, 0], size: [1, 1, 10] },

    // Obstáculos internos (más largo a la derecha)
    { position: [0, 0, 0], size: [1, 1, 4] },
    { position: [3, 0, -3], size: [1, 1, 4] },
    { position: [6, 0, 3], size: [1, 1, 6] },
    { position: [9, 0, -2], size: [1, 1, 4] },
    { position: [12, 0, 2], size: [1, 1, 4] },
    { position: [15, 0, 0], size: [1, 1, 6] },
    { position: [18, 0, -3], size: [1, 1, 4] },
];

return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Player ref={playerRef} position={START_POSITION} walls={paredes} />
            <Laberinto paredes={paredes} />
            <CameraController targetRef={playerRef} />
        </Canvas>
        </div>
    );
};

export default LaberintoGame;