import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts') // ✅ IMPORTANT
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartToken: string;

  @Column({ nullable: true })
  userId: string;

  @OneToMany(() => CartItem, item => item.cart)
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
