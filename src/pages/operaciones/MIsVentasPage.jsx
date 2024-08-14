import axios from "axios";
import { useEffect, useState } from "react";
import { deleteVenta, getVentaPorUsuarioId, confirmarVenta } from "../../services/VentasService";
import { Button, Card, Col, Container, Row, Table, Modal, Alert } from "react-bootstrap";
import MenuUsuario from "../../components/MenuUsuario";
import './MisVentasPage.css'; // Archivo CSS para estilos personalizados

const MisVentasPage = () => {
    const [ventasList, setListaVentas] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const token = localStorage.getItem('token');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (usuario) {
            return;
        }
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (usuario) {
            fetchListaVentas(usuario.id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    const getUserInfo = () => {
        axios.get('http://localhost:3000/api/me', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            setUsuario(res.data);
        }).catch((error) => {
            console.error('Error al obtener la información del usuario:', error);
        });
    }

    const fetchListaVentas = (id) => {
        getVentaPorUsuarioId(id).then((res) => {
            setListaVentas(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de ventas:', error);
            setErrors({ ...errors, fetchError: 'Error al obtener la lista de ventas, intente nuevamente' });
        });
    }

    const getButtonVariant = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return 'warning';
            case 'En Validacion':
                return 'primary';
            case 'Vendida':
                return 'success';
            default:
                return 'secondary';
        }
    }

    const removeVenta = (billeteraId) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta billetera?');
        if (!confirmation) return;
        deleteVenta(billeteraId).then(() => {
            fetchListaVentas(usuario.id);
        }).catch((err) => {
            console.log(err);
            setErrors({ ...errors, formError: err });
        });
    }

    const handleConfirmarVenta = (venta) => {
        if (venta.estado === 'En Validacion') {
            setVentaSeleccionada(venta);
            setShowModal(true);
        }
    }

    const handleConfirmar = () => {
        if (!ventaSeleccionada) return;

        console.log('Confirmar venta:', ventaSeleccionada.id);

        confirmarVenta(ventaSeleccionada.id).then(() => {
            fetchListaVentas(usuario.id);
            setShowModal(false);
            setVentaSeleccionada(null);
        }).catch((error) => {
            console.error('Error al confirmar la venta:', error);
            setErrors({ ...errors, confirmError: 'Error al confirmar la venta, intente nuevamente' });
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
                                    <h1 className="custom-title">Ventas publicadas</h1>
                                </Card.Title>
                                {errors.fetchError && <Alert variant="danger">{errors.fetchError}</Alert>}
                                <Table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Moneda</th>
                                            <th>Monto de Moneda</th>
                                            <th>Precio de venta</th>
                                            <th>Metodo de Pago</th>
                                            <th>Estado</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ventasList.map((venta) =>
                                            <tr key={"venta-" + venta.id}>
                                                <td>{venta.id}</td>
                                                <td>{venta.moneda.nombre}</td>
                                                <td>{venta.monto_moneda}</td>
                                                <td>${venta.valor_venta}</td>
                                                <td>{venta.metodo_pago}</td>
                                                <td>
                                                    <Button
                                                        variant={getButtonVariant(venta.estado)}
                                                        onClick={() => handleConfirmarVenta(venta)}
                                                    >
                                                        {venta.estado}
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="outline-danger" onClick={() => removeVenta(venta.id)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                {errors.formError && <Alert variant="danger">{errors.formError}</Alert>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Venta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.confirmError && <Alert variant="danger">{errors.confirmError}</Alert>}
                    {ventaSeleccionada && (
                        <>
                            <p><strong>Método de Pago:</strong> {ventaSeleccionada.metodo_pago}</p>
                            <p><strong>Comprador:</strong> {ventaSeleccionada.comprador.nombre}</p>
                            <img src={`http://localhost:3000/images/${ventaSeleccionada.id}.png`} alt="Comprobante de Pago" style={{ width: '100%' }} />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={handleConfirmar}>Confirmar Venta</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MisVentasPage;
