import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'routewise_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Listeners the AuthContext registers so a 401 anywhere logs the user out
// and a network failure can be surfaced as a toast without every call site
// repeating the same try/catch boilerplate.
let onUnauthorized = () => {};
let onNetworkError = () => {};

export function registerApiHandlers({ unauthorized, networkError }) {
  if (unauthorized) onUnauthorized = unauthorized;
  if (networkError) onNetworkError = networkError;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      onNetworkError();
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || fallback;
}
