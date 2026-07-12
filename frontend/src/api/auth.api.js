import api from "./axios";

export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data.data.user;
};

export const registerUser = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data.data.user;
};

export const googleLogin = async (idToken) => {
    const response = await api.post("/auth/google", { idToken });
    return response.data.data.user;
};

export const getCurrentUser = async () => {
    const response = await api.get("/users/me");
    return response.data.data.user;
};

export const logoutUser = async () => {
    await api.post("/auth/logout");
};