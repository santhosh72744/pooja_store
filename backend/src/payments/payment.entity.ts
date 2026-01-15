import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  stripePaymentIntentId: string;

  @Column()
  amount: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
