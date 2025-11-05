import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApartmentDto {
  @ApiProperty({
    description: 'Título del departamento',
    example: 'Departamento moderno en Palermo',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del departamento',
    example: 'Hermoso departamento con vista a la ciudad...',
  })
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string;

  @ApiProperty({
    description: 'Número de dormitorios (1 o 2)',
    example: 2,
  })
  @IsNumber()
  @IsIn([1, 2], { message: 'Los dormitorios deben ser 1 o 2' })
  bedrooms: number;

  @ApiProperty({
    description: 'Número de baños',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  bathrooms: number;

  @ApiProperty({
    description: 'Capacidad máxima de personas',
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  maxGuests: number;

  @ApiProperty({
    description: 'Precio por noche en pesos argentinos',
    example: 15000,
  })
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ApiProperty({
    description: 'Dirección del departamento',
    example: 'Av. Santa Fe 1234, CABA',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  address: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Buenos Aires',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'País',
    example: 'Argentina',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country: string;

  @ApiProperty({
    description: 'Metros cuadrados',
    example: 65,
  })
  @IsNumber()
  @Min(1)
  squareMeters: number;

  @ApiProperty({
    description: 'Amenities disponibles',
    example: ['wifi', 'aire_acondicionado', 'cocina', 'tv'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @ApiProperty({
    description: 'URLs de imágenes del departamento',
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Disponibilidad del departamento',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class UpdateApartmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsIn([1, 2])
  bedrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  bathrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxGuests?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerNight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  squareMeters?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}