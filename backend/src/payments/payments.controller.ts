import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { OrdersService } from '../orders/orders.service';

@Controller('payments')
export class PaymentsController {
  private stripe: Stripe;

  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {
    this.stripe = this.stripeService.stripe;
  }


  @Post('create-intent')
  async createIntent(
    @Body('amount') amount: number,
    @Body('userId') userId: string,
    @Body('items') items: any[],
  ) {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },

     
      metadata: {
        userId,
        items: JSON.stringify(items),
      },
    });

    return { clientSecret: intent.client_secret };
  }

 
  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const signature = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
      );
    } catch (err) {
      console.error('Webhook signature verification failed');
      return res.status(400).send('Webhook Error');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;

      const userId = intent.metadata.userId;
      const amount = intent.amount_received;
      const items = JSON.parse(intent.metadata.items || '[]');

      await this.ordersService.createFromStripe(
        intent.id,
        amount,
        userId,
        items,
      );

      console.log('Order + items saved for user:', userId);
    }

    return res.json({ received: true });
  }
}
