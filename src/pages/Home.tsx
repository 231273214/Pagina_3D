// Home.tsx
import { useState } from 'react';
import '../App.css';

const Home = () => {
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <div className="home-hero">
      <div className="home-overlay">
        <h1>Bienvenido a la Galería 3D</h1>
        <p>
          Sumérgete en una experiencia visual interactiva inspirada en Steven Universe.
          Recorre modelos animados en 3D, música, partículas y más.
        </p>

        <button className="info-button" onClick={() => setMostrarInfo(!mostrarInfo)}>
          {mostrarInfo ? 'Ocultar información' : 'Ver más sobre el proyecto'}
        </button>

        {mostrarInfo && (
          <div className="info-box">
            <h2>¿De qué trata esta web?</h2>
            <p>
              Este proyecto fue creado como una experiencia visual interactiva inspirada en el universo de <strong>Steven Universe</strong>.
              Explora una galería con personajes animados en 3D, sonidos, partículas flotantes y un minijuego final.
            </p>
            <p>
              Cada personaje está acompañado de una canción temática, un escenario y elementos visuales únicos.
            </p>
            <div className="character-cards">
            <div className="card" onClick={() => window.location.href = '/personaje1'}>
              <img src="/personage/ImgSteven.webp" alt="Steven" />
             <p>Steven</p>
             </div>
            <div className="card" onClick={() => window.location.href = '/personaje2'}>
               <img src="/personage/ImgGarnet.webp" alt="Garnet" />
             <p>Garnet</p>
             </div>
             <div className="card" onClick={() => window.location.href = '/personaje3'}>
              <img src="/personage/ImgSpinel.webp" alt="Spinel" />
             <p>Spinel</p>
             </div>
             </div>

            <h3>Librerías utilizadas:</h3>
            <ul>
              <li><strong>React:</strong> para construir la aplicación</li>
              <li><strong>Three.js:</strong> para renderizar los modelos 3D</li>
              <li><strong>Bootstrap:</strong> para el diseño responsivo</li>
              <li><strong>React Router:</strong> para la navegación entre secciones</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
