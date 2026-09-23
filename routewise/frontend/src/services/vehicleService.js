import { api } from './api';

export const vehicleService = {
  list: () => api.get('/vehicles').then((r) => r.data),
  create: (payload) => api.post('/vehicles', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/vehicles/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/vehicles/${id}`).then((r) => r.data),
};
