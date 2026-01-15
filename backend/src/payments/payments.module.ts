import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';

import { Order } from '../orders/order.entity';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), // ✅ needed by PaymentsService
    OrdersModule,                      // ✅ needed by controller + webhook
    ProductsModule,                    // ✅ needed by Buy Now flow
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripeService,
  ],
})
export class PaymentsModule {}
