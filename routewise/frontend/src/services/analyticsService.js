import { api } from './api';

export const analyticsService = {
  overview: () => api.get('/analytics/overview').then((r) => r.data),
  routes: () => api.get('/analytics/routes').then((r) => r.data),
  distance: () => api.get('/analytics/distance').then((r) => r.data),
  timeSaved: () => api.get('/analytics/time-saved').then((r) => r.data),
};
