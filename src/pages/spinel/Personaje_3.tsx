import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import '../../components/Personajes.css';

const Personaje_3 = () => {
    const mountRef = useRef<HTMLDivElement | null>(null)
    const [soundRef, setSoundRef] = useState<THREE.Audio | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const requestRef = useRef<number>(0)

    useEffect(() => {
    if (!mountRef.current) return

    while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild)
    }

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 10, 30)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 1.2, 4)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(3, 8, 2)
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
    audioLoader.load("/sounds/Drift-Away.ogg", (buffer) => {
        sound.setBuffer(buffer)
        sound.setLoop(true)
        sound.setVolume(0.5)
        setSoundRef(sound)
    })

    // Modelo GLB
    const loader = new GLTFLoader()
    loader.load(
        "/models/Spinel.glb",
        (gltf) => {
            const model = gltf.scene
            model.scale.set(1.5, 1.5, 1.5)
            model.position.set(0, -1.4 , 1) 
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
<div className="character-container">
    <div className="character-card-horizontal">
        <div ref={mountRef} className="character-viewer-card" />
        <div className="character-info">
        <h2 className="character-title">Spinel</h2>
        <p className="character-description">
            Spinel fue la antigua compañera de juego de Pink Diamond. Tras ser olvidada, regresa con un carácter explosivo y complejo. Su historia explora el abandono y la redención.
        </p>
        <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="music-button"
        >
            {isPlaying ? "PAUSAR MÚSICA" : "REPRODUCIR MÚSICA"}
        </button>
        </div>
    </div>
</div>

)
}
export default Personaje_3

