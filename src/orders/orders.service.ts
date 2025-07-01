import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from '../types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
