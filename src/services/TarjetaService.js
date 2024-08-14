import axios from 'axios';
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getTarjetasByUsuario = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'tarjeta/usuario/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getTarjetaById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'tarjeta/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const insertTarjeta = (tarjeta) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'tarjeta', tarjeta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
};

export const updateTarjeta = (id, tarjeta) => {
    return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_BASE_URL + `tarjeta/${id}`, tarjeta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const deleteTarjeta = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_BASE_URL + `tarjeta/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}