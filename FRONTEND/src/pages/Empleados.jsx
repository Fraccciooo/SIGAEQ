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
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Gestión de Empleados
        </h1>
        <p className="text-blue-100 text-lg opacity-80">
          Administra los empleados de la fundación
        </p>
      </div>

      {error && (
        <div className="glass-card p-4 border border-red-400/30 bg-red-500/20 rounded-2xl">
          <p className="text-red-100 text-center">{error}</p>
        </div>
      )}

      {/* Tarjeta de acciones y estadísticas */}
      <div className="glass-card p-6 rounded-2xl border border-white/20">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">
              Lista de Empleados
            </h2>
            <p className="text-blue-100">
              {empleados.length} empleados registrados en el sistema
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover-lift flex items-center"
          >
            <span className="text-lg mr-2">+</span>
            Nuevo Empleado
          </button>
        </div>

        {/* Lista de empleados */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Empleado</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Cargo</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Departamento</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Fecha Ingreso</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Estado</th>
                <th className="text-left py-4 px-4 text-white/60 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-white font-semibold text-sm">
                          {empleado.nombre?.charAt(0)}{empleado.apellido?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {empleado.nombre} {empleado.apellido}
                        </div>
                        <div className="text-white/60 text-sm">
                          {empleado.cedula}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{empleado.cargo}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                      {empleado.departamento}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white/70 text-sm">
                      {new Date(empleado.fecha_ingreso).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      empleado.activo 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(empleado)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(empleado.id)}
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

          {empleados.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white/40 text-2xl">👥</span>
              </div>
              <p className="text-white/60 text-lg">No se encontraron empleados</p>
              <p className="text-white/40 text-sm mt-2">Comienza agregando el primer empleado</p>
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
                {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h3>
              <p className="text-blue-100 mt-2">
                {editingEmpleado ? 'Actualiza la información del empleado' : 'Completa la información del nuevo empleado'}
              </p>
            </div>
              
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Cédula *</label>
                <input
                  type="text"
                  required
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: V-12345678"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Cargo *</label>
                <input
                  type="text"
                  required
                  value={formData.cargo}
                  onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cargo del empleado"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Departamento</label>
                <input
                  type="text"
                  value={formData.departamento}
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Departamento"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Correo *</label>
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Fecha Ingreso *</label>
                <input
                  type="date"
                  required
                  value={formData.fecha_ingreso}
                  onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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