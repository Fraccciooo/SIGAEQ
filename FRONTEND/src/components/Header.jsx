import React from 'react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="corporate-nav">
      <div className="max-w-7xl mx-absolute px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-white">
                  SIGAEQ
                </h1>
                <p className="text-blue-200 text-xs">
                  Sistema Integral
                </p>
              </div>
            </div>
          </div>
          
          {/* Información del usuario */}
          <div className=" items-center space-x-4">
            {user && (
              <>
                {/* Información del usuario */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {user.nombre} {user.apellido}
                    </p>
                    <span className="text-blue-200 text-xs">
                      {user.rol}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-blue-300">
                    <span className="text-blue-600 font-semibold text-xs">
                      {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Botón de cerrar sesión */}
                <button
                  onClick={logout}
                  className="corporate-btn-secondary text-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header