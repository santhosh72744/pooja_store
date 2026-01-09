import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';

import { Product } from '../products/product.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), 
    OrdersModule,                        
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,  
    StripeService,
  ],
})
export class PaymentsModule {}
