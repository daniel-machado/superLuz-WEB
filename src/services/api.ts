import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; //|| "http://localhost:5000/api"; // URL padrão para desenvolvimento

const api = axios.create({
  baseURL: API_URL, 
  withCredentials: true, // Permite cookies (útil para autenticação com JWT)
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default api;