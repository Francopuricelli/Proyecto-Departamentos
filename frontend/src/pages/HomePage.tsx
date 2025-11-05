import { Link } from 'react-router-dom';
import { Building2, Key, MapPin, Shield } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-6 rounded-full shadow-lg">
              <Building2 size={60} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Encuentra tu Departamento Ideal
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Sistema de reservas de departamentos. Encuentra y reserva el espacio perfecto para ti.
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              to="/apartments"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg"
            >
              Ver Departamentos
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold text-lg shadow-lg border-2 border-blue-600"
            >
              Registrarse
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Key size={32} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Reserva Fácil
            </h3>
            <p className="text-gray-600">
              Sistema de reservas intuitivo y rápido. Reserva tu departamento en minutos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <MapPin size={32} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ubicaciones Premium
            </h3>
            <p className="text-gray-600">
              Departamentos en las mejores ubicaciones, cerca de todo lo que necesitas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Shield size={32} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Seguro y Confiable
            </h3>
            <p className="text-gray-600">
              Tus datos están protegidos. Sistema de autenticación seguro.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
            <div className="text-gray-600 font-medium">Tipos de Departamentos</div>
            <p className="text-sm text-gray-500 mt-2">1 y 2 dormitorios disponibles</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Reservas Disponibles</div>
            <p className="text-sm text-gray-500 mt-2">Reserva en cualquier momento</p>
          </div>
        </div>
      </div>
    </div>
  );
};
