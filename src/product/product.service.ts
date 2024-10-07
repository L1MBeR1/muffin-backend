import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetProductsWithOrdersDto } from './dto/getProductWithOriders.dto';

@Injectable()
export class ProductService {
	constructor(private readonly prisma: PrismaService) {}

	async getProductsWithOrders(dto: GetProductsWithOrdersDto) {
		const { startDate, endDate, productId } = dto;

		const whereClause: any = {};

		if (startDate && endDate) {
			whereClause.createdAt = {
				gte: startDate,
				lte: endDate,
			};
		}

		if (productId) {
			whereClause.items = {
				some: {
					productId: productId,
				},
			};
		}

		const products = await this.prisma.product.findMany({
			where: productId ? { id: productId } : {},
			include: {
				OrderItem: {
					where: {
						...whereClause,
						order: {
							isCart: false,
							paidAt: {
								not: null,
							},
						},
					},
					include: {
						order: true,
					},
				},
			},
		});

		return products.map(product => ({
			id: product.id,
			name: product.name,
			orders: product.OrderItem.map(orderItem => ({
				orderNumber: orderItem.order.id,
				orderDate: orderItem.order.createdAt,
				paymentDate: orderItem.order.paidAt,
				quantity: orderItem.quantity,
				totalPrice: orderItem.quantity * product.price.toNumber(),
			})),
		}));
	}
}
