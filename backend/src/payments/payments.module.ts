import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from '../orders/orders.module'; // ✅ IMPORT

@Module({
  imports: [
    ConfigModule,
    OrdersModule, // ✅ THIS FIXES THE ERROR
  ],
  controllers: [PaymentsController],
  providers: [StripeService],
})
export class PaymentsModule {}
