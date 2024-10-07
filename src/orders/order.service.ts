import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
	constructor(private readonly prisma: PrismaService) {}
	async getOrdersByProductAndPeriod(
		startDate: Date,
		endDate: Date,
		productId?: number,
	) {
		const whereClause: any = {
			createdAt: {
				gte: startDate,
				lte: endDate,
			},
		};

		if (productId) {
			whereClause.items = {
				some: {
					productId: productId,
				},
			};
		}

		return this.prisma.order.findMany({
			where: whereClause,
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	}
}
