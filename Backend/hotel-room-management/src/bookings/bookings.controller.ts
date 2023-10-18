// src/bookings/bookings.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BookingFilterDto, ConfirmbookingDto, CreateBookingDto, UpdateBookingDto } from './dtos/booking.dto';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/all')
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bookingsService.findOne(id);
  }

  @Post('/checkprice')
  async checkprice(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.checkprice(createBookingDto);
    return booking;
  }

  @Post()
  async create(@Body() ConfirmbookingDto: ConfirmbookingDto) {
    const booking = await this.bookingsService.create(ConfirmbookingDto);
    return booking;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const user = await this.bookingsService.findOne(id)

    if (user === null) {
      return { message: 'Booking not found' };
    } else {
      const refundAmount = await this.bookingsService.cancelBooking(id);
      return { message: 'Booking cancelled!! ', refundAmount };
    }
  }

  @Get()
  async viewBookings(@Query() filters: BookingFilterDto) {
    const filteredBookings = await this.bookingsService.getFilteredBookings(filters);
    return filteredBookings;
  }
}
