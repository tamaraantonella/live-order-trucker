import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../types';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'in_progress', 'delivered'], {
    message: 'Status must be one of: pending, in_progress, delivered',
  })
  status: OrderStatus;
}
