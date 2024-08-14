import axios from "axios";
import { useEffect, useState } from "react";
import LabelBS from "../../components/LabelBS";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Container, Row, Form, FormGroup, FormSelect } from "react-bootstrap";
import { getBilleteraById, insertBilletera } from "../../services/BilleteraService";
import MenuUsuario from "../../components/MenuUsuario";
import { getMonedaList } from "../../services/MonedaService";

const BilleteraForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [monedaId, setMonedaId] = useState('');
    const [errors, setErrors] = useState({})
    const [usuario, setUsuario] = useState(null)
    const [validated, setValidated] = useState(false);
    const [monedaList, setMonedaList] = useState([]);

    useEffect(() => {
        fetchListaMonedas();
    }, [])

    useEffect(() => {
        if (!id) return;
        fetchListaBilleteras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchListaBilleteras = () => {
        getBilleteraById(id).then((res) => {
            setMonedaId(res.moneda_id);
        });
    }

    const fetchListaMonedas = () => {
        getMonedaList().then((res) => {
            setMonedaList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de monedas:', error);
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

        saveBilletera();
    }

    const saveBilletera = () => {
        const billetera = {
            moneda_id: monedaId
        }

        insertBilletera(billetera).then(() => {
            navigate('/billeteras');
        }).catch((err) => {
            console.log(err);
            setErrors({ ...errors, formError: err });
        });

    }


    return (
        <>
            <MenuUsuario />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h1 className="custom-title">Crear Billetera</h1>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={enviarDatos}>
                                    {errors.formError && <p className="text-danger">{errors.formError}</p>}
                                    <FormGroup className="mt-2">
                                        <LabelBS text="Moneda" />
                                        <FormSelect required value={monedaId} onChange={(e) => {
                                            setMonedaId(e.target.value)
                                        }}>
                                            <option value="">Seleccione una moneda</option>
                                            {monedaList.map((moneda) =>
                                                <option key={"moneda-" + moneda.id} value={moneda.id}>{moneda.nombre}</option>
                                            )}
                                        </FormSelect>
                                        <Form.Control.Feedback type="invalid">La moneda es requerida</Form.Control.Feedback>
                                    </FormGroup>
                                    <div className="mt-2">
                                        <Button type="submit" variant="info">Guardar</Button>
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

export default BilleteraForm;
