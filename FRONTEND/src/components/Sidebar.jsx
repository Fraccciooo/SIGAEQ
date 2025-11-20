import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: '📊'
    },
  ]
  const navigation_2 = [
    { 
      name: 'Empleados', 
      href: '/empleados', 
      icon: '👥'
    },
  ]
  const navigation_3 = [
    { 
      name: 'Equipos', 
      href: '/equipos', 
      icon: '💻'
    },
  ]
  const navigation_4 = [
    { 
      name: 'Asignaciones', 
      href: '/asignaciones', 
      icon: '🔄'
    },
  ]

  return (
    <div className="w-64 corporate-sidebar min-h-screen bg-white border-r border-gray-200">
      <nav className="p-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center p-3 text-sm font-medium rounded-lg transition-colors my-1${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mr-3">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1">
          {navigation_2.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center p-3 text-sm font-medium rounded-lg transition-colors my-1${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mr-3">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1">
          {navigation_3.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center p-3 text-sm font-medium rounded-lg transition-colors my-1${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mr-3">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="space-y-1">
          {navigation_4.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center p-3 text-sm font-medium rounded-lg transition-colors my-1${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mr-3">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </div>


        {/* Información del sistema */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Sistema SIGAEQ
          </h3>
          <p className="text-blue-700 text-xs leading-relaxed">
            Gestión integral de equipos y empleados
          </p>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar