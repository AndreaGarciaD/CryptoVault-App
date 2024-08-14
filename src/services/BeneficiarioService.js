import axios from 'axios';
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const insertBeneficiarioParaUserId = (id, beneficiario) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'beneficiario/' + id, beneficiario, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getBeneficiariosByUserId = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'beneficiario/usuario/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getBeneficiarioById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'beneficiario/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const updateBeneficiario = (id, beneficiario) => {
    return new Promise((resolve, reject) => {
        axios.put(import.meta.env.VITE_BASE_URL + `beneficiario/${id}`, beneficiario, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const deleteBeneficiario = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(import.meta.env.VITE_BASE_URL + `beneficiario/${id}`, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}