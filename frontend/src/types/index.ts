// Tipos de Usuario
export interface User {
  id: string;
  email: string;
  full_name: string; // El backend devuelve full_name con guión bajo
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
}

// Tipos de Departamento
export interface Apartment {
  id: string;
  title: string;
  description: string;
  bedrooms: 1 | 2;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  address: string;
  city: string;
  country: string;
  squareMeters: number;
  amenities: string[];
  isAvailable: boolean;
  images?: ApartmentImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface ApartmentImage {
  id: string;
  apartmentId: string;
  imageUrl: string;
  isMain: boolean;
}

// Tipos de Reserva
export interface Booking {
  id: string;
  userId: string;
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  apartment?: Apartment;
  createdAt: string;
  updatedAt?: string;
}

// Tipos de Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}