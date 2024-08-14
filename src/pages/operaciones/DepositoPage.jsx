import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row, Table, Modal, Form, Alert } from "react-bootstrap";
import MenuUsuario from "../../components/MenuUsuario";
import { depositarEnBilletera, getBilleteraById } from "../../services/BilleteraService";
import axios from "axios";
import { deleteTarjeta, getTarjetasByUsuario, insertTarjeta, updateTarjeta } from "../../services/TarjetaService";
import LabelBS from "../../components/LabelBS";
import imagenCard from "../../assets/credit-card.png";
import { cubrirNumeroTarjeta } from "../../utils/movimientoUtils";

const DepositoPage = () => {
    const { id } = useParams(); // billetera id
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [tarjetaList, setTarjetaList] = useState([]);
    const [billetera, setBilletera] = useState('');
    const [usuario, setUsuario] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTarjeta, setEditTarjeta] = useState(null);
    const [newTarjeta, setNewTarjeta] = useState({
        nombre: '',
        numero: '',
        cvv: '',
        fechVencimiento: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [showDepositForm, setShowDepositForm] = useState(false);
    const [montoUSD, setMontoUSD] = useState('');
    const [tarjeta, setTarjeta] = useState('');

    useEffect(() => {
        if (!id) return;
        if (usuario) {
            return;
        }
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (usuario) {
            fetchListaTarjetas();
            fetchBilletera();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    const getUserInfo = () => {
        console.log(token);
        axios.get('http://localhost:3000/api/me', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            setUsuario(res.data);
        });
    }

    const fetchListaTarjetas = () => {
        getTarjetasByUsuario(usuario.id).then((res) => {
            setTarjetaList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de tarjetas:', error);
        });
    }

    const fetchBilletera = () => {
        getBilleteraById(id).then((res) => {
            setBilletera(res);
        });
    }

    const removeTarjeta = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta tarjeta?');
        if (!confirmation) return;
        deleteTarjeta(id).then(() => {
            fetchListaTarjetas();
        }).catch((error) => {
            console.error('Error al eliminar tarjeta:', error);
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTarjeta({
            ...newTarjeta,
            [name]: value
        });
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTarjeta({
            ...editTarjeta,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        insertTarjeta(newTarjeta).then(() => {
            setShowModal(false);
            fetchListaTarjetas();
        }).catch((error) => {
            setErrorMessage(error.message);
            console.error('Error al insertar tarjeta:', error);
        });
    }

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateTarjeta(editTarjeta.id, editTarjeta).then(() => {
            setShowEditModal(false);
            fetchListaTarjetas();
        }).catch((error) => {
            setErrorMessage(error.message);
            console.error('Error al editar tarjeta:', error);
        });
    }

    const handleUsarClick = () => {
        setShowDepositForm(true);
    }

    const handleDeposit = () => {
        const movimiento = {
            monto: parseFloat(montoUSD)
        }

        depositarEnBilletera(id, movimiento).then(() => {
            setShowDepositForm(false);
            fetchListaTarjetas();
            navigate('/billeteras');
        }).catch((error) => {
            setErrorMessage(error.message);
        });
    }

    const getTarjeta = (tarjeta) => {
        setTarjeta(tarjeta);
    }

    const handleEditClick = (tarjeta) => {
        setEditTarjeta(tarjeta);
        setShowEditModal(true);
    }

    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <h1 className="custom-title2">Depositar a Billetera</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Tarjetas disponibles</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Codigo</th>
                                            <th>Nombre</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tarjetaList.map((tarjeta) =>
                                            <tr key={tarjeta.id}>
                                                <td>
                                                    <img src={imagenCard} alt="Visa" />
                                                </td>
                                                <td>{cubrirNumeroTarjeta(tarjeta.numero)}</td>
                                                <td>{tarjeta.nombre}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => { handleUsarClick(); getTarjeta(tarjeta) }}>Usar</Button>
                                                </td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleEditClick(tarjeta)}>Editar</Button>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeTarjeta(tarjeta.id)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Button variant="info" onClick={() => setShowModal(true)}>Agregar nueva tarjeta</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Formulario de depósito */}
                {showDepositForm && (
                    <Row className="mt-3">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        <h1 className="custom-title">Depósito en billetera</h1>
                                    </Card.Title>
                                    <p><strong>Tarjeta: </strong>{cubrirNumeroTarjeta(tarjeta.numero)}</p>
                                    <Form>
                                        <Form.Group controlId="formMontoUSD">
                                            <LabelBS text="Monto en USD" />
                                            <Form.Control
                                                type="number"
                                                value={montoUSD}
                                                onChange={(e) => setMontoUSD(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Equivalencia en {billetera.moneda.nombre}:</Form.Label>
                                            <p>{montoUSD / billetera.moneda.valorUsd}</p>
                                        </Form.Group>
                                        <Button variant="info" onClick={handleDeposit}>Confirmar depósito</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar nueva tarjeta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={newTarjeta.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                                type="text"
                                name="numero"
                                value={newTarjeta.numero}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                name="cvv"
                                value={newTarjeta.cvv}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formFechVencimiento">
                            <Form.Label>Fecha de Vencimiento</Form.Label>
                            <Form.Control
                                type="text"
                                name="fechVencimiento"
                                value={newTarjeta.fechVencimiento}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="info" type="submit">
                            Agregar tarjeta
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar tarjeta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formEditNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={editTarjeta?.nombre || ''}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEditNumero">
                            <Form.Label>Número</Form.Label>
                            <Form.Control
                                type="text"
                                name="numero"
                                value={editTarjeta?.numero || ''}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="info" type="submit">
                            Guardar cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DepositoPage;
