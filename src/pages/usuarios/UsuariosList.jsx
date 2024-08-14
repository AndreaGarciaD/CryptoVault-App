import { useEffect, useState } from "react";
import MenuAdmin from "../../components/MenuAdmin";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { getUsuarioList } from "../../services/UsuarioService";
import { Link } from "react-router-dom";


const UsuariosList = () => {
    const [usuariosList, setUsuariosList] = useState([]);

    useEffect(() => {
        fetchListaUsuarios();
    }, []);

    const fetchListaUsuarios = () => {
        getUsuarioList().then((res) => {
            setUsuariosList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de usuarios:', error);
        });
    }

    return (
        <>
            <MenuAdmin />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Usuarios</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Nombre</th>
                                            <th>Billeteras</th>
                                            <th>Movimientos</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosList.map((usuario) =>
                                            <tr key={"usuario-" + usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.nombre}</td>
                                                <td>
                                                    <Link to={`/usuarios/billeteras/${usuario.id}`}>
                                                        <Button variant="warning">Ver billeteras</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/usuarios/movimientos/${usuario.id}`}>
                                                        <Button variant="warning">Ver movimientos</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default UsuariosList;
