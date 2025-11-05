import apiClient from './api';
import { Booking } from '../types';

interface CreateBookingData {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes?: string;
}

export const bookingsService = {
  async getAll(): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>('/bookings');
    return response.data;
  },

  async getById(id: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await apiClient.get<Booking[]>('/users/me/bookings');
    return response.data;
  },

  async create(data: CreateBookingData): Promise<Booking> {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data;
  },

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    const response = await apiClient.patch<Booking>(`/bookings/${id}`, data);
    return response.data;
  },

  async cancel(id: string): Promise<Booking> {
    const response = await apiClient.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/bookings/${id}`);
  },
};