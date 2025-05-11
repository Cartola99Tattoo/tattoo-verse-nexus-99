
import axios from 'axios';

// Cria uma instância do axios com configurações padrão
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    // Você pode adicionar qualquer lógica aqui para manipular 
    // requisições antes de serem enviadas
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Você pode adicionar manipulação de erros aqui
    return Promise.reject(error);
  }
);
