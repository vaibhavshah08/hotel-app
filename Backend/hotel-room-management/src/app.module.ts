import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings/booking.entity';
import { ConfigModule } from '@nestjs/config';
import { CheckBookingOverlapMiddleware } from './middlewares/check-booking-overlap.middleware';
import { MailingService } from './bookings/mailing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRoot(
    {
    type: 'postgres',
    host: 'localhost',
    port: 9301,
    username: 'vaibhav_shah',
    password: 'shah@9301',
    database: 'example_1', // Replace with your database name
    entities: [Booking,],
    synchronize: true,

  }),
    BookingsModule,TypeOrmModule.forFeature([Booking])],
  controllers: [AppController,],
  providers: [AppService, MailingService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckBookingOverlapMiddleware).forRoutes('bookings/create');
  }
}
