import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Character1 from './pages/Personaje_1'
import Character2 from './pages/Personaje_2'
import Character3 from './pages/Personaje_3'
import Game from './pages/Game'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Header />
      <main style={{ overflowX: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personaje1" element={<Character1 />} />
          <Route path="/personaje2" element={<Character2 />} />
          <Route path="/personaje3" element={<Character3 />} />
          <Route path="/juego" element={<Game />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
