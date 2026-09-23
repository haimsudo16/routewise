import { api } from './api';

export const geocodeService = {
  search: (query) => api.get('/geocode/search', { params: { query } }).then((r) => r.data),
};
