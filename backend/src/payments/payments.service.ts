import { Injectable, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

interface OrderItemInput {
  productId: string;
  quantity: number;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly stripeService: StripeService,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createPaymentIntent(
    items: OrderItemInput[],
    userId: string, 
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Items required');
    }

    let amount = 0;

    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(
          `Invalid product: ${item.productId}`,
        );
      }

      const price = Number(product.price);

      if (!price || price <= 0) {
        throw new BadRequestException(
          `Invalid price: ${product.price}`,
        );
      }

      amount += price * item.quantity * 100; 
    }

    if (amount < 50) {
      throw new BadRequestException(
        `Amount too small for Stripe: ${amount}`,
      );
    }

  

    return this.stripeService.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId,
        items: JSON.stringify(items),
      },
    });
  }
}
