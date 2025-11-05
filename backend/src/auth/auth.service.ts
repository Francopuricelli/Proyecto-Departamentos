import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, phone } = registerDto;

    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await this.supabaseService
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario en Supabase
      const { data: user, error } = await this.supabaseService
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          full_name: fullName,
          phone,
          role: 'user',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Error al crear usuario:', error);
        throw new ConflictException('Error al crear usuario');
      }

      // Generar token JWT
      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      this.logger.log(`Usuario registrado exitosamente: ${email}`);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error en registro:', error);
      throw new ConflictException('Error al registrar usuario');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Buscar usuario
      const { data: user, error } = await this.supabaseService
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar token JWT
      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      this.logger.log(`Usuario autenticado exitosamente: ${email}`);

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Error en login:', error);
      throw new UnauthorizedException('Error al iniciar sesión');
    }
  }

  async validateUser(userId: string) {
    const { data: user } = await this.supabaseService
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single();

    return user;
  }
}