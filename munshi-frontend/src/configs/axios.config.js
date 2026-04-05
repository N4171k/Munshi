import axios from "axios";
import { backendUrl } from "../env.exports";

const axiosInstance = axios.create({
    baseURL: backendUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("munshi_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosInstance;
