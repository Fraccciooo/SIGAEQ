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
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Historial de Asignaciones
        </h1>
        <p className="text-blue-100 text-lg opacity-80">
          Seguimiento de asignaciones y reasignaciones de equipos
        </p>
      </div>

      {error && (
        <div className="glass-card p-4 border border-red-400/30 bg-red-500/20 rounded-2xl">
          <p className="text-red-100 text-center">{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 rounded-2xl border border-white/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Total Asignaciones</h3>
          <p className="text-2xl font-semibold text-white">{asignaciones.length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-blue-400/30 bg-blue-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Equipos Involucrados</h3>
          <p className="text-2xl font-semibold text-blue-300">
            {new Set(asignaciones.map(a => a.equipo_id)).size}
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-purple-400/30 bg-purple-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Empleados Involucrados</h3>
          <p className="text-2xl font-semibold text-purple-300">
            {new Set(asignaciones.flatMap(a => [a.empleado_id_anterior, a.empleado_id_nuevo]).filter(Boolean)).size}
          </p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-green-400/30 bg-green-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Equipos Disponibles</h3>
          <p className="text-2xl font-semibold text-green-300">
            {equiposDisponibles.length}
          </p>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="glass-card p-6 rounded-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">
              Historial Completo
            </h2>
            <p className="text-blue-100">
              {asignaciones.length} registros de asignaciones
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover-lift flex items-center"
          >
            <span className="text-lg mr-2">+</span>
            Nueva Asignación
          </button>
        </div>

        {/* Lista de asignaciones */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Fecha</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Equipo</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Cambio</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Administrador</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="text-white font-semibold">
                      {new Date(asignacion.fecha_cambio).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(asignacion.fecha_cambio).toLocaleTimeString('es-ES')}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white text-lg">
                          {asignacion.tipo === 'Laptop' ? '💻' : 
                           asignacion.tipo === 'Tablet' ? '📱' :
                           asignacion.tipo === 'Monitor' ? '🖥️' : '🔧'}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {asignacion.tipo}
                        </div>
                        <div className="text-white/60 text-sm">
                          {asignacion.marca} {asignacion.modelo}
                        </div>
                        <div className="text-white/40 text-xs font-mono">
                          {asignacion.numero_serial}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      {asignacion.empleado_id_anterior ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-red-300">
                            <span className="mr-2">←</span>
                            <span>{asignacion.empleado_anterior_nombre}</span>
                          </div>
                          <div className="flex items-center text-green-300">
                            <span className="mr-2">→</span>
                            <span>{asignacion.empleado_nuevo_nombre}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-green-300 flex items-center">
                          <span className="mr-2">🎯</span>
                          Asignado a: {asignacion.empleado_nuevo_nombre}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white font-medium">
                      {asignacion.administrador_nombre || 'Sistema'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white/70 text-sm">
                      {asignacion.observaciones || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {asignaciones.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white/40 text-2xl">📋</span>
              </div>
              <p className="text-white/60 text-lg">No se encontraron asignaciones</p>
              <p className="text-white/40 text-sm mt-2">Comienza creando la primera asignación</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para nueva asignación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-glow">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Nueva Asignación
              </h3>
              <p className="text-blue-100 mt-2">
                Asigna un equipo disponible a un empleado
              </p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Equipo *</label>
                <select
                  required
                  value={formData.equipo_id}
                  onChange={(e) => setFormData({...formData, equipo_id: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">Seleccionar equipo</option>
                  {equiposDisponibles.map(equipo => (
                    <option key={equipo.id} value={equipo.id} className="bg-gray-800">
                      {equipo.tipo} - {equipo.marca} {equipo.modelo} ({equipo.numero_serial})
                    </option>
                  ))}
                </select>
                <p className="text-white/50 text-xs mt-2">
                  {equiposDisponibles.length} equipos disponibles
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Asignar a empleado *</label>
                <select
                  required
                  value={formData.empleado_id_nuevo}
                  onChange={(e) => setFormData({...formData, empleado_id_nuevo: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">Seleccionar empleado</option>
                  {empleados.map(emp => (
                    <option key={emp.id} value={emp.id} className="bg-gray-800">
                      {emp.nombre} {emp.apellido} - {emp.departamento}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Observaciones adicionales sobre esta asignación..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-white/80 hover:text-white transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
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