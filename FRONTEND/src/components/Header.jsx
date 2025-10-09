import React from 'react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  const forceLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const getRoleColor = (rol) => {
    switch(rol) {
      case 'Administrador': return 'from-purple-500 to-pink-500';
      case 'Jefe Departamento': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-teal-500';
    }
  }

  return (
    <header className="glass-nav shadow-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  SIGAEQ
                </h1>
                <p className="text-xs text-blue-100 opacity-80">
                  Sistema Integral
                </p>
              </div>
            </div>
          </div>
          
          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Tarjeta de usuario */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {user.nombre} {user.apellido}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRoleColor(user.rol)} text-white shadow-lg`}>
                      {user.rol}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/30">
                    <span className="text-white font-semibold text-sm">
                      {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 border border-white/30 hover:border-white/50 font-medium text-sm"
                  >
                    Cerrar Sesión
                  </button>
                  <button
                    onClick={forceLogout}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-xl transition-all duration-300 border border-red-400/30 hover:border-red-400/50 font-medium text-sm"
                    title="Forzar logout completo"
                  >
                    🔒
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header