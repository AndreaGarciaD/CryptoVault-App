import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row, Table, Modal, Form, Alert } from "react-bootstrap";
import MenuUsuario from "../../components/MenuUsuario";
import { getBilleteraById, transferirDesdeBilleteraId } from "../../services/BilleteraService";
import axios from "axios";
import userImagen from '../../assets/user.png';
import { deleteBeneficiario, getBeneficiariosByUserId, insertBeneficiarioParaUserId, updateBeneficiario } from "../../services/BeneficiarioService";

const TransferenciaPage = () => {
    const { id } = useParams(); // billetera id
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [beneficiarioList, setBeneficiarioList] = useState([]);
    const [billetera, setBilletera] = useState('');
    const [usuario, setUsuario] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newBeneficiario, setNewBeneficiario] = useState({
        nombre_referencia: '',
        codigo_billetera: '',
        usuario_id: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [showDepositForm, setShowDepositForm] = useState(false);
    const [montoMoneda, setMontoMoneda] = useState('');
    const [beneficiarioId, setBeneficiarioId] = useState('');
    
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
            fetchListaBeneficiarios();
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

    const fetchListaBeneficiarios = () => {
        getBeneficiariosByUserId(usuario.id).then((res) => {
            setBeneficiarioList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de beneficiarios:', error);
        });
    }

    const fetchBilletera = () => {
        getBilleteraById(id).then((res) => {
            setBilletera(res);
        });
    }

    const removeBeneficiario = (id) => {
        const confirmation = window.confirm('¿Estás seguro de eliminar este beneficiario?');
        if (!confirmation) return;
        deleteBeneficiario(id).then(() => {
            fetchListaBeneficiarios();
        }).catch((error) => {
            console.error('Error al eliminar beneficiario:', error);
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        newBeneficiario.usuario_id = usuario.id;
        setNewBeneficiario({
            ...newBeneficiario,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            updateBeneficiario(newBeneficiario.id, newBeneficiario).then(() => {
                setShowModal(false);
                fetchListaBeneficiarios();
                setEditMode(false);
            }).catch((error) => {
                setErrorMessage(error.message);
                console.error('Error al actualizar beneficiario:', error);
            });
        } else {
            insertBeneficiarioParaUserId(usuario.id, newBeneficiario).then(() => {
                setShowModal(false);
                fetchListaBeneficiarios();
            }).catch((error) => {
                setErrorMessage(error.message);
                console.error('Error al insertar beneficiario:', error);
            });
        }
    }

    const handleUsarClick = () => {
        setShowDepositForm(true);
    }

    const handleDeposit = () => {
        const movimiento = {
            beneficiarioId: beneficiarioId,
            monto: parseFloat(montoMoneda)
        }

        transferirDesdeBilleteraId(id, movimiento).then(() => {
            setShowDepositForm(false);
            fetchListaBeneficiarios();
            navigate('/billeteras');
        }).catch((error) => {
            setErrorMessage(error.message);
        });
    }

    const getBeneficiarioId = (beneficiario) => {
        setBeneficiarioId(beneficiario);
    }

    const handleEditClick = (beneficiario) => {
        setNewBeneficiario(beneficiario);
        setEditMode(true);
        setShowModal(true);
    }

    const handleAddClick = () => {
        setNewBeneficiario({
            nombre_referencia: '',
            codigo_billetera: '',
            usuario_id: usuario.id
        });
        setEditMode(false);
        setShowModal(true);
    }

    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <h1 className="custom-title2">Transferir</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Beneficiarios </h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre referencia</th>
                                            <th>Codigo billetera</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {beneficiarioList.map((beneficiario) =>
                                            <tr key={beneficiario.id}>
                                                <td>
                                                    <img src={userImagen} alt="user"/>
                                                </td>
                                                <td>{beneficiario.nombre_referencia}</td>
                                                <td>{beneficiario.codigo_billetera}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => { handleUsarClick(); getBeneficiarioId(beneficiario) }}>Transferir</Button>
                                                </td>
                                                <td>
                                                    <Button variant="warning" onClick={() => handleEditClick(beneficiario)}>Editar</Button>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => removeBeneficiario(beneficiario.id)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <Button variant="info" onClick={handleAddClick}>Añadir nuevo beneficiario</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {showDepositForm && (
                    <Row className="mt-3">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        <h1 className="custom-title">Transferencia a beneficiario: {beneficiarioId.nombre_referencia}</h1>
                                    </Card.Title>
                                    <p><strong>Saldo disponible: </strong>{billetera.saldo}</p>
                                    <Form>
                                        <Form.Group controlId="formTransferencia">
                                            <Form.Label>Monto en moneda:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={montoMoneda}
                                                onChange={(e) => setMontoMoneda(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Equivalencia en USD:</Form.Label>
                                            <p>{montoMoneda * billetera.moneda.valorUsd}</p>
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
                    <Modal.Title>{editMode ? "Editar Beneficiario" : "Añadir Beneficiario"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre Referencia</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre_referencia"
                                value={newBeneficiario.nombre_referencia}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNumero">
                            <Form.Label>Codigo billetera</Form.Label>
                            <Form.Control
                                type="text"
                                name="codigo_billetera"
                                value={newBeneficiario.codigo_billetera}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="info" type="submit">
                            {editMode ? "Actualizar" : "Añadir"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default TransferenciaPage;
