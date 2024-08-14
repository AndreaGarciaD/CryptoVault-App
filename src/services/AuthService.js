import axios from 'axios';
import { getCommonHeaders, redirectOnError } from '../utils/serviceUtils';

export const postLogin = (credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'login', credentials)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}

export const postRegister = (credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'register', credentials)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}

export const postRegisterAdmin = (credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(import.meta.env.VITE_BASE_URL + 'admin', credentials)
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                reject(error);
            });
    });
}

export const getMe = () => {
    return new Promise((resolve, reject) => {
        axios.get(import.meta.env.VITE_BASE_URL + 'me', getCommonHeaders())
            .then((res) => {
                resolve(res.data);
            }).catch((error) => {
                redirectOnError(error, reject);
            });
    });
}