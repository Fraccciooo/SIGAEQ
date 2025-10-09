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
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Gestión de Equipos
        </h1>
        <p className="text-blue-100 text-lg opacity-80">
          Administra el inventario de equipos tecnológicos
        </p>
      </div>

      {error && (
        <div className="glass-card p-4 border border-red-400/30 bg-red-500/20 rounded-2xl">
          <p className="text-red-100 text-center">{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass-card p-4 rounded-2xl border border-white/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Total</h3>
          <p className="text-2xl font-semibold text-white">{estadisticas.total}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-green-400/30 bg-green-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Disponibles</h3>
          <p className="text-2xl font-semibold text-green-300">{estadisticas.disponibles}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-blue-400/30 bg-blue-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Asignados</h3>
          <p className="text-2xl font-semibold text-blue-300">{estadisticas.asignados}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-yellow-400/30 bg-yellow-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Mantenimiento</h3>
          <p className="text-2xl font-semibold text-yellow-300">{estadisticas.mantenimiento}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-red-400/30 bg-red-500/20 text-center">
          <h3 className="text-sm font-medium text-blue-100">Baja</h3>
          <p className="text-2xl font-semibold text-red-300">{estadisticas.baja}</p>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="glass-card p-6 rounded-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">
              Inventario de Equipos
            </h2>
            <p className="text-blue-100">
              {equiposFiltrados.length} de {equipos.length} equipos mostrados
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtro */}
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos" className="bg-gray-800">Todos los estados</option>
              <option value="Disponible" className="bg-gray-800">Disponible</option>
              <option value="Asignado" className="bg-gray-800">Asignado</option>
              <option value="Mantenimiento" className="bg-gray-800">Mantenimiento</option>
              <option value="Baja" className="bg-gray-800">Baja</option>
            </select>
            
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover-lift flex items-center"
            >
              <span className="text-lg mr-2">+</span>
              Nuevo Equipo
            </button>
          </div>
        </div>

        {/* Lista de equipos */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Equipo</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Serial</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Estado</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Asignado a</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Ubicación</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equiposFiltrados.map((equipo) => (
                <tr key={equipo.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white text-xl">
                          {equipo.tipo === 'Laptop' ? '💻' : 
                           equipo.tipo === 'Tablet' ? '📱' :
                           equipo.tipo === 'Monitor' ? '🖥️' :
                           equipo.tipo === 'Impresora' ? '🖨️' : '🔧'}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {equipo.tipo}
                        </div>
                        <div className="text-white/60 text-sm">
                          {equipo.marca} {equipo.modelo}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white/70 font-mono text-sm">
                      {equipo.numero_serial}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      equipo.estado === 'Disponible' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      equipo.estado === 'Asignado' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      equipo.estado === 'Mantenimiento' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {equipo.estado}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white font-medium">
                      {equipo.empleado_nombre || 'No asignado'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white/70 text-sm">
                      {equipo.ubicacion}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(equipo)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      {equipo.estado === 'Disponible' && (
                        <button
                          onClick={() => handleAsignar(equipo.id)}
                          className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors text-sm"
                        >
                          Asignar
                        </button>
                      )}
                      {equipo.estado === 'Asignado' && (
                        <button
                          onClick={() => handleLiberar(equipo.id)}
                          className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors text-sm"
                        >
                          Liberar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(equipo.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors text-sm"
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
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white/40 text-2xl">💻</span>
              </div>
              <p className="text-white/60 text-lg">No se encontraron equipos</p>
              <p className="text-white/40 text-sm mt-2">
                {filtroEstado !== 'todos' ? 'Prueba con otro filtro' : 'Comienza agregando el primer equipo'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-glow">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
              </h3>
              <p className="text-blue-100 mt-2">
                {editingEquipo ? 'Actualiza la información del equipo' : 'Completa la información del nuevo equipo'}
              </p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Tipo *</label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">Seleccionar tipo</option>
                  <option value="Laptop" className="bg-gray-800">Laptop</option>
                  <option value="Tablet" className="bg-gray-800">Tablet</option>
                  <option value="Monitor" className="bg-gray-800">Monitor</option>
                  <option value="Impresora" className="bg-gray-800">Impresora</option>
                  <option value="Teclado" className="bg-gray-800">Teclado</option>
                  <option value="Mouse" className="bg-gray-800">Mouse</option>
                  <option value="Proyector" className="bg-gray-800">Proyector</option>
                  <option value="Servidor" className="bg-gray-800">Servidor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Marca</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Marca"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Modelo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Número de Serial *</label>
                <input
                  type="text"
                  required
                  value={formData.numero_serial}
                  onChange={(e) => setFormData({...formData, numero_serial: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número de serial"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Disponible" className="bg-gray-800">Disponible</option>
                  <option value="Asignado" className="bg-gray-800">Asignado</option>
                  <option value="Mantenimiento" className="bg-gray-800">Mantenimiento</option>
                  <option value="Baja" className="bg-gray-800">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ubicación del equipo"
                />
              </div>

              {formData.estado === 'Asignado' && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Asignar a empleado</label>
                  <select
                    value={formData.empleado_id}
                    onChange={(e) => setFormData({...formData, empleado_id: e.target.value})}
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
              )}

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