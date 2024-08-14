import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { getBilleteraById } from "../../services/BilleteraService";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MenuUsuario from "../../components/MenuUsuario";
import './BilleteraOperaciones.css';  // Import CSS file for additional styling

const BilleteraOperaciones = () => {
    const { id } = useParams(); //billetera id
    const [moneda, setMoneda] = useState('');
    const [saldo, setSaldo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [saldoUsd, setSaldoUsd] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchBilletera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBilletera = () => {
        getBilleteraById(id).then((res) => {
            console.log(res)
            setMoneda(res.moneda.nombre);
            setSaldo(res.saldo);
            setSaldoUsd(res.moneda.valorUsd);
            setCodigo(res.codigo);
        });
    }

    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-5 justify-content-center">
                    <Col md={8}>
                        <Card className="billetera-card shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">
                                    <h1 className="text-primary">{moneda}</h1>
                                </Card.Title>
                                <Card.Text>
                                    <Row className="mb-3">
                                        <Col><h3>Saldo:</h3></Col>
                                        <Col className="text-right"><h3>{saldo}</h3></Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col><h3>Equivalencia en USD:</h3></Col>
                                        <Col className="text-right"><h3>${(saldo * saldoUsd).toFixed(2)}</h3></Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col><h3>Código de Billetera:</h3></Col>
                                        <Col className="text-right"><h3>{codigo}</h3></Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className="mt-4 justify-content-center">
                    <Col className="d-flex justify-content-center mb-3">
                        <Link to={`/deposito/${id}`}>
                            <Button variant="success" className="mx-2">Depositar</Button>
                        </Link>
                        <Link to={`/retiro/${id}`}>
                            <Button variant="danger" className="mx-2">Retirar</Button>
                        </Link>
                        <Link to={`/transferencia/${id}`}>
                            <Button variant="info" className="mx-2">Transferir</Button>
                        </Link>
                        <Link to={`/venta/create/${id}`}>
                            <Button variant="warning" className="mx-2">Vender</Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default BilleteraOperaciones;
