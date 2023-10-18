// src/bookings/bookings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import {
  BookingFilterDto,
  ConfirmbookingDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './dtos/booking.dto';
import { MailingService } from './mailing.service';

// import { EmailService } from './emai.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly mail: MailingService,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<Booking> {
    return this.bookingRepository.findOneBy({ id });
  }

  async checkprice(createBookingDto: CreateBookingDto) {
    const totalPrice = await this.calculateBookingPrice(
      createBookingDto.roomType,
      createBookingDto.checkin,
      createBookingDto.checkout,
    );

    let booking_payload: Partial<Booking> = {
      ...createBookingDto,
      price: totalPrice,
    };
    return booking_payload;
  }

  async create(ConfirmbookingDto: ConfirmbookingDto): Promise<any> {
    let flag = 0;
    const len = await this.findroomtypes(
      ConfirmbookingDto.roomType,
      ConfirmbookingDto.checkin,
      ConfirmbookingDto.checkout,
    );
    const foundoverlap = await this.findOverlappingBooking(
      ConfirmbookingDto.roomno,
      ConfirmbookingDto.checkin,
      ConfirmbookingDto.checkout,
    );
    if (ConfirmbookingDto.roomType == 'A' && len > 1) {
      flag = 1;
    } else if (ConfirmbookingDto.roomType == 'B' && len > 2) {
      flag = 1;
    } else if (ConfirmbookingDto.roomType == 'C' && len > 4) {
      flag = 1;
    }
    if (flag == 1) {
      return 'All rooms of these type is booked!!!';
    } else if (foundoverlap) {
      return 'Room is already booked!!';
    } else {
      const booking = this.bookingRepository.create(ConfirmbookingDto);
      // await this.email.sendMail(createBookingDto.userEmail,createBookingDto)
      await this.bookingRepository.save(booking);
      // await this.mail.sendMail(ConfirmbookingDto.email,ConfirmbookingDto)
      const data = {
        status: 'true',
      };
      return data;
    }
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const data = await this.bookingRepository.findOneBy({ id });
    const totalPrice = await this.calculateBookingPrice(
      updateBookingDto.roomType,
      updateBookingDto.checkin,
      updateBookingDto.checkout,
    );

    Object.assign(data, updateBookingDto);
    data.price = totalPrice;

    return this.bookingRepository.save(data);
  }

  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }

  async findOverlappingBooking(
    roomnumber: string,
    start: Date,
    end: Date,
  ): Promise<Boolean> {
    console.log('Room: ', roomnumber);

    const overlappingBooking = await this.bookingRepository.findOne({
      where: [
        {
          roomno: roomnumber,
          checkin: Between(new Date(start), new Date(end)),
        },
        {
          roomno: roomnumber,
          checkout: Between(new Date(start), new Date(end)),
        },
        {
          roomno: roomnumber,
          checkin: LessThan(new Date(start)),
          checkout: MoreThan(new Date(end)),
        },
      ],
    });
    if (overlappingBooking) {
      return true;
    }
    return false;
  }
  async findroomtypes(type: string, start: Date, end: Date): Promise<number> {
    const count = await this.bookingRepository.find({
      where: [
        {
          roomType: type,
          checkin: new Date(start),
          checkout: new Date(end),
        },
      ],
    });
    console.log(count);
    return count.length;
  }
  async cancelBooking(id: number): Promise<number | null> {
    const booking = await this.bookingRepository.findOneBy({ id });

    if (!booking) {
      throw new Error('Booking not found!!!');
    }

    const currentTime = new Date();
    const startTime = new Date(booking.checkin);
    const timeDifference = startTime.getTime() - currentTime.getTime();

    if (timeDifference > 48 * 60 * 60 * 1000) {
      booking.isCancelled = true;
      booking.refundAmount = booking.price;
      await this.bookingRepository.save(booking);
      return booking.refundAmount;
    } else if (timeDifference >= 24 * 60 * 60 * 1000) {
      booking.isCancelled = true;
      booking.refundAmount = booking.price * 0.5;
      await this.bookingRepository.save(booking);
      return booking.refundAmount;
    } else {
      booking.isCancelled = true;
      booking.refundAmount = 0;
      await this.bookingRepository.save(booking);
      return 0;
    }
  }

  async calculateBookingPrice(
    type: string,
    startTime: Date,
    checkout: Date,
  ): Promise<number> {
    let pricePerHour = 0;
    if (type == 'A') {
      pricePerHour = 100;
    } else if (type == 'B') {
      pricePerHour = 80;
    } else if (type == 'C') {
      pricePerHour = 50;
    }

    const start = new Date(startTime);
    const end = new Date(checkout);
    const durationInHours =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalPrice = pricePerHour * durationInHours;

    return totalPrice;
  }

  async getFilteredBookings(filters: BookingFilterDto): Promise<Booking[]> {
    const query = this.bookingRepository.createQueryBuilder('booking');
    if (filters.roomno) {
      query.andWhere('booking.roomno = :roomNumber', {
        roomNumber: filters.roomno,
      });
    }
    if (filters.roomType) {
      query.andWhere('booking.roomType = :roomType', {
        roomType: filters.roomType,
      });
    }
    if (filters.checkin) {
      query.andWhere('booking.checkin >= :checkin', {
        startTime: filters.checkin,
      });
    }
    if (filters.checkout) {
      query.andWhere('booking.checkout <= :checkout', {
        checkout: filters.checkout,
      });
    }
    return query.getMany();
  }
}
