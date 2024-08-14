import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Menu = () => {
    const token = localStorage.getItem('token');
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        if (usuario) {
            return;
        }
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const getUserInfo = () => {
        axios.get('http://localhost:3000/api/me', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            setUsuario(res.data);
        });
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="md">
            <Container>
                <Navbar.Brand href="#home">CryptoVault</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink end className={"nav-link"} to="/login">Iniciar sesión</NavLink>
                        <NavLink end className={"nav-link"} to="/register">Registrarse</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
    );
}

export default Menu;