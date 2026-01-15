import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { Param } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

 
  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getMyOrders(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.ordersService.findByUser(user.id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('create-from-cart')
  async createFromCart(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.ordersService.createFromCart(user.id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  async checkout(
    @Req() req: Request,
    @Body() body: { address: any; cartToken: string },
  ) {
    const user = req.user as { id: string };

    return this.ordersService.checkout(
      user.id,
      body.cartToken,
      body.address,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('zelle')
  async createZelleOrder(
    @Req() req: Request,
    @Body() body: any,
  ) {
    const user = req.user as { id: string };
    return this.ordersService.createZelleOrder(user, body);
  }

  @UseGuards(AuthGuard('jwt'))
@Post('admin/:id/mark-zelle-paid')
async markZelleOrderPaid(
  @Req() req: Request,
  @Param('id') orderId: string,
) {
  const user = req.user as { id: string; isAdmin: boolean };

  if (!user.isAdmin) {
    throw new ForbiddenException('Admin access only');
  }

  return this.ordersService.markZelleOrderPaid(orderId);
}

}
