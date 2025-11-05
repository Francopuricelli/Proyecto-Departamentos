import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto, UpdateApartmentDto } from './dto/apartment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear nuevo departamento (Admin)' })
  @ApiResponse({ status: 201, description: 'Departamento creado' })
  create(@Body() createApartmentDto: CreateApartmentDto) {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los departamentos disponibles' })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number, description: 'Filtrar por número de dormitorios (1 o 2)' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Precio mínimo por noche' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Precio máximo por noche' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos' })
  findAll(
    @Query('bedrooms', new ParseIntPipe({ optional: true })) bedrooms?: number,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
  ) {
    return this.apartmentsService.findAll(bedrooms, minPrice, maxPrice);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener departamento por ID' })
  @ApiResponse({ status: 200, description: 'Departamento encontrado' })
  @ApiResponse({ status: 404, description: 'Departamento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.apartmentsService.findOne(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Verificar disponibilidad de departamento' })
  @ApiQuery({ name: 'checkIn', required: true, type: String, description: 'Fecha de entrada (YYYY-MM-DD)' })
  @ApiQuery({ name: 'checkOut', required: true, type: String, description: 'Fecha de salida (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Disponibilidad verificada' })
  checkAvailability(
    @Param('id') id: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.apartmentsService.checkAvailability(id, checkIn, checkOut);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar departamento (Admin)' })
  @ApiResponse({ status: 200, description: 'Departamento actualizado' })
  update(@Param('id') id: string, @Body() updateApartmentDto: UpdateApartmentDto) {
    return this.apartmentsService.update(id, updateApartmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar departamento (Admin)' })
  @ApiResponse({ status: 200, description: 'Departamento eliminado' })
  remove(@Param('id') id: string) {
    return this.apartmentsService.remove(id);
  }
}