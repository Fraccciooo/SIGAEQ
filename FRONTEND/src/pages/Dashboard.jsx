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

  const StatCard = ({ title, value, icon, gradient, description }) => (
    <div className="glass-card hover-lift p-6 rounded-2xl border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          <p className="text-white/40 text-xs">{description}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
          <span className="text-white text-xl">{icon}</span>
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
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Panel de Control
        </h1>
        <p className="text-blue-100 text-lg opacity-80">
          Resumen general del sistema SIGAEQ
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Empleados"
          value={stats.totalEmpleados}
          icon="👥"
          gradient="from-blue-500 to-cyan-500"
          description="Personal activo"
        />
        <StatCard
          title="Total Equipos"
          value={stats.totalEquipos}
          icon="💻"
          gradient="from-green-500 to-teal-500"
          description="Inventario total"
        />
        <StatCard
          title="Equipos Asignados"
          value={stats.equiposAsignados}
          icon="✅"
          gradient="from-purple-500 to-pink-500"
          description="En uso actual"
        />
        <StatCard
          title="Total Asignaciones"
          value={stats.totalAsignaciones}
          icon="🔄"
          gradient="from-orange-500 to-red-500"
          description="Historial total"
        />
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/20">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Estado de Equipos
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Disponibles', value: stats.equiposDisponibles, color: 'bg-green-400' },
              { label: 'Asignados', value: stats.equiposAsignados, color: 'bg-blue-400' },
              { label: 'Mantenimiento', value: stats.equiposMantenimiento, color: 'bg-yellow-400' },
              { label: 'De Baja', value: stats.equiposBaja, color: 'bg-red-400' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                  <span className="text-white/80 text-sm">{item.label}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/20">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
            Empleados por Departamento
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(stats.empleadosPorDepartamento).map(([depto, count]) => (
              <div key={depto} className="flex justify-between items-center">
                <span className="text-white/70 text-sm truncate">{depto || 'Sin departamento'}</span>
                <span className="text-white font-semibold bg-white/10 px-2 py-1 rounded-lg text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/20">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
            Equipos por Tipo
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.equiposPorTipo).map(([tipo, count]) => (
              <div key={tipo} className="flex justify-between items-center">
                <span className="text-white/70 text-sm">{tipo}</span>
                <span className="text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full text-xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas asignaciones */}
      <div className="glass-card p-6 rounded-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg flex items-center">
            <span className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse"></span>
            Últimas Asignaciones
          </h3>
          <span className="text-white/60 text-sm">
            {recentAsignaciones.length} registros recientes
          </span>
        </div>
        
        <div className="space-y-4">
          {recentAsignaciones.map((asignacion) => (
            <div key={asignacion.id} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-sm">🔄</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">
                  {asignacion.tipo} - {asignacion.marca}
                </p>
                <p className="text-white/60 text-sm">
                  Asignado a: {asignacion.empleado_nuevo_nombre}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  {new Date(asignacion.fecha_cambio).toLocaleDateString('es-ES')} • 
                  {new Date(asignacion.fecha_cambio).toLocaleTimeString('es-ES')}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs border border-green-500/30">
                  Completado
                </span>
              </div>
            </div>
          ))}
          
          {recentAsignaciones.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white/40 text-2xl">📋</span>
              </div>
              <p className="text-white/60">No hay asignaciones recientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard