import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.appService.getOrderById(id);
  }

  @Get('user/:userId')
  async getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Order[]> {
    return this.appService.getUserOrders(userId);
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.appService.updateOrderStatus(id, updateOrderStatusDto.status);
  }
}
