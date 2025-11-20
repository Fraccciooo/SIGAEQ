import React, { useState, useEffect } from 'react'
import { empleadosService } from '../services/authService'

const Empleados = () => {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState(null)
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    cargo: '',
    fecha_ingreso: '',
    departamento: '',
    correo: ''
  })

  useEffect(() => {
    loadEmpleados()
  }, [])

  const loadEmpleados = async () => {
    try {
      const response = await empleadosService.getAll()
      setEmpleados(response.data || [])
    } catch (error) {
      setError('Error al cargar los empleados')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingEmpleado) {
        await empleadosService.update(editingEmpleado.id, formData)
      } else {
        await empleadosService.create(formData)
      }

      await loadEmpleados()
      resetForm()
      setShowModal(false)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar el empleado')
    }
  }

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado)
    setFormData({
      cedula: empleado.cedula,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      cargo: empleado.cargo,
      fecha_ingreso: empleado.fecha_ingreso,
      departamento: empleado.departamento,
      correo: empleado.correo
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await empleadosService.delete(id)
        await loadEmpleados()
      } catch (error) {
        setError('Error al eliminar el empleado')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      cedula: '',
      nombre: '',
      apellido: '',
      cargo: '',
      fecha_ingreso: '',
      departamento: '',
      correo: ''
    })
    setEditingEmpleado(null)
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
          Gestión de Empleados
        </h1>
        <p className="text-gray-600">
          Administra los empleados de la fundación
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Tarjeta de acciones y estadísticas */}
      <div className="corporate-panel p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Lista de Empleados
            </h2>
            <p className="text-gray-600">
              {empleados.length} empleados registrados en el sistema
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="corporate-btn-setup flex items-center"
          >
            <span className="text-lg mr-2">+</span>
            Nuevo Empleado
          </button>
        </div>

        {/* Lista de empleados */}
        <div className="overflow-x-auto">
          <table className="corporate-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Fecha Ingreso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">
                          {empleado.nombre?.charAt(0)}{empleado.apellido?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-center text-gray-900">
                          {empleado.nombre} {empleado.apellido}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {empleado.cedula}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-gray-900">{empleado.cargo}</div>
                  </td>
                  <td>
                    <span className="badge-info">
                      {empleado.departamento}
                    </span>
                  </td>
                  <td>
                    <div className="text-gray-500 text-sm">
                      {new Date(empleado.fecha_ingreso).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td>
                    <span className={empleado.activo ? 'badge-success' : 'badge-error'}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(empleado)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(empleado.id)}
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

          {empleados.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👥</span>
              </div>
              <p className="text-gray-500">No se encontraron empleados</p>
              <p className="text-gray-400 text-sm mt-2">Comienza agregando el primer empleado</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="corporate-panel p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h3>
              <p className="text-gray-600 mt-2">
                {editingEmpleado ? 'Actualiza la información del empleado' : 'Completa la información del nuevo empleado'}
              </p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Cédula *</label>
                <input
                  type="text"
                  required
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Ej: V-12345678"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="corporate-input w-full"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    className="corporate-input w-full"
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Cargo *</label>
                <input
                  type="text"
                  required
                  value={formData.cargo}
                  onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Cargo del empleado"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Departamento</label>
              <select
                  required
                  value={formData.departamento}
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  className="corporate-input w-full"
                >
                  <option value="">Seleccionar Departamento</option>
                  <option value="Contabilidad">Contabilidad</option>
                  <option value="Estrategias">Estrategias</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Planificación">Planificación</option>
                  <option value="Presidencia">Presidencia</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Tecnologia">Tecnologia</option>
              </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Correo *</label>
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Fecha Ingreso *</label>
                <input
                  type="date"
                  required
                  value={formData.fecha_ingreso}
                  onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  className="corporate-input w-full"
                />
              </div>

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
                  className="corporate-btn-setup"
                >
                  {editingEmpleado ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Empleados