import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateApartmentDto, UpdateApartmentDto } from './dto/apartment.dto';

@Injectable()
export class ApartmentsService {
  private readonly logger = new Logger(ApartmentsService.name);

  constructor(private supabaseService: SupabaseService) {}

  async create(createApartmentDto: CreateApartmentDto) {
    const {
      title,
      description,
      bedrooms,
      bathrooms,
      maxGuests,
      pricePerNight,
      address,
      city,
      country,
      squareMeters,
      amenities,
      images,
      isAvailable,
    } = createApartmentDto;

    try {
      // Crear apartamento
      const { data: apartment, error: apartmentError } = await this.supabaseService
        .from('apartments')
        .insert({
          title,
          description,
          bedrooms,
          bathrooms,
          max_guests: maxGuests,
          price_per_night: pricePerNight,
          address,
          city,
          country,
          square_meters: squareMeters,
          amenities,
          is_available: isAvailable ?? true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (apartmentError) {
        this.logger.error('Error al crear apartamento:', apartmentError);
        throw new BadRequestException('Error al crear apartamento');
      }

      // Si hay imágenes, insertarlas
      if (images && images.length > 0) {
        const imageRecords = images.map((url, index) => ({
          apartment_id: apartment.id,
          image_url: url,
          is_main: index === 0,
        }));

        const { error: imagesError } = await this.supabaseService
          .from('apartment_images')
          .insert(imageRecords);

        if (imagesError) {
          this.logger.error('Error al insertar imágenes:', imagesError);
        }
      }

      this.logger.log(`Apartamento creado: ${apartment.id}`);
      return apartment;
    } catch (error) {
      this.logger.error('Error en create:', error);
      throw error;
    }
  }

  async findAll(bedrooms?: number, minPrice?: number, maxPrice?: number) {
    let query = this.supabaseService
      .from('apartments')
      .select(`
        *,
        images:apartment_images(image_url, is_main)
      `)
      .eq('is_available', true);

    if (bedrooms) {
      query = query.eq('bedrooms', bedrooms);
    }

    if (minPrice) {
      query = query.gte('price_per_night', minPrice);
    }

    if (maxPrice) {
      query = query.lte('price_per_night', maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Error al obtener apartamentos:', error);
      throw new Error('Error al obtener apartamentos');
    }

    // Mapear snake_case a camelCase
    return data.map(apt => this.mapApartmentToCamelCase(apt));
  }

  private mapApartmentToCamelCase(apartment: any) {
    return {
      id: apartment.id,
      title: apartment.title,
      description: apartment.description,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      maxGuests: apartment.max_guests,
      pricePerNight: apartment.price_per_night,
      address: apartment.address,
      city: apartment.city,
      country: apartment.country,
      squareMeters: apartment.square_meters,
      amenities: apartment.amenities,
      isAvailable: apartment.is_available,
      createdAt: apartment.created_at,
      updatedAt: apartment.updated_at,
      images: apartment.images?.map((img: any) => ({
        imageUrl: img.image_url,
        isMain: img.is_main,
      })) || [],
    };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .from('apartments')
      .select(`
        *,
        images:apartment_images(image_url, is_main)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Apartamento con ID ${id} no encontrado`);
    }

    return this.mapApartmentToCamelCase(data);
  }

  async update(id: string, updateApartmentDto: UpdateApartmentDto) {
    const updateData: any = {};

    if (updateApartmentDto.title) updateData.title = updateApartmentDto.title;
    if (updateApartmentDto.description) updateData.description = updateApartmentDto.description;
    if (updateApartmentDto.bedrooms) updateData.bedrooms = updateApartmentDto.bedrooms;
    if (updateApartmentDto.bathrooms) updateData.bathrooms = updateApartmentDto.bathrooms;
    if (updateApartmentDto.maxGuests) updateData.max_guests = updateApartmentDto.maxGuests;
    if (updateApartmentDto.pricePerNight) updateData.price_per_night = updateApartmentDto.pricePerNight;
    if (updateApartmentDto.address) updateData.address = updateApartmentDto.address;
    if (updateApartmentDto.city) updateData.city = updateApartmentDto.city;
    if (updateApartmentDto.country) updateData.country = updateApartmentDto.country;
    if (updateApartmentDto.squareMeters) updateData.square_meters = updateApartmentDto.squareMeters;
    if (updateApartmentDto.amenities) updateData.amenities = updateApartmentDto.amenities;
    if (updateApartmentDto.isAvailable !== undefined) updateData.is_available = updateApartmentDto.isAvailable;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabaseService
      .from('apartments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error('Error al actualizar apartamento:', error);
      throw new NotFoundException(`Apartamento con ID ${id} no encontrado`);
    }

    return data;
  }

  async remove(id: string) {
    // Primero eliminar imágenes asociadas
    await this.supabaseService
      .from('apartment_images')
      .delete()
      .eq('apartment_id', id);

    const { error } = await this.supabaseService
      .from('apartments')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('Error al eliminar apartamento:', error);
      throw new NotFoundException(`Apartamento con ID ${id} no encontrado`);
    }

    return { message: 'Apartamento eliminado exitosamente' };
  }

  async checkAvailability(apartmentId: string, checkIn: string, checkOut: string) {
    // Verificar si hay reservas en ese rango de fechas
    const { data, error } = await this.supabaseService
      .from('bookings')
      .select('*')
      .eq('apartment_id', apartmentId)
      .in('status', ['pending', 'confirmed'])
      .or(`and(check_in.lte.${checkOut},check_out.gte.${checkIn})`);

    if (error) {
      this.logger.error('Error al verificar disponibilidad:', error);
      throw new Error('Error al verificar disponibilidad');
    }

    return {
      available: !data || data.length === 0,
      conflictingBookings: data?.length || 0,
    };
  }
}