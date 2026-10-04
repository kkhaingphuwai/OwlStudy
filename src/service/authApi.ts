import api from "./api";

export const loginApi = async (
    email: string,
    password: string
) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};
