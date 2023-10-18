// src/common/middleware/check-booking-overlap.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class CheckBookingOverlapMiddleware implements NestMiddleware {
  constructor(private readonly bookingsService: BookingsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { roomId, startTime, endTime } = req.body;

    // Check for overlapping bookings
    const overlappingBooking = await this.bookingsService.findOverlappingBooking(roomId, startTime, endTime);

    if (overlappingBooking) {
      // Return a response indicating the overlap or throw an exception
      res.status(400).json({ message: 'Overlapping booking found' });
    } else {
      // No overlap, continue with the request
      next();
    }
  }
}
