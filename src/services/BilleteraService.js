import axios from 'axios';
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getBilleterasByUsuario = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'billetera/usuario/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getBilleteraById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'billetera/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const insertBilletera = (billetera) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'billetera', billetera, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                if (error.response && error.response.status === 400) {
                    reject(error.response.data.message);
                } else {
                    redirectOnError(error, reject);
                }
            });
    });
}

export const updateBilletera = (id, moneda) => {
    return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_BASE_URL + 'billetera/' + id, moneda, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const deleteBilletera = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_BASE_URL + `billetera/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const depositarEnBilletera = (id, monto) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'billetera/deposito/'+ id, monto, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const transferirDesdeBilleteraId = (id, transferencia) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'billetera/transferencia/'+ id, transferencia, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}