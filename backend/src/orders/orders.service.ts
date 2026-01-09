import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  
  async createFromStripe(
    paymentIntentId: string,
    amount: number,
    userId: string,
    items: any[],
  ) {
    return this.ordersRepository.save({
      userId,
      totalAmount: amount,
      paymentStatus: 'PAID',
      status: 'PAID',
      stripePaymentIntentId: paymentIntentId,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  
  async findByUser(userId: string) {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items'], 
      order: { createdAt: 'DESC' },
    });
  }
}
