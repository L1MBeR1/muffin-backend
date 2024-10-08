import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetProductsWithOrdersDto } from './dto/getProductWithOriders.dto';

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllProductsForSelect() {
		const products = await this.prisma.product.findMany({
			select: {
				id: true,
				name: true,
			},
		});

		return products;
	}

	async getProductsWithOrders(dto: GetProductsWithOrdersDto) {
		const { startDate, endDate, productId } = dto;

		const whereCondition = productId ? { id: productId } : undefined;

		const productOrders = await this.prisma.product.findMany({
			where: whereCondition,
			select: {
				id: true,
				name: true,
				OrderItem: {
					where: {
						order: {
							paidAt: {
								not: null,
								gte: startDate,
								lte: endDate,
							},
						},
					},
					select: {
						order: {
							select: {
								id: true,
								createdAt: true,
								paidAt: true,
							},
						},
						quantity: true,
						price: true,
					},
				},
			},
		});

		if (productOrders.length === 0) {
			return null;
		}

		const result = productOrders.map(product => ({
			id: product.id,
			name: product.name,
			orders: product.OrderItem.map(item => ({
				orderNumber: item.order.id,
				orderDate: item.order.createdAt,
				paymentDate: item.order.paidAt || null,
				quantity: item.quantity,
				totalPrice: item.price.toNumber() * item.quantity,
			})),
		}));

		return result;
	}
}
