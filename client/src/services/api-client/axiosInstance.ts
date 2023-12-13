import axios from "axios";
import jwtDecode from 'jwt-decode';

const API_URL = 'http://localhost:3000';
const API_VERSION = process.env.REACT_APP_API_VERSION;

const axiosInstance = axios.create({
    baseURL: `${API_URL}/${API_VERSION}`
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            //@ts-ignore
            config.headers = {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getAccessToken()}`,
            };
        } else {
            //@ts-ignore
            config.headers = {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            };
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);



axiosInstance.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        if (error.response.status === 401) {
            window.location.href = "/sign-in";
        }

        return Promise.reject(error);
    }
);

const getAccessToken = () => {
    return localStorage.getItem('token');
};


export default axiosInstance;
