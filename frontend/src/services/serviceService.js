import api from './api.js';

/**
 * Obtener todos los talleres aprobados (Público)
 * @param {Object} filters - { search, category, sort, page, limit }
 */
const getPublicServices = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await api.get(`/api/services/public?${params.toString()}`);
  return response.data;
};

/**
 * Obtener los talleres del HOST autenticado
 */
const getMyServices = async () => {
  const response = await api.get('/api/services/my-services');
  return response.data;
};

/**
 * Obtener los talleres pendientes de aprobación (ADMIN)
 */
const getPendingServices = async () => {
  const response = await api.get('/api/services/pending');
  return response.data;
};

/**
 * Crear un nuevo taller
 * @param {Object} serviceData - { title, description, price, category }
 */
const createService = async (serviceData) => {
  const response = await api.post('/api/services', serviceData);
  return response.data;
};

/**
 * Actualizar un taller
 * @param {string} id - UUID del taller
 * @param {Object} serviceData - { title, description, price, category }
 */
const updateService = async (id, serviceData) => {
  const response = await api.put(`/api/services/${id}`, serviceData);
  return response.data;
};

/**
 * Eliminar un taller
 * @param {string} id - UUID del taller
 */
const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data;
};

/**
 * Aprobar un taller (ADMIN)
 * @param {string} id - UUID del taller
 */
const approveService = async (id) => {
  const response = await api.patch(`/api/services/${id}/approve`);
  return response.data;
};

/**
 * Rechazar un taller (ADMIN)
 * @param {string} id - UUID del taller
 */
const rejectService = async (id) => {
  const response = await api.patch(`/api/services/${id}/reject`);
  return response.data;
};

export default {
  getPublicServices,
  getMyServices,
  getPendingServices,
  createService,
  updateService,
  deleteService,
  approveService,
  rejectService,
};
