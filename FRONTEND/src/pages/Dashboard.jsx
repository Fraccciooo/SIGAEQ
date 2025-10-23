import React, { useState, useEffect } from 'react'
import { empleadosService, equiposService, asignacionesService } from '../services/authService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    totalEquipos: 0,
    equiposAsignados: 0,
    equiposDisponibles: 0,
    equiposMantenimiento: 0,
    equiposBaja: 0,
    totalAsignaciones: 0,
    empleadosPorDepartamento: {},
    equiposPorTipo: {}
  })
  const [loading, setLoading] = useState(true)
  const [recentAsignaciones, setRecentAsignaciones] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [empleadosRes, equiposRes, asignacionesRes, estadisticasRes] = await Promise.all([
        empleadosService.getAll(),
        equiposService.getAll(),
        asignacionesService.getAll(),
        asignacionesService.getEstadisticas()
      ])

      const empleados = empleadosRes.data || []
      const equipos = equiposRes.data || []
      const asignaciones = asignacionesRes.data || []

      const empleadosPorDepartamento = empleados.reduce((acc, emp) => {
        acc[emp.departamento] = (acc[emp.departamento] || 0) + 1
        return acc
      }, {})

      const equiposPorTipo = equipos.reduce((acc, eq) => {
        acc[eq.tipo] = (acc[eq.tipo] || 0) + 1
        return acc
      }, {})

      setStats({
        totalEmpleados: empleados.length,
        totalEquipos: equipos.length,
        equiposAsignados: equipos.filter(e => e.estado === 'Asignado').length,
        equiposDisponibles: equipos.filter(e => e.estado === 'Disponible').length,
        equiposMantenimiento: equipos.filter(e => e.estado === 'Mantenimiento').length,
        equiposBaja: equipos.filter(e => e.estado === 'Baja').length,
        totalAsignaciones: estadisticasRes.data?.total_asignaciones || asignaciones.length,
        empleadosPorDepartamento,
        equiposPorTipo
      })

      setRecentAsignaciones(asignaciones.slice(0, 5))
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, description }) => (
    <div className="corporate-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <p className="text-gray-500 text-xs">{description}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 text-xl">{icon}</span>
        </div>
      </div>
    </div>
  )

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
          Panel de Control
        </h1>
        <p className="text-gray-600">
          Resumen general del sistema SIGAEQ
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Empleados"
          value={stats.totalEmpleados}
          icon="👥"
          description="Personal activo"
        />
        <StatCard
          title="Total Equipos"
          value={stats.totalEquipos}
          icon="💻"
          description="Inventario total"
        />
        <StatCard
          title="Equipos Asignados"
          value={stats.equiposAsignados}
          icon="✅"
          description="En uso actual"
        />
        <StatCard
          title="Total Asignaciones"
          value={stats.totalAsignaciones}
          icon="🔄"
          description="Historial total"
        />
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="corporate-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Equipos
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Disponibles', value: stats.equiposDisponibles, color: 'badge-success' },
              { label: 'Asignados', value: stats.equiposAsignados, color: 'badge-info' },
              { label: 'Mantenimiento', value: stats.equiposMantenimiento, color: 'badge-warning' },
              { label: 'De Baja', value: stats.equiposBaja, color: 'badge-error' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <span className={`${item.color} mr-3`}>{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="corporate-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Equipos por Tipo
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.equiposPorTipo).map(([tipo, count]) => (
              <div key={tipo} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{tipo}</span>
                <span className="font-semibold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas asignaciones */}
      <div className="corporate-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Últimas Asignaciones
          </h3>
          <span className="text-gray-500 text-sm">
            {recentAsignaciones.length} registros recientes
          </span>
        </div>
        
        <div className="space-y-4">
          {recentAsignaciones.map((asignacion) => (
            <div key={asignacion.id} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-sm">🔄</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {asignacion.tipo} - {asignacion.marca}
                </p>
                <p className="text-gray-600 text-sm">
                  Asignado a: {asignacion.empleado_nuevo_nombre}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(asignacion.fecha_cambio).toLocaleDateString('es-ES')} • 
                  {new Date(asignacion.fecha_cambio).toLocaleTimeString('es-ES')}
                </p>
              </div>
              <div className="text-right">
                <span className="badge-success">
                  Completado
                </span>
              </div>
            </div>
          ))}
          
          {recentAsignaciones.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <p className="text-gray-500">No hay asignaciones recientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard