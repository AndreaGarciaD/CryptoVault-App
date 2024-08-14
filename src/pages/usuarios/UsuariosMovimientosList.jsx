import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import MenuAdmin from "../../components/MenuAdmin";
import { getMovimientosByUsuarioId } from "../../services/MovimientoService";
import { getTipoForDisplay } from "../../utils/movimientoUtils";
import { getUsuarioById } from "../../services/UsuarioService";

const UsuariosMovimientosList = () => {
    const { id } = useParams();
    const [billeteraList, setBilleteraList] = useState([]);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        fetchListaMovimientos();
        getUsuarioInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchListaMovimientos = () => {
        getMovimientosByUsuarioId(id).then((res) => {
            setBilleteraList(res);
        }).catch((error) => {
            console.error('Error al obtener la lista de billeteras:', error);
        });
    }

    const getUsuarioInfo = () => {
        getUsuarioById(id).then((res) => {
            console.log(res);
            setUsuario(res.nombre);
        });
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
                                    <h1 className="custom-title">{usuario} - Movimientos</h1>
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
                                        {billeteraList.map((billetera) =>
                                            <tr key={"billetera-" + billetera.id}>
                                                <td>{billetera.id}</td>
                                                <td>{billetera.descripcion}</td>
                                                <td>{getTipoForDisplay(billetera.tipo)}</td>
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
export default UsuariosMovimientosList;