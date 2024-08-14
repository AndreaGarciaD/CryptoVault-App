import axios from 'axios';
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getCuentasByUsuario = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'cuenta/usuario/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getCuentaById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'cuenta/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const insertCuenta = (cuenta) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'cuenta', cuenta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                if (error.response && error.response.status === 400) {
                    reject(new Error("Número de tarjeta inválido"));
                } else {
                    reject(error);
                }
            });
    });
};

export const updateCuenta = (id, cuenta) => {
    return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_BASE_URL + `cuenta/${id}`, cuenta, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const deleteCuenta = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_BASE_URL + `cuenta/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const retiroParaCuenta = (id, movimiento) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'cuenta/retiro/' + id, movimiento, getCommonHeaders())
        .then((res) => {
            resolve(res.data);
        }).catch((error) => {
            redirectOnError(error, reject);
        });
    });
};
