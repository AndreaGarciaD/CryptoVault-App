import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getBilleteraById} from "../../services/BilleteraService";
import MenuUsuario from "../../components/MenuUsuario";
import { getMovimientosByBilleteraId } from "../../services/MovimientoService";
import { getTipoForDisplay } from "../../utils/movimientoUtils";


const MovimientosList = () => {
    const { id } = useParams(); //movimiento id
    const [movimientosList, setMovimientosList] = useState([]);
    const [billetera, setBilletera] = useState(null);

    useEffect(() => {
        if (!id) return;
        fetchListaMovimientos();
        fetchBilletera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchListaMovimientos = () => {
        getMovimientosByBilleteraId(id).then((res) => {
            setMovimientosList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de movimientos:', error);
        });
    }

    const fetchBilletera = () => {
        getBilleteraById(id).then((res) => {
            setBilletera(res.moneda.nombre);
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
                                    <h1 className="custom-title">{billetera} - Movimientos</h1>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Descripcion</th>
                                            <th>Tipo</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimientosList.map((movimiento) =>
                                            <tr key={"movimiento-" + movimiento.id}>
                                                <td>{movimiento.id}</td>
                                                <td>{movimiento.descripcion}</td>
                                                <td>{getTipoForDisplay(movimiento.tipo)}</td>
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

export default MovimientosList;
