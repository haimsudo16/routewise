import { api } from './api';

export const routeService = {
  list: ({ status, search, sort, page = 0, size = 10 } = {}) =>
    api
      .get('/routes', { params: { status: status || undefined, search: search || undefined, sort, page, size } })
      .then((r) => r.data),

  recent: () => api.get('/routes/recent').then((r) => r.data),

  getById: (id) => api.get(`/routes/${id}`).then((r) => r.data),

  create: (payload) => api.post('/routes', payload).then((r) => r.data),

  update: (id, payload) => api.put(`/routes/${id}`, payload).then((r) => r.data),

  remove: (id) => api.delete(`/routes/${id}`).then((r) => r.data),

  optimize: (id) => api.post(`/routes/${id}/optimize`).then((r) => r.data),

  start: (id) => api.post(`/routes/${id}/start`).then((r) => r.data),

  complete: (id) => api.post(`/routes/${id}/complete`).then((r) => r.data),

  cancel: (id) => api.post(`/routes/${id}/cancel`).then((r) => r.data),

  addStop: (routeId, payload) => api.post(`/routes/${routeId}/stops`, payload).then((r) => r.data),

  reorderStops: (routeId, stopIds) =>
    api.put(`/routes/${routeId}/stops/reorder`, { stopIds }).then((r) => r.data),
};

export const stopService = {
  update: (id, payload) => api.put(`/stops/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/stops/${id}`).then((r) => r.data),
  complete: (id) => api.post(`/stops/${id}/complete`).then((r) => r.data),
  skip: (id) => api.post(`/stops/${id}/skip`).then((r) => r.data),
};
