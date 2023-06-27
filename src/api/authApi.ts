import axios from "axios";


const BASE_URL = "https://customized-trips-0b578742d7c2.herokuapp.com";

export const authApi = axios.create({
  baseURL: BASE_URL
});

//authApi.defaults.headers.common["Content-Type"] = "application/json";

export const refreshAccessTokenFn = async () => {
  const response = await authApi.get<IUsuario>('/api/auth/login');
  console.log(response)
  return response.data;
};
/*
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes('not logged in') && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return authApi(originalRequest);
    }
    if (error.response.data.message.includes('not refresh')) {
      document.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/