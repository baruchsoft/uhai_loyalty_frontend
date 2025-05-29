import axios from "axios";

export const newRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000,
  withCredentials: true,
});
