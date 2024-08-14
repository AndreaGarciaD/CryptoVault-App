import axios from 'axios';
import { getCommonHeaders, redirectOnError } from "../utils/serviceUtils";

export const getUsuarioList = () => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'usuarios', getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

export const getUsuarioById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'usuarios/' + id, getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}

