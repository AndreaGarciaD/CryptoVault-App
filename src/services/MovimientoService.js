import axios from 'axios';
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getMovimientosByBilleteraId = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'movimiento/billetera/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getMovimientosByUsuarioId = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'movimiento/usuario/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}