import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const { apartmentId, checkIn, checkOut, guests, notes } = createBookingDto;

    // Validar fechas
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      throw new BadRequestException('La fecha de entrada no puede ser en el pasado');
    }

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('La fecha de salida debe ser posterior a la fecha de entrada');
    }

    // Verificar que el apartamento existe
    const { data: apartment, error: apartmentError } = await this.supabaseService
      .from('apartments')
      .select('*')
      .eq('id', apartmentId)
      .single();

    if (apartmentError || !apartment) {
      throw new NotFoundException('Departamento no encontrado');
    }

    if (!apartment.is_available) {
      throw new BadRequestException('El departamento no está disponible');
    }

    if (guests > apartment.max_guests) {
      throw new BadRequestException(
        `El departamento soporta máximo ${apartment.max_guests} huéspedes`,
      );
    }

    // Verificar disponibilidad
    const { data: conflictingBookings } = await this.supabaseService
      .from('bookings')
      .select('*')
      .eq('apartment_id', apartmentId)
      .in('status', ['pending', 'confirmed'])
      .or(`and(check_in.lte.${checkOut},check_out.gte.${checkIn})`);

    if (conflictingBookings && conflictingBookings.length > 0) {
      throw new BadRequestException('El departamento no está disponible en esas fechas');
    }

    // Calcular precio total
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * apartment.price_per_night;

    // Crear reserva
    const { data, error } = await this.supabaseService
      .from('bookings')
      .insert({
        user_id: userId,
        apartment_id: apartmentId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice,
        status: 'pending',
        notes,
        created_at: new Date().toISOString(),
      })
      .select(`
        *,
        apartments (
          id,
          title,
          bedrooms,
          price_per_night,
          address,
          city
        )
      `)
      .single();

    if (error) {
      this.logger.error('Error al crear reserva:', error);
      throw new BadRequestException('Error al crear reserva');
    }

    this.logger.log(`Reserva creada: ${data.id} por usuario: ${userId}`);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .from('bookings')
      .select(`
        *,
        users (
          id,
          email,
          full_name
        ),
        apartments (
          id,
          title,
          bedrooms,
          price_per_night
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Error al obtener reservas:', error);
      throw new Error('Error al obtener reservas');
    }

    return data;
  }

  async findOne(id: string, userId?: string) {
    const { data, error } = await this.supabaseService
      .from('bookings')
      .select(`
        *,
        users (
          id,
          email,
          full_name,
          phone
        ),
        apartments (
          *,
          images:apartment_images(image_url, is_main)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    // Si se proporciona userId, verificar que la reserva pertenece al usuario
    if (userId && data.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta reserva');
    }

    return data;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId?: string) {
    // Verificar que la reserva existe
    const booking = await this.findOne(id, userId);

    if (userId && booking.user_id !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar esta reserva');
    }

    const updateData: any = {};

    if (updateBookingDto.status) updateData.status = updateBookingDto.status;
    if (updateBookingDto.checkIn) updateData.check_in = updateBookingDto.checkIn;
    if (updateBookingDto.checkOut) updateData.check_out = updateBookingDto.checkOut;
    if (updateBookingDto.guests) updateData.guests = updateBookingDto.guests;
    if (updateBookingDto.notes) updateData.notes = updateBookingDto.notes;

    // Recalcular precio si cambian las fechas
    if (updateBookingDto.checkIn || updateBookingDto.checkOut) {
      const checkIn = new Date(updateBookingDto.checkIn || booking.check_in);
      const checkOut = new Date(updateBookingDto.checkOut || booking.check_out);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      const { data: apartment } = await this.supabaseService
        .from('apartments')
        .select('price_per_night')
        .eq('id', booking.apartment_id)
        .single();
      
      if (apartment) {
        updateData.total_price = nights * apartment.price_per_night;
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabaseService
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error('Error al actualizar reserva:', error);
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    this.logger.log(`Reserva actualizada: ${id}`);
    return data;
  }

  async cancel(id: string, userId: string) {
    const booking = await this.findOne(id, userId);

    if (booking.status === 'cancelled') {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    if (booking.status === 'completed') {
      throw new BadRequestException('No se puede cancelar una reserva completada');
    }

    return this.update(id, { status: 'cancelled' }, userId);
  }

  async remove(id: string) {
    const { error } = await this.supabaseService
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('Error al eliminar reserva:', error);
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return { message: 'Reserva eliminada exitosamente' };
  }
}