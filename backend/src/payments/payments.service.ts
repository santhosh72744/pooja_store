import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';


@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  async createPaymentIntent(amount: number) {
    return this.stripeService.stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }
}
