import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,

    private readonly cartService: CartService,
  ) {}

   

  async createFromCart(userId: string) {
    const cart = await this.cartService.getCartByUser(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmount = 0;

    const orderItems = cart.items.map(item => {
      const price = item.unitPrice;
      totalAmount += price * item.quantity;

      return {
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        quantity: item.quantity,
        price,
      };
    });

    const order = await this.ordersRepository.save({
      userId,
      status: 'CREATED',
      paymentStatus: 'PENDING',
      totalAmount,
    });

    await this.orderItemsRepository.save(
      orderItems.map(item => ({
        ...item,
        orderId: order.id,
      })),
    );

    return order;
  }

 
  async checkout(userId: string, cartToken: string, address: any) {
    const cart = await this.cartService.getCart(cartToken);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmount = 0;

    const orderItems = cart.items.map(item => {
      const price = item.unitPrice;
      totalAmount += price * item.quantity;

      return {
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        quantity: item.quantity,
        price,
      };
    });

    const order = await this.ordersRepository.save({
      userId,
      cartToken, 
      status: 'CREATED',
      paymentStatus: 'PENDING',
      totalAmount,
      shippingAddress: address,
    });

    await this.orderItemsRepository.save(
      orderItems.map(item => ({
        ...item,
        orderId: order.id,
      })),
    );

    return order;
  }

  
  async createBuyNowOrder({
    userId,
    product,
    quantity,
  }: {
    userId: string;
    product: Product;
    quantity: number;
  }): Promise<Order> {
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (quantity < 1) {
      throw new BadRequestException('Invalid quantity');
    }

    const totalAmount = Number(product.price) * quantity;

    const order = await this.ordersRepository.save({
      userId,
      status: 'CREATED',
      paymentStatus: 'PENDING',
      totalAmount,
    });

    await this.orderItemsRepository.save({
      orderId: order.id,
      productId: product.id,
      productName: product.name,
      productImage: product.thumbnail || '',
      quantity,
      price: product.price,
    });

    return order;
  }


  async findByUser(userId: string) {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }


 async markOrderPaid(orderId: string, paymentIntentId: string) {
  console.log('🔥 markOrderPaid START', orderId);

  const order = await this.ordersRepository.findOne({
    where: { id: orderId },
  });

  console.log('🧾 order.cartToken =', order?.cartToken);

  if (!order) return;

  await this.ordersRepository.update(orderId, {
    status: 'PAID',
    paymentStatus: 'PAID',
    stripePaymentIntentId: paymentIntentId,
  });

  if (order.cartToken) {
    await this.cartService.clearCartByToken(order.cartToken);
  }
}
 async createZelleOrder(user: any, body: any) {
  const { cartToken, items, totalAmount, shippingAddress } = body;

  // 🟢 CART ZELLE FLOW (Option A)
  if (cartToken) {
    const cart = await this.cartService.getCart(cartToken);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let calculatedTotal = 0;

    const order = await this.ordersRepository.save({
      userId: user.id,
      cartToken,
      status: 'CREATED',
      paymentMethod: 'ZELLE',
      paymentStatus: 'AWAITING_ZELLE_PAYMENT',
      shippingAddress,
      totalAmount: 0, // temp
    });

    const orderItems = cart.items.map(item => {
      const price = item.unitPrice;
      calculatedTotal += price * item.quantity;

      return {
        orderId: order.id,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        quantity: item.quantity,
        price,
      };
    });

    await this.orderItemsRepository.save(orderItems);

    await this.ordersRepository.update(order.id, {
      totalAmount: calculatedTotal,
    });

    return order;
  }

  // 🔵 BUY NOW ZELLE FLOW (existing behavior)
  if (!items || items.length === 0 || !totalAmount) {
    throw new BadRequestException('Order items missing');
  }

  const order = await this.ordersRepository.save({
    userId: user.id,
    status: 'CREATED',
    paymentMethod: 'ZELLE',
    paymentStatus: 'AWAITING_ZELLE_PAYMENT',
    totalAmount,
    shippingAddress,
  });

  await this.orderItemsRepository.save(
    items.map(item => ({
      ...item,
      orderId: order.id,
    })),
  );

  return order;
}

  async markZelleOrderPaid(orderId: string) {
  const order = await this.ordersRepository.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new BadRequestException('Order not found');
  }

  if (order.paymentMethod !== 'ZELLE') {
    throw new BadRequestException('Not a Zelle order');
  }

  await this.ordersRepository.update(orderId, {
    status: 'PAID',
    paymentStatus: 'PAID',
  });

  if (order.cartToken) {
    await this.cartService.clearCartByToken(order.cartToken);
  }

  return { success: true };
}
}
