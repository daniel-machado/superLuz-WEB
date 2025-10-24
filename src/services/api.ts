import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Pegando a URL da API do arquivo .env

// const API_URL = "http://localhost:5555/api"; // URL padrão para desenvolvimento

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Permite cookies (útil para autenticação com JWT)
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default api;