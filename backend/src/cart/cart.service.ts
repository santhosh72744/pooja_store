import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly itemRepo: Repository<CartItem>,
  ) {}

  /* =========================
     CART TOKEN BASED (existing)
     ========================= */

  async getOrCreateCart(cartToken: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { cartToken } });

    if (!cart) {
      cart = this.cartRepo.create({ cartToken });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addItem(
    cartToken: string,
    productId: string,
    quantity = 1,
    unitPrice: number,
  ) {
    const cart = await this.getOrCreateCart(cartToken);

    let item = await this.itemRepo.findOne({
      where: { cartId: cart.id, productId },
    });

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.itemRepo.create({
        cartId: cart.id,
        productId,
        quantity,
        unitPrice,
      });
    }

    await this.itemRepo.save(item);
    return this.getCart(cartToken);
  }

  async getCart(cartToken: string) {
    await this.getOrCreateCart(cartToken);
    return this.cartRepo.findOne({
      where: { cartToken },
      relations: ['items', 'items.product'],
    });
  }

  /* =========================
     USER BASED (existing)
     ========================= */

  async getCartByUser(userId: string) {
    return this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  /* =========================
     ITEM OPERATIONS (existing)
     ========================= */

  async increaseItemQuantity(itemId: string, delta = 1) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return null;

    item.quantity += delta;
    await this.itemRepo.save(item);

    return this.getCartWithItemsById(item.cartId);
  }

  async decreaseItemQuantity(itemId: string, delta = 1) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return null;

    item.quantity -= delta;

    if (item.quantity <= 0) {
      const cartId = item.cartId;
      await this.itemRepo.remove(item);
      return this.getCartWithItemsById(cartId);
    }

    await this.itemRepo.save(item);
    return this.getCartWithItemsById(item.cartId);
  }

  async removeItem(itemId: string) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) return null;

    const cartId = item.cartId;
    await this.itemRepo.remove(item);
    return this.getCartWithItemsById(cartId);
  }

  /* =========================
     CART CLEARING
     ========================= */

  async clearCartByUser(userId: string) {
    const cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart || !cart.items?.length) return;

    await this.itemRepo.remove(cart.items);
  }

  async clearCartByToken(cartToken: string) {
    const cart = await this.cartRepo.findOne({
      where: { cartToken },
      relations: ['items'], // IMPORTANT
    });

    if (!cart) return;

    // remove cart -> DB cascade deletes cart_items
    await this.cartRepo.remove(cart);
  }

  /* =========================
     HELPERS
     ========================= */

  private async getCartWithItemsById(cartId: string) {
    return this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }
}
