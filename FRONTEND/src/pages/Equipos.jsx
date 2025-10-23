import React, { useState, useEffect } from 'react'
import { equiposService, empleadosService } from '../services/authService'

const Equipos = () => {
  const [equipos, setEquipos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [editingEquipo, setEditingEquipo] = useState(null)
  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    numero_serial: '',
    estado: 'Disponible',
    ubicacion: '',
    empleado_id: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [equiposRes, empleadosRes] = await Promise.all([
        equiposService.getAll(),
        empleadosService.getAll()
      ])
      setEquipos(equiposRes.data || [])
      setEmpleados(empleadosRes.data || [])
    } catch (error) {
      setError('Error al cargar los datos')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const equiposFiltrados = filtroEstado === 'todos' 
    ? equipos 
    : equipos.filter(equipo => equipo.estado === filtroEstado)

  const estadisticas = {
    total: equipos.length,
    asignados: equipos.filter(e => e.estado === 'Asignado').length,
    disponibles: equipos.filter(e => e.estado === 'Disponible').length,
    mantenimiento: equipos.filter(e => e.estado === 'Mantenimiento').length,
    baja: equipos.filter(e => e.estado === 'Baja').length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingEquipo) {
        await equiposService.update(editingEquipo.id, formData)
      } else {
        await equiposService.create(formData)
      }

      await loadData()
      resetForm()
      setShowModal(false)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar el equipo')
    }
  }

  const handleEdit = (equipo) => {
    setEditingEquipo(equipo)
    setFormData({
      tipo: equipo.tipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      numero_serial: equipo.numero_serial,
      estado: equipo.estado,
      ubicacion: equipo.ubicacion,
      empleado_id: equipo.empleado_id || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await equiposService.delete(id)
        await loadData()
      } catch (error) {
        setError('Error al eliminar el equipo')
      }
    }
  }

  const handleAsignar = async (equipoId) => {
    const empleadoId = prompt('Ingresa el ID del empleado a asignar:')
    if (empleadoId) {
      try {
        await equiposService.asignar(equipoId, empleadoId)
        await loadData()
      } catch (error) {
        setError('Error al asignar el equipo')
      }
    }
  }

  const handleLiberar = async (equipoId) => {
    if (window.confirm('¿Estás seguro de que quieres liberar este equipo?')) {
      try {
        await equiposService.liberar(equipoId)
        await loadData()
      } catch (error) {
        setError('Error al liberar el equipo')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      tipo: '',
      marca: '',
      modelo: '',
      numero_serial: '',
      estado: 'Disponible',
      ubicacion: '',
      empleado_id: ''
    })
    setEditingEquipo(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Equipos
        </h1>
        <p className="text-gray-600">
          Administra el inventario de equipos tecnológicos
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="corporate-card p-4 text-center">
          <h3 className="text-sm font-medium text-gray-600">Total</h3>
          <p className="text-2xl font-semibold text-gray-900">{estadisticas.total}</p>
        </div>
        <div className="corporate-card p-4 text-center border border-green-200 bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Disponibles</h3>
          <p className="text-2xl font-semibold text-green-600">{estadisticas.disponibles}</p>
        </div>
        <div className="corporate-card p-4 text-center border border-blue-200 bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Asignados</h3>
          <p className="text-2xl font-semibold text-blue-600">{estadisticas.asignados}</p>
        </div>
        <div className="corporate-card p-4 text-center border border-yellow-200 bg-yellow-50">
          <h3 className="text-sm font-medium text-gray-600">Mantenimiento</h3>
          <p className="text-2xl font-semibold text-yellow-600">{estadisticas.mantenimiento}</p>
        </div>
        <div className="corporate-card p-4 text-center border border-red-200 bg-red-50">
          <h3 className="text-sm font-medium text-gray-600">Baja</h3>
          <p className="text-2xl font-semibold text-red-600">{estadisticas.baja}</p>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="corporate-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Inventario de Equipos
            </h2>
            <p className="text-gray-600">
              {equiposFiltrados.length} de {equipos.length} equipos mostrados
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtro */}
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="corporate-input"
            >
              <option value="todos">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Asignado">Asignado</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Baja">Baja</option>
            </select>
            
            <button
              onClick={openCreateModal}
              className="corporate-btn-primary flex items-center"
            >
              <span className="text-lg mr-2">+</span>
              Nuevo Equipo
            </button>
          </div>
        </div>

        {/* Lista de equipos */}
        <div className="overflow-x-auto">
          <table className="corporate-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Serial</th>
                <th>Estado</th>
                <th>Asignado a</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.map((equipo) => (
                <tr key={equipo.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-lg">
                          {equipo.tipo === 'Laptop' ? '💻' : 
                           equipo.tipo === 'Tablet' ? '📱' :
                           equipo.tipo === 'Monitor' ? '🖥️' :
                           equipo.tipo === 'Impresora' ? '🖨️' : '🔧'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {equipo.tipo}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {equipo.marca} {equipo.modelo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-gray-500 text-sm font-mono">
                      {equipo.numero_serial}
                    </div>
                  </td>
                  <td>
                    <span className={
                      equipo.estado === 'Disponible' ? 'badge-success' :
                      equipo.estado === 'Asignado' ? 'badge-info' :
                      equipo.estado === 'Mantenimiento' ? 'badge-warning' :
                      'badge-error'
                    }>
                      {equipo.estado}
                    </span>
                  </td>
                  <td>
                    <div className="font-medium text-gray-900">
                      {equipo.empleado_nombre || 'No asignado'}
                    </div>
                  </td>
                  <td>
                    <div className="text-gray-500 text-sm">
                      {equipo.ubicacion}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(equipo)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </button>
                      {equipo.estado === 'Disponible' && (
                        <button
                          onClick={() => handleAsignar(equipo.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Asignar
                        </button>
                      )}
                      {equipo.estado === 'Asignado' && (
                        <button
                          onClick={() => handleLiberar(equipo.id)}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                        >
                          Liberar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(equipo.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {equiposFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">💻</span>
              </div>
              <p className="text-gray-500">No se encontraron equipos</p>
              <p className="text-gray-400 text-sm mt-2">
                {filtroEstado !== 'todos' ? 'Prueba con otro filtro' : 'Comienza agregando el primer equipo'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="corporate-card p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
              </h3>
              <p className="text-gray-600 mt-2">
                {editingEquipo ? 'Actualiza la información del equipo' : 'Completa la información del nuevo equipo'}
              </p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Tipo *</label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="corporate-input w-full"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Impresora">Impresora</option>
                  <option value="Teclado">Teclado</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Proyector">Proyector</option>
                  <option value="Servidor">Servidor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Marca</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    className="corporate-input w-full"
                    placeholder="Marca"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    className="corporate-input w-full"
                    placeholder="Modelo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Número de Serial *</label>
                <input
                  type="text"
                  required
                  value={formData.numero_serial}
                  onChange={(e) => setFormData({...formData, numero_serial: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Número de serial"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="corporate-input w-full"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Asignado">Asignado</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Ubicación del equipo"
                />
              </div>

              {formData.estado === 'Asignado' && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Asignar a empleado</label>
                  <select
                    value={formData.empleado_id}
                    onChange={(e) => setFormData({...formData, empleado_id: e.target.value})}
                    className="corporate-input w-full"
                  >
                    <option value="">Seleccionar empleado</option>
                    {empleados.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nombre} {emp.apellido} - {emp.departamento}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="corporate-btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="corporate-btn-primary"
                >
                  {editingEquipo ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Equipos