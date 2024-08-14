import { useEffect, useState } from "react";
import { insertVentaPorBilleteraId } from "../../services/VentasService";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import MenuUsuario from "../../components/MenuUsuario";
import { useNavigate, useParams } from "react-router-dom";
import { getBilleteraById } from "../../services/BilleteraService";
import LabelBS from "../../components/LabelBS";
import "./VentaPage.css";

const VentaPage = () => {
    const { id } = useParams(); //billetera id
    const [moneda, setMoneda] = useState('');
    const [saldo, setSaldo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [saldoUsd, setSaldoUsd] = useState('');
    const [validated, setValidated] = useState(false);
    const [errors] = useState({});
    const [valor_venta, setValorVenta] = useState('');
    const [monto_moneda, setMontoMoneda] = useState('');
    const [metodo_pago, setMetodoPago] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        fetchBilletera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBilletera = () => {
        getBilleteraById(id).then((res) => {
            setMoneda(res.moneda.nombre);
            setSaldo(res.saldo);
            setSaldoUsd(res.moneda.valorUsd);
            setCodigo(res.codigo);
        });
    }

    const enviarDatos = (e) => {
        const form = e.currentTarget;
        let isValid = form.checkValidity();

        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (!isValid) return;

        crearVenta();
    }

    const crearVenta = () => {
        const venta = {
            valor_venta,
            monto_moneda,
            billetera_destino: null,
            metodo_pago,
            comprador_id: null
        }

        insertVentaPorBilleteraId(id, venta).then(() => {
            navigate('/misventas');
        }).catch((error) => {
            console.error('Error al crear venta:', error);
        });
    }

    return (
        <>
            <MenuUsuario />
            <Container className="venta-container">
            <Row className="mt-3">
                    <Col>
                        <h1 className="custom-title2">Vender</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card className="custom-card">
                            <Card.Body>
                                <Card.Title className="custom-title">
                                    Moneda: {moneda}
                                </Card.Title>
                                <Card.Text className="custom-text">
                                    <strong>Saldo:</strong> {saldo}
                                </Card.Text>
                                <Card.Text className="custom-text">
                                    <strong>Precio de compra en USD:</strong> ${(saldoUsd * 1).toFixed(2)}
                                </Card.Text>
                                <Card.Text className="custom-text">
                                    <strong>Codigo de Billetera:</strong> {codigo}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card className="custom-card">
                            <Card.Body>
                                <Card.Title className="custom-title">
                                    Poner a la venta
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                                    {errors.formError && <p className="text-danger">{errors.formError}</p>}
                                    <FormGroup className="mt-2">
                                        <LabelBS text="Monto de la moneda" />
                                        <FormControl
                                            required
                                            type="number"
                                            value={monto_moneda}
                                            onChange={(e) => setMontoMoneda(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">El monto de la moneda es requerido</Form.Control.Feedback>
                                    </FormGroup>
                                    <FormGroup className="mt-2">
                                        <LabelBS text="Valor para la venta (USD)" />
                                        <FormControl
                                            required
                                            type="number"
                                            value={valor_venta}
                                            onChange={(e) => setValorVenta(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">El valor de venta es requerido</Form.Control.Feedback>
                                    </FormGroup>
                                    <FormGroup className="mt-2">
                                        <LabelBS text="Describir metodo de pago" />
                                        <FormControl
                                            required
                                            type="text"
                                            value={metodo_pago}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">Describe el metodo de pago</Form.Control.Feedback>
                                    </FormGroup>
                                    <div className="mt-4">
                                        <Button type="submit" variant="info" className="custom-button">Guardar</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default VentaPage;
