import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  /* =========================
     EXISTING (UNCHANGED)
     ========================= */

  @Post('items')
  async addItem(
    @Body('cartToken') cartToken: string,
    @Body('productId') productId: string,
    @Body('quantity') quantity = '1',
    @Body('unitPrice') unitPrice: number,
  ) {
    return this.cartService.addItem(
      cartToken,
      productId,
      Number(quantity),
      unitPrice,
    );
  }

  @Get()
  async getCart(@Query('cartToken') cartToken: string) {
    return this.cartService.getCart(cartToken);
  }

  @Patch('items/:id/increase')
  increase(@Param('id') id: string) {
    return this.cartService.increaseItemQuantity(id);
  }

  @Patch('items/:id/decrease')
  decrease(@Param('id') id: string) {
    return this.cartService.decreaseItemQuantity(id);
  }

  /* =========================
     ✅ NEW (HTTP SAFE)
     Clear cart after payment
     ========================= */

  @Delete('clear')
  async clearCart(@Req() req: any, @Query('cartToken') cartToken?: string) {
    const token =
      cartToken ||
      req.headers['x-cart-token'];

    if (!token) {
      return { cleared: false };
    }

    await this.cartService.clearCartByToken(token);
    return { cleared: true };
  }
}
