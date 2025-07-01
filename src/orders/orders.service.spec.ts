import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '../types';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockOrder: Order = {
    id: 1,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
    user: { id: 1, email: 'test@example.com', role: 'client' },
  } as Order;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserOrders', () => {
    it('should return orders for a user', async () => {
      const userId = 1;
      const expectedOrders = [mockOrder];

      mockRepository.find.mockResolvedValue(expectedOrders);

      const result = await service.getUserOrders(userId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(expectedOrders);
    });

    it('should return empty array when user has no orders', async () => {
      const userId = 1;

      mockRepository.find.mockResolvedValue([]);

      const result = await service.getUserOrders(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('should return an order when found', async () => {
      const orderId = 1;

      mockRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.getOrderById(orderId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = 999;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getOrderById(orderId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId },
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = 1;
      const newStatus: OrderStatus = 'in_progress';
      const updatedOrder = { ...mockOrder, status: newStatus };

      mockRepository.findOneBy.mockResolvedValue(mockOrder);
      mockRepository.save.mockResolvedValue(updatedOrder);

      const result = await service.updateOrderStatus(orderId, newStatus);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: orderId });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockOrder,
        status: newStatus,
      });
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      const orderId = 999;
      const newStatus: OrderStatus = 'delivered';

      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateOrderStatus(orderId, newStatus),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: orderId });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
