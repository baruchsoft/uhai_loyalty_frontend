import axios from "axios";
const baseURL = import.meta.env.VITE_APP_BASE_URL;
console.log(baseURL, "=>baseUrl");

export const newRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
});
