import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

const Header = () => (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
        <Navbar.Brand as={Link} to="/">Modelos 3D</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
            <Nav className="me-auto">
            <Nav.Link as={Link} to="/personaje1">Personaje 1</Nav.Link>
            <Nav.Link as={Link} to="/personaje2">Personaje 2</Nav.Link>
            <Nav.Link as={Link} to="/personaje3">Personaje 3</Nav.Link>
            <Nav.Link as={Link} to="/juego">Juego</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
)

export default Header
