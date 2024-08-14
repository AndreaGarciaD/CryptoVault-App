import axios from "axios";
import { useEffect, useState } from "react";
import { getVentasDisponiblesParaUsuarioId, postComprar, postFotoComprobante } from "../../services/VentasService";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import MenuUsuario from "../../components/MenuUsuario";
import './ListaVentasDisponibles.css';

const ListaVentasDisponibles = () => {
    const [ventasList, setVentasList] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [comprobante, setComprobante] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!usuario) {
            getUserInfo();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    useEffect(() => {
        if (usuario) {
            fetchListaVentasDisponibles(usuario.id);
        }
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
    };

    const fetchListaVentasDisponibles = (id) => {
        getVentasDisponiblesParaUsuarioId(id).then((res) => {
            setVentasList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de ventas:', error);
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVenta(null);
        setComprobante(null);
    };

    const handleShowModal = (venta) => {
        setSelectedVenta(venta);
        setShowModal(true);
    };

    const handleFileChange = (event) => {
        setComprobante(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!comprobante || !selectedVenta) {
            alert("Por favor, suba un comprobante.");
            return;
        }

        const formData = new FormData();
        formData.append('foto', comprobante);

        const venta = {
            usuario_id: usuario.id
        };

        try {
            await postFotoComprobante(selectedVenta.id, formData);
            await postComprar(selectedVenta.id, venta);
            alert("Solicitud de compra enviada correctamente.");
            handleCloseModal();
            fetchListaVentasDisponibles(usuario.id); // Actualizar la lista de ventas disponibles
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            alert("Error al realizar la compra.");
        }
    };

    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Ventas disponibles</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Vendedor</th>
                                            <th>Moneda</th>
                                            <th>Monto de Moneda</th>
                                            <th>Precio</th>
                                            <th>Metodo de Pago</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ventasList.map((venta) => (
                                            <tr key={"venta-" + venta.id}>
                                                <td>{venta.id}</td>
                                                <td>{venta.billetera.usuario.nombre}</td>
                                                <td>{venta.moneda.nombre}</td>
                                                <td>{venta.monto_moneda}</td>
                                                <td>${venta.valor_venta}</td>
                                                <td>{venta.metodo_pago}</td>
                                                <td>
                                                    <Button
                                                        variant="success"
                                                        onClick={() => handleShowModal(venta)}
                                                        className="me-2"
                                                    >
                                                        Comprar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {selectedVenta && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Comprar Moneda</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Método de Pago:</strong> {selectedVenta.metodo_pago}</p>
                        <Form>
                            <Form.Group>
                                <Form.Label>Subir Comprobante</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                        <Button variant="info" onClick={handleSubmit}>Comprar</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}

export default ListaVentasDisponibles;
