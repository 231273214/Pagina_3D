import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const Personaje_2 = () => {
    const mountRef = useRef<HTMLDivElement | null>(null)
    const [soundRef, setSoundRef] = useState<THREE.Audio | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const requestRef = useRef<number>(0)

    useEffect(() => {
        if (!mountRef.current) return

        // Eliminar canvas duplicado si ya existe
        while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild)
        }

    // Escena, cámara, renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 10, 30)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1.5, 4)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(3, 5, 2)
    scene.add(dirLight)

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 3
    controls.maxDistance = 6
    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 1.8
    controls.autoRotate = false

    // Audio
    const listener = new THREE.AudioListener()
    camera.add(listener)
    const sound = new THREE.Audio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load("/sounds/Stronger-Than-You.ogg", (buffer) => {
        sound.setBuffer(buffer)
        sound.setLoop(true)
        sound.setVolume(1.5)
        setSoundRef(sound)
    })

    // Modelo GLTF
    const loader = new GLTFLoader()
    loader.load(
        "/models/Garnet.glb",
        (gltf) => {
            const model = gltf.scene
            model.scale.set(1.5, 1.5, 1.5)
            model.position.set(0, -1, 0)
            scene.add(model)
        },
        undefined,
        (error) => {
            console.error("Error al cargar modelo:", error)
        }
    )

    // Partículas
    const particleCount = 300
    const particlesGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.7,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Animación
    const animate = () => {
        controls.update() 

      // Movimiento vertical de partículas
        const pos = particles.geometry.attributes.position as THREE.BufferAttribute
        for (let i = 1; i < pos.count * 3; i += 3) {
            pos.array[i] += 0.002
            if (pos.array[i] > 10) pos.array[i] = -10
        }
        pos.needsUpdate = true

        renderer.render(scene, camera)
        requestRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
        return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current)
        renderer.dispose()
        controls.dispose()
        while (mountRef.current?.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild)
        }
        }
    }, [])

    const handlePlay = () => {
        if (soundRef && !soundRef.isPlaying) {
        soundRef.play()
        setIsPlaying(true)
        }
    }

    const handlePause = () => {
        if (soundRef && soundRef.isPlaying) {
        soundRef.pause()
        setIsPlaying(false)
        }
    }

    return (
        <div>
        <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
        <div
            style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            display: "flex",
            gap: "10px",
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "10px",
            borderRadius: "10px"
            }}
        >
            <button onClick={handlePlay} disabled={isPlaying}>
            ▶️ Play
            </button>
            <button onClick={handlePause} disabled={!isPlaying}>
            ⏸️ Pause
            </button>
        </div>
        </div>
    )
}

export default Personaje_2
