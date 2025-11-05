import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apartmentsService } from '../services/apartments.service';
import type { Apartment } from '../types';
import { Building2, Bed, Users, DollarSign, MapPin } from 'lucide-react';

export const ApartmentsPage = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Convert string filters to numbers
      const queryFilters: {
        bedrooms?: number;
        minPrice?: number;
        maxPrice?: number;
      } = {};
      
      if (filters.bedrooms) queryFilters.bedrooms = parseInt(filters.bedrooms);
      if (filters.minPrice) queryFilters.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) queryFilters.maxPrice = parseFloat(filters.maxPrice);
      
      const data = await apartmentsService.getAll(queryFilters);
      setApartments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    loadApartments();
  };

  const handleResetFilters = () => {
    setFilters({
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
    });
    setTimeout(() => loadApartments(), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Cargando departamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Departamentos Disponibles
          </h1>
          <p className="text-gray-600">
            Encuentra el departamento perfecto para ti
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Bedrooms Filter */}
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Dormitorios
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="1">1 Dormitorio</option>
                <option value="2">2 Dormitorios</option>
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Mínimo
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="$ 0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Máximo
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="$ 10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Aplicar
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Apartments Grid */}
        {apartments.length === 0 ? (
          <div className="text-center py-16">
            <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No se encontraron departamentos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <Link
                key={apartment.id}
                to={`/apartments/${apartment.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {apartment.images && apartment.images.length > 0 ? (
                    <img
                      src={apartment.images.find((img) => img.isMain)?.imageUrl || apartment.images[0].imageUrl}
                      alt={apartment.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={48} className="text-gray-400" />
                    </div>
                  )}
                  {apartment.isAvailable ? (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Disponible
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      No Disponible
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {apartment.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">
                      {apartment.city}, {apartment.country}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {apartment.description}
                  </p>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                    <div className="flex items-center">
                      <Bed size={18} className="mr-1 text-blue-600" />
                      <span>{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Dorm' : 'Dorms'}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={18} className="mr-1 text-blue-600" />
                      <span>{apartment.maxGuests} Personas</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 size={18} className="mr-1 text-blue-600" />
                      <span>{apartment.squareMeters}m²</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-blue-600 font-bold text-xl">
                      <DollarSign size={20} />
                      <span>{apartment.pricePerNight}</span>
                    </div>
                    <span className="text-gray-500 text-sm">por noche</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
