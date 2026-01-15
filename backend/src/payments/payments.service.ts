import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/order.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly stripeService: StripeService,

    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async createPaymentIntent(orderId: string, userId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new BadRequestException('ORDER_NOT_FOUND');
    }

    const intent =
      await this.stripeService.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100),
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: order.id,      // ✅ REQUIRED
          userId: userId,         // ✅ REQUIRED
          cart: 'true',           // ✅ IDENTIFIER
        },
      });

    return intent;
  }
}
