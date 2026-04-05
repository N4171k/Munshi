import axiosInstance from "../configs/axios.config";

const TOKEN_KEY = "munshi_token";

const storeSession = (responseData) => {
    if (responseData?.token) {
        localStorage.setItem(TOKEN_KEY, responseData.token);
    }

    return responseData?.user ?? null;
};

export const signup = async ({ name, email, password }) => {
    const response = await axiosInstance.post("/auth/signup", { name, email, password });
    return storeSession(response.data);
};

export const login = async ({ email, password }) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return storeSession(response.data);
};

export const logout = async () => {
    try {
        await axiosInstance.post("/auth/logout");
    } finally {
        localStorage.removeItem(TOKEN_KEY);
    }
};

export const getUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
        return null;
    }

    try {
        const response = await axiosInstance.get("/auth/me");
        return response.data.user;
    } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        console.error("Get User Error:", error.message);
        return null;
    }
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
