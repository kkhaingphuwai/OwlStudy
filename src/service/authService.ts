import api from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post("/login", { email, password });
      return data;
    } catch (error: any) {
      console.log(error)
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },
  
  refresh: async () => {
        const refreshToken = sessionStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await api.post("/refresh", { refreshToken });
        return data;
    },
};
