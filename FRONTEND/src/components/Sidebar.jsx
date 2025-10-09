import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: '📊',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Empleados', 
      href: '/empleados', 
      icon: '👥',
      gradient: 'from-green-500 to-teal-500'
    },
    { 
      name: 'Equipos', 
      href: '/equipos', 
      icon: '💻',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Asignaciones', 
      href: '/asignaciones', 
      icon: '🔄',
      gradient: 'from-orange-500 to-red-500'
    },
  ]

  return (
    <div className="w-80 glass-nav h-[calc(100vh-4rem)]">
      <nav className="p-6">
        <div className="space-y-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center p-4 text-sm font-semibold rounded-2xl transition-all duration-300 hover-lift ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className={`text-xl mr-4 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-white/70'
                }`}>
                  {item.icon}
                </span>
                {item.name}
                
                {/* Indicador activo */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Sección de información */}
        <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20">
          <h3 className="text-white font-semibold text-sm mb-2">Sistema SIGAEQ</h3>
          <p className="text-white/60 text-xs">
            Gestión integral de equipos y empleados de la Fundación Compañía Nacional de Música
          </p>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar