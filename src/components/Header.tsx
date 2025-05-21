import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import './Header.css' 

const Header = () => (
    <Navbar expand="lg" className="navbar-custom">
        <Container>
            <Navbar.Brand as={Link} to="/">Modelos 3D</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/personaje1">Steven Universe</Nav.Link>
                    <Nav.Link as={Link} to="/personaje2">Garnet</Nav.Link>
                    <Nav.Link as={Link} to="/personaje3">Personaje 3</Nav.Link>
                    <Nav.Link as={Link} to="/juego">Mini Juego</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
)

export default Header

