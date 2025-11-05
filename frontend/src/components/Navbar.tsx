import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition">
            <Building2 size={28} />
            <span className="text-xl font-bold">Departamentos</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/apartments"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Departamentos
            </Link>

            {isAuthenticated ? (
              <>
                {/* Temporalmente deshabilitado hasta crear las páginas
                <Link
                  to="/bookings"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <Calendar size={18} />
                  <span>Mis Reservas</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  <User size={18} />
                  <span>{user?.full_name || 'Perfil'}</span>
                </Link>
                */}

                <span className="text-gray-700 font-medium">
                  Hola, {user?.full_name || 'Usuario'}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition font-medium"
                >
                  <LogOut size={18} />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
