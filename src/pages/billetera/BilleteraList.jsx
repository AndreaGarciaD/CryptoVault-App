import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { deleteBilletera, getBilleterasByUsuario } from "../../services/BilleteraService";
import axios from "axios";
import MenuUsuario from "../../components/MenuUsuario";
import './BilleteraList.css'; // Archivo CSS para estilos personalizados

const BilleteraList = () => {
    const [billeteraList, setBilleteraList] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (usuario) {
            return;
        }
        getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (usuario) {
            fetchListaBilleteras(usuario.id);
        }
    }, [usuario]);

    const getUserInfo = () => {
        axios.get('http://localhost:3000/api/me', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            setUsuario(res.data);
        });
    }

    const fetchListaBilleteras = (id) => {
        getBilleterasByUsuario(id).then((res) => {
            setBilleteraList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de billeteras:', error);
        });
    }

    const removeBilletera = (billeteraId) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta billetera?');
        if (!confirmation) return;
        deleteBilletera(billeteraId).then(() => {
            fetchListaBilleteras(usuario.id);
        }).catch((error) => {
            console.error('Error al eliminar billetera:', error);
        });
    }

    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Card className="custom-card">
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Mis Billeteras</h1>
                                </Card.Title>
                                <Table className="custom-table" responsive>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Moneda</th>
                                            <th>Saldo</th>
                                            <th>Equivalencia en USD</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billeteraList.map((billetera) =>
                                            <tr key={"billetera-" + billetera.id}>
                                                <td>{billetera.id}</td>
                                                <td>{billetera.moneda.nombre}</td>
                                                <td>{billetera.saldo}</td>
                                                <td>${billetera.saldo * billetera.moneda.valorUsd}</td>
                                                <td>
                                                    <Link to={`/billeteras/operaciones/${billetera.id}`}>
                                                        <Button variant="outline-warning">Ingresar</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/movimientos/${billetera.id}`}>
                                                        <Button variant="info">Ver Movimientos</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button variant="outline-danger" onClick={() => removeBilletera(billetera.id)}>Eliminar</Button>
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

export default BilleteraList;
