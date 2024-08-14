import { useEffect, useState } from "react";
import MenuAdmin from "../../components/MenuAdmin";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { deleteMoneda, getMonedaList } from "../../services/MonedaService";


const MonedaList = () => {
    const [monedaList, setMonedaList] = useState([]);

    useEffect(() => {
        fetchListaMonedas();
    }, []);

    const fetchListaMonedas = () => {
        getMonedaList().then((res) => {
            setMonedaList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de monedas:', error);
        });
    }

    const removeMoneda = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta moneda?');
        if (!confirmation) return;
        deleteMoneda(id).then(() => {
            fetchListaMonedas();
        }).catch((error) => {
            console.error('Error al eliminar a moneda:', error);
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
                                    <h1 className="custom-title">Monedas disponibles</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Nombre</th>
                                            <th>Valor en USD</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monedaList.map((moneda) =>
                                            <tr key={"moneda-" + moneda.id}>
                                                <td>{moneda.id}</td>
                                                <td>{moneda.nombre}</td>
                                                <td>${moneda.valorUsd}</td>
                                                <td>
                                                    <Link to={`/monedas/editar/${moneda.id}`}>
                                                        <Button variant="info">Editar</Button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeMoneda(moneda.id)}>Eliminar</Button>
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

export default MonedaList;
