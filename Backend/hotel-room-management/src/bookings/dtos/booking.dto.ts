// src/bookings/booking.dto.ts
import { IsDate, IsDateString, IsEmail, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateBookingDto {
    @IsEmail()
  email: string;

  
  @IsDateString()
  checkin: Date;
  
  @IsDateString()
  checkout: Date;
  
  @IsNotEmpty()
  roomType: string;  // The ID of the room being booked

  @IsNotEmpty()
  @IsString()
  roomno: string;
}
export class ConfirmbookingDto {
  @IsEmail()
email: string;


@IsDateString()
checkin: Date;

@IsDateString()
checkout: Date;

@IsNotEmpty()
roomType: string;  // The ID of the room being booked

@IsNotEmpty()
@IsString()
roomno: string;

@IsNumber()
  price: number;
}
  
  export class UpdateBookingDto {

    @IsEmail()
    email: string;
  
    
    @IsDateString()
    checkin: Date;
    
    @IsDateString()
    checkout: Date;
    
    @IsNotEmpty()
    roomType: string;  // The ID of the room being booked
  
    @IsNotEmpty()
    @IsString()
    roomno: string;
  }

  export class BookingFilterDto {
    @IsOptional()
    @IsNotEmpty()
    roomno: string;
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    roomType: string;
  
    @IsOptional()
    @IsDate()
    checkin: Date;
  
    @IsOptional()
    @IsDate()
    checkout: Date;
  }
  