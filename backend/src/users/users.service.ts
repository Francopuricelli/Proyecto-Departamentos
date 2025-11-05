import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService
      .from('users')
      .select('id, email, full_name, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Error al obtener usuarios:', error);
      throw new Error('Error al obtener usuarios');
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .from('users')
      .select('id, email, full_name, phone, role, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { data, error } = await this.supabaseService
      .from('users')
      .update({
        full_name: updateUserDto.fullName,
        phone: updateUserDto.phone,
        email: updateUserDto.email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error('Error al actualizar usuario:', error);
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabaseService
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('Error al eliminar usuario:', error);
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return { message: 'Usuario eliminado exitosamente' };
  }

  async getUserBookings(userId: string) {
    const { data, error } = await this.supabaseService
      .from('bookings')
      .select(`
        *,
        apartments (
          id,
          title,
          bedrooms,
          price_per_night,
          images:apartment_images(image_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Error al obtener reservas del usuario:', error);
      throw new Error('Error al obtener reservas');
    }

    return data;
  }
}