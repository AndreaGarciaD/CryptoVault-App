import { useEffect, useState } from "react";
import { getBilleterasByUsuario } from "../../services/BilleteraService";
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import MenuAdmin from "../../components/MenuAdmin";
import { getUsuarioById } from "../../services/UsuarioService";

const UsuariosBilleterasList = () => {
    const { id } = useParams();
    const [billeteraList, setBilleteraList] = useState([]);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        fetchListaBilleteras();
        getUsuarioInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchListaBilleteras = () => {
        getBilleterasByUsuario(id).then((res) => {
            setBilleteraList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de billeteras:', error);
        });
    }

    const getUsuarioInfo = () => {
        getUsuarioById(id).then((res) => {
            console.log(res);
            setUsuario(res.nombre);
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
                                    <h1 className="custom-title">{usuario} - Billeteras</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Moneda</th>
                                            <th>Saldo</th>
                                            <th>Saldo en USD</th>
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
export default UsuariosBilleterasList;