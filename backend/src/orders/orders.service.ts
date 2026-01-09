import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

enum OrderStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

interface OrderItemInput {
  productId: string;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createFromStripe(
    paymentIntentId: string,
    userId: string,
    items: OrderItemInput[],
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    const productIds = items.map((i) => i.productId);

    const products = await this.productsRepository.find({
      where: { id: In(productIds) },
    });

    if (products.length !== items.length) {
      throw new BadRequestException('Invalid product in order');
    }

    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new BadRequestException(
          `Product not found: ${item.productId}`,
        );
      }

      totalAmount += product.price * item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '', // ✅ string only
        quantity: item.quantity,
        price: product.price,
      };
    });

    return this.ordersRepository.save({
      userId,
      totalAmount,
      paymentStatus: OrderStatus.PAID,
      status: OrderStatus.PAID,
      stripePaymentIntentId: paymentIntentId,
      items: orderItems,
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
