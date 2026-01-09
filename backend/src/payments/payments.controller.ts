import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { AuthGuard } from '@nestjs/passport';

interface OrderItemInput {
  productId: string;
  quantity: number;
}

@Controller('payments')
export class PaymentsController {
  private stripe: Stripe;

  constructor(
    private readonly stripeService: StripeService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = this.stripeService.stripe;
  }

  
  @UseGuards(AuthGuard('jwt'))
  @Post('create-intent')
  async createIntent(
    @Req() req: any,
    @Body('items') items: OrderItemInput[],
  ) {
    const userId = req.user.id;

   
    const intent =
      await this.paymentsService.createPaymentIntent(
        items,
        userId,
      );

    return {
      clientSecret: intent.client_secret,
    };
  }

  
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const signature = req.headers[
      'stripe-signature'
    ] as string;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        (req as any).rawBody,
        signature,
        this.configService.get<string>(
          'STRIPE_WEBHOOK_SECRET',
        )!,
      );
    } catch (err) {
      console.error(
        '❌ Stripe webhook signature verification failed',
      );
      return res.status(400).send('Webhook Error');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent =
        event.data.object as Stripe.PaymentIntent;

      const userId = intent.metadata.userId;
      const items: OrderItemInput[] = JSON.parse(
        intent.metadata.items || '[]',
      );

      await this.ordersService.createFromStripe(
        intent.id,
        userId,
        items,
      );

      console.log(
       
        userId,
      );
    }

    return res.json({ received: true });
  }
}
