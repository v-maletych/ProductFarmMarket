import axios from 'axios';
import {toast} from 'react-hot-toast';

const API_URL = '/';
const baseClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const getAxiosClient = () => {
    const token = localStorage.getItem('jwtToken');

    const client = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && {'Authorization': `Bearer ${token}`})
        }
    });
    client.interceptors.response.use(
        response => response,
        error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('currentUser');
                toast.error("Сесія закінчилася або недостатньо прав.");
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return client;
};

export default baseClient;