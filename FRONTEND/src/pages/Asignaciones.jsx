import React, { useState, useEffect } from 'react'
import { asignacionesService, equiposService, empleadosService } from '../services/authService'

const Asignaciones = () => {
  const [asignaciones, setAsignaciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  
  // MODIFICADO: formData ahora tiene un array 'equipos_ids'
  const [formData, setFormData] = useState({
    equipos_ids: [], // Array para múltiples equipos
    empleado_id_nuevo: '',
    observaciones: ''
  })

  // Estado para búsqueda dentro del modal
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro de asignación? El equipo volverá al estado anterior si es posible, o quedará Disponible.')) {
      try {
        await asignacionesService.delete(id)
        loadData()
      } catch (error) {
        setError('Error al eliminar el registro')
      }
    }
  }

  // MANEJO DE CHECKBOXES (Selección Múltiple)
  const handleEquipmentToggle = (equipoId) => {
    setFormData(prev => {
      const currentIds = prev.equipos_ids;
      if (currentIds.includes(equipoId)) {
        // Si ya está, lo quitamos
        return { ...prev, equipos_ids: currentIds.filter(id => id !== equipoId) };
      } else {
        // Si no está, lo agregamos
        return { ...prev, equipos_ids: [...currentIds, equipoId] };
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.equipos_ids.length === 0) {
        setError('Debe seleccionar al menos un equipo');
        return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'))
      
      const datosEnvio = {
        equipos_ids: formData.equipos_ids,
        empleado_id_nuevo: formData.empleado_id_nuevo,
        administrador_id: user.empleado_id,
        observaciones: formData.observaciones
      }

      // Usamos el nuevo servicio de carga masiva
      await asignacionesService.createMasiva(datosEnvio) 
      
      await loadData()
      resetForm()
      setShowModal(false)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear la asignación masiva')
    }
  }

  const resetForm = () => {
    setFormData({
      equipos_ids: [],
      empleado_id_nuevo: '',
      observaciones: ''
    })
    setSearchTerm('')
  }

  // Filtrar equipos disponibles para mostrar en el modal
  const equiposDisponibles = equipos.filter(equipo => equipo.estado === 'Disponible')
  
  // Filtrar búsqueda visual en el modal
  const equiposListado = equiposDisponibles.filter(eq => 
    eq.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.numero_serial.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center items-center h-64"><div className="loading-spinner"></div></div>

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Historial de Asignaciones</h1>
        <p className="text-gray-600">Seguimiento de asignaciones y reasignaciones de equipos</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Panel Estadísticas (Sin cambios) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="corporate-panel-data p-4 text-center">
            <h3 className="text-sm font-medium text-gray-600">Total Asignaciones</h3>
            <p className="text-2xl font-semibold text-gray-900">{asignaciones.length}</p>
        </div>
        {/* ... (Resto de estadísticas igual) ... */}
      </div>

      {/* Tabla Principal */}
      <div className="corporate-panel p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Historial Completo</h2>
          </div>
          <button onClick={() => setShowModal(true)} className="corporate-btn-setup flex items-center">
            <span className="text-lg mr-2">+</span> Nueva Asignación
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="corporate-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Equipo</th>
                <th>Cambio</th>
                <th>Admin</th>
                <th>Obs</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.id}>
                  <td>
                    <div className="font-medium text-gray-900">
                        {new Date(asignacion.fecha_cambio).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-2">
                        <span className="text-blue-600">💻</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{asignacion.tipo}</div>
                        <div className="text-xs text-gray-500">{asignacion.marca} - {asignacion.numero_serial}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                        <span className="text-green-600">➜ {asignacion.empleado_nuevo_nombre}</span>
                    </div>
                  </td>
                  <td>{asignacion.administrador_nombre}</td>
                  <td className="text-xs text-gray-500">{asignacion.observaciones || '-'}</td>
                  <td>
                    <button onClick={() => handleDelete(asignacion.id)} className="text-red-600 hover:text-red-800 text-sm">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE ASIGNACIÓN MASIVA */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="corporate-panel p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Nueva Asignación</h3>
              <p className="text-gray-600 mt-1">Selecciona un empleado y los equipos a asignar</p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Seleccionar Empleado */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">1. Seleccionar Empleado *</label>
                <select
                  required
                  value={formData.empleado_id_nuevo}
                  onChange={(e) => setFormData({...formData, empleado_id_nuevo: e.target.value})}
                  className="corporate-input w-full border-blue-500 border-2"
                >
                  <option value="">-- Buscar Empleado --</option>
                  {empleados.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre} {emp.apellido} ({emp.departamento})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Seleccionar Equipos (Lista con Checkboxes) */}
              <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-gray-700 text-sm font-bold">2. Seleccionar Equipos *</label>
                    <span className="text-sm text-blue-600 font-semibold">
                        {formData.equipos_ids.length} seleccionados
                    </span>
                </div>

                {/* Buscador de equipos */}
                <input 
                    type="text" 
                    placeholder="🔍 Buscar equipo por tipo o serial..." 
                    className="corporate-input mb-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="border rounded-lg max-h-60 overflow-y-auto bg-gray-50 p-2">
                    {equiposListado.length > 0 ? (
                        equiposListado.map(equipo => (
                            <div key={equipo.id} 
                                 className={`flex items-center p-3 mb-2 rounded cursor-pointer border transition-colors ${
                                     formData.equipos_ids.includes(equipo.id.toString()) 
                                     ? 'bg-blue-100 border-blue-500' 
                                     : 'bg-white border-gray-200 hover:bg-gray-100'
                                 }`}
                                 onClick={() => handleEquipmentToggle(equipo.id.toString())}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.equipos_ids.includes(equipo.id.toString())}
                                    onChange={() => {}} // Manejado por el div padre
                                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                />
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {equipo.tipo} <span className="text-gray-500">- {equipo.marca} {equipo.modelo}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 font-mono">S/N: {equipo.numero_serial}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No hay equipos disponibles con ese criterio.</p>
                    )}
                </div>
              </div>

              {/* 3. Observaciones */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  rows="2"
                  className="corporate-input w-full resize-none"
                  placeholder="Ej: Asignación de equipo completo de ingreso..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="corporate-btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="corporate-btn-setup bg-blue-700 hover:bg-blue-800">
                  Asignar {formData.equipos_ids.length} Equipos
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