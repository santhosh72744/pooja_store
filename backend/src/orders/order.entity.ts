import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string; // ✅ REQUIRED now

  @Column()
  status: string;

  @Column()
  paymentStatus: string;

  @Column('decimal')
  totalAmount: number;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: 'jsonb', nullable: true })
  shippingAddress: any;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}
