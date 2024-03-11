// First we need to import axios.js
import axios, { AxiosRequestHeaders } from "axios";

// const API_URL = `http://192.168.1.117:8000/api`; //local
const API_URL = `http://api-sfds.akrbio.com/api`

const instance = axios.create({
  // .. where we make our configurations
  baseURL: API_URL,
});

export const setAuthToken = (token?: string) => {
  if (token) {
    instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers["Authorization"];
  }
};

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers = config.headers || ({} as AxiosRequestHeaders);
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await axios.post(
          `${API_URL}/auth/token/refresh-token?refresh_token=${refreshToken}`
        );
        if (response.status === 200) {
          localStorage.setItem("access_token", response.data.access_token);
          return instance(originalRequest);
        }
        if (response.status === 401) {
          redirectToLogin();
        }
      }
    }
    if (error.response.status === 403) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
const redirectToLogin = () => {
  localStorage.clear();
  window.location.href = "/login";
};
export default instance;
