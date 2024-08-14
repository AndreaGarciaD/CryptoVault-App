import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const MenuUsuario = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [usuario, setUsuario] = useState(null)
    const cerrarSesionClicked = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username')

        navigate('/login');
    }
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
                        {token ? <>
                            <NavDropdown title="Mis Billeteras" id="basic-nav-dropdown">
                                <NavLink end className={"dropdown-item"} to="/billeteras/crear" >Crear Billetera</NavLink>
                                <NavLink end className={"dropdown-item"} to="/billeteras">
                                    Ver Billeteras
                                </NavLink>
                            </NavDropdown>
                            <NavDropdown title="Mis ventas" id="basic-nav-dropdown">
                                <NavLink end className={"dropdown-item"} to="/misventas" >Ver mis ventas</NavLink>
                            </NavDropdown>
                            <NavLink className={"nav-link"} to="/ventas/disponibles/">Comprar</NavLink>
                            <NavLink className={"nav-link"}>{usuario && <>{usuario.nombre} </>}</NavLink>
                            <button onClick={cerrarSesionClicked} className="btn btn-link nav-link">Cerrar sesión</button>
                        </> : <>
                            <NavLink end className={"nav-link"} to="/login">Iniciar sesión</NavLink>
                            <NavLink end className={"nav-link"} to="/register">Registrarse</NavLink>
                        </>}

                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
    );
}

export default MenuUsuario;