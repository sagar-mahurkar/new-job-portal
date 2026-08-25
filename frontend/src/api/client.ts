import axios from "axios";
import { env } from "../config/env";
import { STORAGE_KEYS } from "@/shared/constants/storage";

const api = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {'Content-Type': 'application/json'}
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return Promise.reject(error);
  }
);

export { api }