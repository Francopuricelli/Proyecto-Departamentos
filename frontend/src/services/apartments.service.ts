import apiClient from './api';
import { Apartment } from '../types';

export const apartmentsService = {
  async getAll(params?: {
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Apartment[]> {
    const response = await apiClient.get<Apartment[]>('/apartments', { params });
    return response.data;
  },

  async getById(id: string): Promise<Apartment> {
    const response = await apiClient.get<Apartment>(`/apartments/${id}`);
    return response.data;
  },

  async checkAvailability(
    id: string,
    checkIn: string,
    checkOut: string
  ): Promise<{ available: boolean; conflictingBookings: number }> {
    const response = await apiClient.get(`/apartments/${id}/availability`, {
      params: { checkIn, checkOut },
    });
    return response.data;
  },

  async create(data: Partial<Apartment>): Promise<Apartment> {
    const response = await apiClient.post<Apartment>('/apartments', data);
    return response.data;
  },

  async update(id: string, data: Partial<Apartment>): Promise<Apartment> {
    const response = await apiClient.patch<Apartment>(`/apartments/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/apartments/${id}`);
  },
};