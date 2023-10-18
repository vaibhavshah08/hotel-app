import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  checkin: Date;

  @Column()
  checkout: Date;

  @Column()
  roomType: string;

  @Column()
  roomno: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Exclude()
  @Column({ default: false }) // Add the 'isCancelled' property with a default value of false
  isCancelled: boolean;

  @Exclude()
  @Column({ type: 'float', default: 0 }) // Add the 'refundAmount' property with a default value of 0
  refundAmount: number;
}
