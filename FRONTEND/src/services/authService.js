import api from './api'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const empleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/empleados/${id}`)
    return response.data
  },

  getByDepartamento: async (departamento) => {
    const response = await api.get(`/empleados/departamento/${departamento}`)
    return response.data
  },

  create: async (empleadoData) => {
    const response = await api.post('/empleados', empleadoData)
    return response.data
  },

  update: async (id, empleadoData) => {
    const response = await api.put(`/empleados/${id}`, empleadoData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/empleados/${id}`)
    return response.data
  }
}

export const equiposService = {
  getAll: async () => {
    const response = await api.get('/equipos')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/equipos/${id}`)
    return response.data
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/equipos/estado/${estado}`)
    return response.data
  },

  create: async (equipoData) => {
    const response = await api.post('/equipos', equipoData)
    return response.data
  },

  update: async (id, equipoData) => {
    const response = await api.put(`/equipos/${id}`, equipoData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/equipos/${id}`)
    return response.data
  },

  asignar: async (id, empleadoId) => {
    const response = await api.post(`/equipos/${id}/asignar`, { empleado_id: empleadoId })
    return response.data
  },

  liberar: async (id) => {
    const response = await api.post(`/equipos/${id}/liberar`)
    return response.data
  }
}

export const asignacionesService = {
  getAll: async () => {
    const response = await api.get('/asignaciones')
    return response.data
  },

  getByEquipo: async (equipoId) => {
    const response = await api.get(`/asignaciones/equipo/${equipoId}`)
    return response.data
  },

  getByEmpleado: async (empleadoId) => {
    const response = await api.get(`/asignaciones/empleado/${empleadoId}`)
    return response.data
  },

  getEstadisticas: async () => {
    const response = await api.get('/asignaciones/estadisticas')
    return response.data
  },

  create: async (asignacionData) => {
    const response = await api.post('/asignaciones', asignacionData)
    return response.data
  }
}