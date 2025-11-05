import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o fechas no disponibles' })
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.sub, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservas (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de todas las reservas' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reserva por ID' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reserva' })
  @ApiResponse({ status: 200, description: 'Reserva actualizada' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user.sub);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar reserva' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada' })
  @ApiResponse({ status: 400, description: 'No se puede cancelar la reserva' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancel(id, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reserva (Admin)' })
  @ApiResponse({ status: 200, description: 'Reserva eliminada' })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}