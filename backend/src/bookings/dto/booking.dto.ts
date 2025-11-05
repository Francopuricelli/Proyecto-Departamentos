import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsIn,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID del departamento a reservar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  apartmentId: string;

  @ApiProperty({
    description: 'Fecha de entrada (YYYY-MM-DD)',
    example: '2024-12-20',
  })
  @IsDateString()
  checkIn: string;

  @ApiProperty({
    description: 'Fecha de salida (YYYY-MM-DD)',
    example: '2024-12-27',
  })
  @IsDateString()
  checkOut: string;

  @ApiProperty({
    description: 'Número de huéspedes',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  guests: number;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Llegada tarde, aproximadamente 11 PM',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingDto {
  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  guests?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}