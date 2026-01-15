import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

import { StripeService } from './stripe.service';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Controller('payments')
export class PaymentsController {
  private stripe: Stripe;

  constructor(
    private readonly stripeService: StripeService,
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = this.stripeService.stripe;
  }

  /* ================= CART FLOW ================= */
  @UseGuards(AuthGuard('jwt'))
  @Post('create-intent')
  async createIntent(
    @Req() req: any,
    @Body() body: { orderId: string },
  ) {
    if (!body.orderId) {
      throw new BadRequestException('ORDER_ID_REQUIRED');
    }

    const intent =
      await this.paymentsService.createPaymentIntent(
        body.orderId,
        req.user.id,
      );

    return {
      clientSecret: intent.client_secret,
    };
  }

  /* ================= BUY NOW FLOW ================= */
  @UseGuards(AuthGuard('jwt'))
  @Post('create-intent-buy-now')
  async createIntentBuyNow(
    @Req() req: any,
    @Body() body: { productId: string; quantity?: number },
  ) {
    const userId = req.user.id;

    if (!body.productId) {
      throw new BadRequestException('PRODUCT_ID_REQUIRED');
    }

    const quantity = Number(body.quantity ?? 1);

    if (quantity < 1) {
      throw new BadRequestException('INVALID_QUANTITY');
    }

    const product = await this.productsService.findOneBySlug(
      body.productId,
    );

    if (!product) {
      throw new BadRequestException('PRODUCT_NOT_FOUND');
    }

    const order =
      await this.ordersService.createBuyNowOrder({
        userId,
        product,
        quantity,
      });

    const intent =
      await this.stripeService.stripe.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100),
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: order.id,
          userId: userId,
          buyNow: 'true',
        },
      });

    return {
      clientSecret: intent.client_secret,
    };
  }

  /* ================= STRIPE WEBHOOK ================= */
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
      console.error('❌ Stripe signature error', err);
      return res.status(400).send('Webhook Error');
    }

    if (event.type === 'payment_intent.succeeded') {
      console.log('🔥 payment_intent.succeeded received');

      const intent =
        event.data.object as Stripe.PaymentIntent;

      const orderId = intent.metadata?.orderId;

      if (!orderId) {
        console.error('❌ orderId missing in metadata');
        return res.json({ received: true });
      }

      await this.ordersService.markOrderPaid(
        orderId,
        intent.id,
      );
    }

    return res.json({ received: true });
  }
}
