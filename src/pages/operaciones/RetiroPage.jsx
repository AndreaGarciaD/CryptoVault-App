import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row, Table, Modal, Form, Alert } from "react-bootstrap";
import MenuUsuario from "../../components/MenuUsuario";
import { getBilleteraById } from "../../services/BilleteraService";
import axios from "axios";
import { deleteCuenta, getCuentasByUsuario, insertCuenta, retiroParaCuenta, updateCuenta } from "../../services/CuentaService";
import imagenBank from '../../assets/piggy-bank.png';

const RetiroPage = () => {
    const { id } = useParams(); // billetera id
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [cuentaList, setCuentaList] = useState([]);
    const [billetera, setBilletera] = useState('');
    const [usuario, setUsuario] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newCuenta, setNewCuenta] = useState({
        numero_cuenta: '',
        nombre: '',
        documento_identificacion: '',
        banco: '',
        moneda_id: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [showRetiroForm, setShowRetiroForm] = useState(false);
    const [montoMoneda, setMontoMoneda] = useState('');
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [editMode, setEditMode] = useState(false);

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
            fetchListaCuentas();
            fetchBilletera();
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
        });
    }

    const fetchListaCuentas = () => {
        getCuentasByUsuario(usuario.id).then((res) => {
            setCuentaList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de cuentas:', error);
        });
    }

    const fetchBilletera = () => {
        getBilleteraById(id).then((res) => {
            setBilletera(res);
        });
    }

    const removeCuenta = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar esta cuenta?');
        if (!confirmation) return;
        deleteCuenta(id).then(() => {
            fetchListaCuentas();
        }).catch((error) => {
            console.error('Error al eliminar cuenta:', error);
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        newCuenta.moneda_id = billetera.moneda.id;
        setNewCuenta({
            ...newCuenta,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            updateCuenta(newCuenta.id, newCuenta).then(() => {
                setShowModal(false);
                fetchListaCuentas();
            }).catch((error) => {
                setErrorMessage(error.message);
            });
        } else {
            insertCuenta(newCuenta).then(() => {
                setShowModal(false);
                fetchListaCuentas();
            }).catch((error) => {
                setErrorMessage(error.message);
            });
        }
    }

    const handleUsarClick = (cuenta) => {
        setSelectedCuenta(cuenta);
        setShowRetiroForm(true);
    }

    const handleRetiro = () => {
        const movimiento = {
            monto: parseFloat(montoMoneda),
            cuenta_id: selectedCuenta.id
        }

        console.log(movimiento);

        retiroParaCuenta(id, movimiento).then(() => {
            setShowRetiroForm(false);
            fetchListaCuentas();
            navigate('/billeteras');
        }).catch((error) => {
            setErrorMessage(error.message);
        });
    }

    const handleEditClick = (cuenta) => {
        setNewCuenta(cuenta);
        setEditMode(true);
        setShowModal(true);
    }

    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <h1 className="custom-title2">Retirar de Billetera</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Cuentas bancarias disponibles</h1>
                                </Card.Title>
                                <Card.Subtitle className="custom-subtitle">Saldo en billetera: {billetera.saldo} </Card.Subtitle>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Numero de Cuenta</th>
                                            <th>Banco</th>
                                            <th>Nombre</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cuentaList.map((cuenta) =>
                                            <tr key={cuenta.id}>
                                                <td>
                                                    <img src={imagenBank} alt="bank"/>
                                                </td>
                                                <td>{cuenta.numero_cuenta}</td>
                                                <td>{cuenta.banco}</td>
                                                <td>{cuenta.nombre}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => handleUsarClick(cuenta)}>Usar</Button>
                                                </td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleEditClick(cuenta)}>Editar</Button>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeCuenta(cuenta.id)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Button variant="info" onClick={() => { setNewCuenta({ numero_cuenta: '', nombre: '', documento_identificacion: '', banco: '', moneda_id: '' }); setEditMode(false); setShowModal(true); }}>Agregar nueva cuenta</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {showRetiroForm && (
                    <Row className="mt-3">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        <h1 className="custom-title">Retiro a Cuenta</h1>
                                    </Card.Title>
                                    <p><strong>Cuenta:</strong> {selectedCuenta.numero_cuenta} - {selectedCuenta.banco}</p>
                                    <Form>
                                        <Form.Group controlId="formMontoMoneda">
                                            <Form.Label>Cantidad en {billetera.moneda.nombre}:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={montoMoneda}
                                                onChange={(e) => setMontoMoneda(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Equivalencia en USD:</Form.Label>
                                            <p>{(montoMoneda * billetera.moneda.valorUsd).toFixed(2)}</p>
                                        </Form.Group>
                                        <Button variant="info" onClick={handleRetiro}>Confirmar retiro</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Editar Cuenta" : "Agregar una nueva cuenta"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nro de Cuenta</Form.Label>
                            <Form.Control
                                type="text"
                                name="numero_cuenta"
                                value={newCuenta.numero_cuenta}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={newCuenta.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDocumento">
                            <Form.Label>Documento de Identificación</Form.Label>
                            <Form.Control
                                type="text"
                                name="documento_identificacion"
                                value={newCuenta.documento_identificacion}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBanco">
                            <Form.Label>Banco</Form.Label>
                            <Form.Control
                                type="text"
                                name="banco"
                                value={newCuenta.banco}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="info" type="submit">
                            {editMode ? "Guardar Cambios" : "Agregar Cuenta"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RetiroPage;
