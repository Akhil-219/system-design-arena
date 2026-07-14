import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {

        if (!error.response) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        const excludedRoutes = [
            "/auth/login",
            "/auth/register",
            "/auth/google",
            "/auth/refresh-token",
        ];

        const shouldSkip = excludedRoutes.some(route =>
            originalRequest.url?.includes(route)
        );

        if (
            error.response.status === 401 &&
            !originalRequest._retry &&
            !shouldSkip
        ) {
            originalRequest._retry = true;

            try {
                await api.post("/auth/refresh-token");
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;