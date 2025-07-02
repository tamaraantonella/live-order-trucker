import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly appService: OrdersService) {}

  @Get(':id')
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.appService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getUserOrders(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ): Promise<Order[]> {
    if (req.user.role !== 'delivery' && req.user.id !== userId) {
      throw new UnauthorizedException('Unauthorized to access these orders');
    }
    return this.appService.getUserOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ): Promise<Order> {
    if (req.user.role !== 'delivery') {
      throw new UnauthorizedException(
        'Only delivery users can update order status',
      );
    }
    return this.appService.updateOrderStatus(id, updateOrderStatusDto.status);
  }
}
