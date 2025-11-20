import React, { useState, useEffect } from 'react'
import { asignacionesService, equiposService, empleadosService } from '../services/authService'
// Asegúrate de haber ejecutado 'npm install moment' si usas la función moment()
import moment from 'moment' 

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
    ubicacion: 'Almacen General', // MODIFICADO: Default 'Almacen General'
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

  const handleEdit = (equipo) => {
    setEditingEquipo(equipo)
    setFormData({
      tipo: equipo.tipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      numero_serial: equipo.numero_serial,
      estado: equipo.estado,
      ubicacion: equipo.ubicacion || 'Almacen General',
      empleado_id: equipo.empleado_id || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este equipo? Esta acción no se puede deshacer.')) {
      try {
        await equiposService.delete(id)
        loadData()
      } catch (error) {
        setError('Error al eliminar el equipo')
        console.error('Error:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const dataToSend = {
      ...formData,
      // Asegurar que empleado_id sea null si el estado no es 'Asignado'
      empleado_id: formData.estado === 'Asignado' ? formData.empleado_id : null,
      // Asegurar que la ubicación sea 'Almacen General' si se libera
      ubicacion: formData.estado === 'Disponible' && !formData.empleado_id
        ? 'Almacen General'
        : formData.ubicacion
    }

    try {
      if (editingEquipo) {
        await equiposService.update(editingEquipo.id, dataToSend)
      } else {
        await equiposService.create(dataToSend)
      }
      loadData()
      resetForm()
      setShowModal(false)
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar el equipo')
    }
  }

  const resetForm = () => {
    setEditingEquipo(null)
    setFormData({
      tipo: '',
      marca: '',
      modelo: '',
      numero_serial: '',
      estado: 'Disponible',
      ubicacion: 'Almacen General', // Default al resetear
      empleado_id: ''
    })
  }

  const equiposFiltrados = equipos.filter(equipo => {
    if (filtroEstado === 'todos') return true
    return equipo.estado === filtroEstado
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Disponible':
        return 'text-green-700 bg-green-50'
      case 'Asignado':
        return 'text-blue-700 bg-blue-50'
      case 'Mantenimiento':
        return 'text-yellow-700 bg-yellow-50'
      case 'Baja':
        return 'text-red-700 bg-red-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Equipos
        </h1>
        <p className="text-gray-600">
          Inventario y estado actual de todos los activos de la empresa.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Tarjeta principal */}
      <div className="corporate-panel p-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Inventario ({equipos.length} total)
            </h2>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="corporate-input"
            >
              <option value="todos">Mostrar Todos</option>
              <option value="Disponible">Disponible</option>
              <option value="Asignado">Asignado</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true) }}
            className="corporate-btn-setup flex items-center"
          >
            <span className="text-lg mr-2">+</span>
            Añadir Equipo
          </button>
        </div>

        {/* Lista de equipos */}
        <div className="overflow-x-auto">
          <table className="corporate-table">
            <thead>
              <tr>
                <th>Tipo/Marca</th>
                <th>Serial</th>
                <th>Estado</th>
                <th>Ubicación</th>
                <th>Asignado a</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.map((equipo) => (
                <tr key={equipo.id}>
                  <td>
                    <div className="font-medium text-gray-900">
                      {equipo.tipo}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {equipo.marca} {equipo.modelo}
                    </div>
                  </td>
                  <td>
                    <div className="font-mono text-sm text-gray-600">
                      {equipo.numero_serial}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipo.estado)}`}
                    >
                      {equipo.estado}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-gray-800">
                      {equipo.ubicacion || '-'}
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-gray-900">
                      {/* El backend (Equipo.js) ya está haciendo el JOIN para obtener empleado_nombre */}
                      {equipo.empleado_nombre || 'N/A'}
                    </div>
                    {equipo.empleado_nombre && (
                      <div className="text-xs text-gray-500">
                        ({empleados.find(e => e.id === equipo.empleado_id)?.departamento})
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="text-sm text-gray-500">
                      {equipo.fecha_actualizacion ? moment(equipo.fecha_actualizacion).fromNow() : 'N/A'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleEdit(equipo)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(equipo.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {equiposFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📦</span>
              </div>
              <p className="text-gray-500">No se encontraron equipos que coincidan con el filtro.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar equipo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="corporate-panel p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingEquipo ? 'Editar Equipo' : 'Añadir Nuevo Equipo'}
              </h3>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos de tipo, marca, modelo, serial */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Tipo</label>
                <input
                  required
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Ej: Laptop, Monitor, Teléfono"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Marca</label>
                <input
                  required
                  type="text"
                  value={formData.marca}
                  onChange={(e) => setFormData({...formData, marca: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Ej: Dell, HP, Apple"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Modelo</label>
                <input
                  required
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Ej: Latitude 5420, M1"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Número Serial</label>
                <input
                  required
                  type="text"
                  value={formData.numero_serial}
                  onChange={(e) => setFormData({...formData, numero_serial: e.target.value})}
                  className="corporate-input w-full"
                  placeholder="Ej: ABC-12345"
                />
              </div>

              {/* Campo Estado */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Estado</label>
                <select
                  required
                  value={formData.estado}
                  onChange={(e) => {
                    const newEstado = e.target.value;
                    const isDispo = newEstado === 'Disponible';
                    setFormData({
                      ...formData,
                      estado: newEstado,
                      // Lógica de desasignación al cambiar a Disponible
                      empleado_id: isDispo ? '' : formData.empleado_id,
                      // Ubicación por defecto al liberar
                      ubicacion: isDispo ? 'Almacen General' : formData.ubicacion
                    })
                  }}
                  className="corporate-input w-full"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Asignado">Asignado</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              {/* Campo Ubicación */}
              {formData.estado !== 'Disponible' && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Ubicación (Si no está en Almacén)</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    className="corporate-input w-full"
                    placeholder="Ej: Sala 101, Taller de Mantenimiento"
                  />
                </div>
              )}

              {/* Selección de Empleado solo si está Asignado */}
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
                  className="corporate-btn-setup"
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

export default Equipos;