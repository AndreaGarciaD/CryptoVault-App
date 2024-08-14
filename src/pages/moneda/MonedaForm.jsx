import axios from "axios";
import { useEffect, useState } from "react";
import LabelBS from "../../components/LabelBS";
import { useNavigate, useParams } from "react-router-dom";
import MenuAdmin from "../../components/MenuAdmin";
import { Button, Card, Col, Container, FormControl, Row, Form, FormGroup } from "react-bootstrap";
import { getMonedaById, insertMoneda, updateMoneda } from "../../services/MonedaService";

const MonedaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [nombre, setNombre] = useState('')
    const [valorUsd, setValorUsd] = useState('')
    const [errors, setErrors] = useState({})
    const [usuario, setUsuario] = useState(null)
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchMonedas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchMonedas = () => {
        getMonedaById(id).then((res) => {
            setNombre(res.nombre);
            setValorUsd(res.valorUsd);
        });
    }

    useEffect(() => {
        if (usuario) {
            return;
        }
        getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserInfo = () => {
        axios.get('http://localhost:3000/api/me', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            setUsuario(res.data);
        });
    }

    const enviarDatos = (e) => {
        const form = e.currentTarget;
        let isValid = form.checkValidity();

        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (!isValid) return;

        saveMoneda();
    }

    const saveMoneda = () => {
        const moneda = {
            nombre,
            valorUsd,
        }

        if (id) {
            updateMoneda(id, moneda).then(() => {
                navigate('/monedas');
            }).catch((err) => {
                console.error(err);
                setErrors({ ...errors, formError: 'Error al actualizar moneda, intente nuevamente' })
            });
        } else {
            insertMoneda(moneda).then(() => {
                navigate('/monedas');
            }).catch((err) => {
                console.log(err);
                setErrors({ ...errors, formError: 'Error al insertar moneda, intente nuevamente' })
            });
        }
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
                                    <h1 className="custom-title">Crear Moneda</h1>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                                    {errors.formError && <p className="text-danger">{errors.formError}</p>}
                                    <FormGroup>
                                        <LabelBS text="Nombre" />
                                        <FormControl
                                            required
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">El nombre es requerido</Form.Control.Feedback>
                                    </FormGroup>
                                    <FormGroup className="mt-2">
                                        <LabelBS text="Valor en USD" />
                                        <FormControl
                                            required
                                            type="number"
                                            value={valorUsd}
                                            onChange={(e) => setValorUsd(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">La cantidad de tickets es requerida</Form.Control.Feedback>
                                    </FormGroup>
                                    <div className="mt-2">
                                        <Button type="submit">Guardar</Button>
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

export default MonedaForm;
