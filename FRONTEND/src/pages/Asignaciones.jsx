import React, { useState, useEffect } from 'react'
import { asignacionesService, equiposService, empleadosService } from '../services/authService'

const Asignaciones = () => {
  const [asignaciones, setAsignaciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    equipo_id: '',
    empleado_id_nuevo: '',
    observaciones: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [asignacionesRes, equiposRes, empleadosRes] = await Promise.all([
        asignacionesService.getAll(),
        equiposService.getAll(),
        empleadosService.getAll()
      ])
      setAsignaciones(asignacionesRes.data || [])
      setEquipos(equiposRes.data || [])
      setEmpleados(empleadosRes.data || [])
    } catch (error) {
      setError('Error al cargar los datos')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Obtener el usuario actual del localStorage para el administrador_id
      const user = JSON.parse(localStorage.getItem('user'))
      
      const asignacionData = {
        ...formData,
        administrador_id: user.empleado_id,
        empleado_id_anterior: null // Para nuevas asignaciones
      }

      await asignacionesService.create(asignacionData)
      await loadData()
      resetForm()
      setShowModal(false)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear la asignación')
    }
  }

  const resetForm = () => {
    setFormData({
      equipo_id: '',
      empleado_id_nuevo: '',
      observaciones: ''
    })
  }

  const equiposDisponibles = equipos.filter(equipo => equipo.estado === 'Disponible')

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
          Historial de Asignaciones
        </h1>
        <p className="text-gray-600">
          Seguimiento de asignaciones y reasignaciones de equipos
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="corporate-card p-4 text-center">
          <h3 className="text-sm font-medium text-gray-600">Total Asignaciones</h3>
          <p className="text-2xl font-semibold text-gray-900">{asignaciones.length}</p>
        </div>
        <div className="corporate-card p-4 text-center border border-blue-200 bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Equipos Involucrados</h3>
          <p className="text-2xl font-semibold text-blue-600">
            {new Set(asignaciones.map(a => a.equipo_id)).size}
          </p>
        </div>
        <div className="corporate-card p-4 text-center border border-purple-200 bg-purple-50">
          <h3 className="text-sm font-medium text-gray-600">Empleados Involucrados</h3>
          <p className="text-2xl font-semibold text-purple-600">
            {new Set(asignaciones.flatMap(a => [a.empleado_id_anterior, a.empleado_id_nuevo]).filter(Boolean)).size}
          </p>
        </div>
        <div className="corporate-card p-4 text-center border border-green-200 bg-green-50">
          <h3 className="text-sm font-medium text-gray-600">Equipos Disponibles</h3>
          <p className="text-2xl font-semibold text-green-600">
            {equiposDisponibles.length}
          </p>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="corporate-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Historial Completo
            </h2>
            <p className="text-gray-600">
              {asignaciones.length} registros de asignaciones
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="corporate-btn-primary flex items-center"
          >
            <span className="text-lg mr-2">+</span>
            Nueva Asignación
          </button>
        </div>

        {/* Lista de asignaciones */}
        <div className="overflow-x-auto">
          <table className="corporate-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Equipo</th>
                <th>Cambio</th>
                <th>Administrador</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.id}>
                  <td>
                    <div className="font-medium text-gray-900">
                      {new Date(asignacion.fecha_cambio).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(asignacion.fecha_cambio).toLocaleTimeString('es-ES')}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-lg">
                          {asignacion.tipo === 'Laptop' ? '💻' : 
                           asignacion.tipo === 'Tablet' ? '📱' :
                           asignacion.tipo === 'Monitor' ? '🖥️' : '🔧'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {asignacion.tipo}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {asignacion.marca} {asignacion.modelo}
                        </div>
                        <div className="text-gray-400 text-xs font-mono">
                          {asignacion.numero_serial}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      {asignacion.empleado_id_anterior ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-red-600">
                            <span className="mr-2">←</span>
                            <span>{asignacion.empleado_anterior_nombre}</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <span className="mr-2">→</span>
                            <span>{asignacion.empleado_nuevo_nombre}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-green-600 flex items-center">
                          <span className="mr-2">🎯</span>
                          Asignado a: {asignacion.empleado_nuevo_nombre}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-gray-900">
                      {asignacion.administrador_nombre || 'Sistema'}
                    </div>
                  </td>
                  <td>
                    <div className="text-gray-500 text-sm">
                      {asignacion.observaciones || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {asignaciones.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <p className="text-gray-500">No se encontraron asignaciones</p>
              <p className="text-gray-400 text-sm mt-2">Comienza creando la primera asignación</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para nueva asignación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="corporate-card p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Nueva Asignación
              </h3>
              <p className="text-gray-600 mt-2">
                Asigna un equipo disponible a un empleado
              </p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Equipo *</label>
                <select
                  required
                  value={formData.equipo_id}
                  onChange={(e) => setFormData({...formData, equipo_id: e.target.value})}
                  className="corporate-input w-full"
                >
                  <option value="">Seleccionar equipo</option>
                  {equiposDisponibles.map(equipo => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.tipo} - {equipo.marca} {equipo.modelo} ({equipo.numero_serial})
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-2">
                  {equiposDisponibles.length} equipos disponibles
                </p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Asignar a empleado *</label>
                <select
                  required
                  value={formData.empleado_id_nuevo}
                  onChange={(e) => setFormData({...formData, empleado_id_nuevo: e.target.value})}
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

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  rows="3"
                  className="corporate-input w-full resize-none"
                  placeholder="Observaciones adicionales sobre esta asignación..."
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
                  className="corporate-btn-primary"
                >
                  Crear Asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Asignaciones