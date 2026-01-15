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
  userId: string;

  
  @Column({ name: 'cart_token', nullable: true })
  cartToken?: string;

  @Column()
  status: string;

  @Column()
  paymentStatus: string;

  @Column({
    name: 'payment_method',
    default: 'STRIPE',
  })
  paymentMethod: 'STRIPE' | 'ZELLE';

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
