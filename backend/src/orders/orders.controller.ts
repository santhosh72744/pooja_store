import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Get('my')
  async getMyOrders(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.ordersService.findByUser(user.id);
  }
}
