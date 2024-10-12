import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SalesAnalysisDto } from './dto/getProductWithOriders.dto';

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

	async getProductsWithOrders(dto: SalesAnalysisDto) {
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

	async getCustomerDataForCharts(dto: SalesAnalysisDto) {
		const { startDate, endDate, productId } = dto;

		const productFilter = productId ? { productId } : {};

		const dateFilter: any = { paidAt: { not: null } };

		if (startDate) {
			dateFilter.paidAt.gte = startDate;
		}
		if (endDate) {
			dateFilter.paidAt.lte = endDate;
		}

		const customerData = await this.prisma.order.findMany({
			where: {
				AND: [dateFilter, productId ? { items: { some: productFilter } } : {}],
			},
			select: {
				user: {
					select: {
						id: true,
						birthDate: true,
						gender: true,
					},
				},
			},
		});

		if (!customerData || customerData.length === 0) {
			return null;
		}

		const ageGroups = {
			'<18': 0,
			'18-29': 0,
			'30-39': 0,
			'40-49': 0,
			'50<': 0,
			unknown: 0,
		};
		const genderGroups = { male: 0, female: 0, unknown: 0 };

		const currentYear = new Date().getFullYear();

		customerData.forEach(order => {
			const birthYear = order.user.birthDate?.getFullYear();
			if (birthYear) {
				const age = currentYear - birthYear;

				if (age < 18) {
					ageGroups['<18']++;
				} else if (age >= 18 && age <= 29) {
					ageGroups['18-29']++;
				} else if (age >= 30 && age <= 39) {
					ageGroups['30-39']++;
				} else if (age >= 40 && age <= 49) {
					ageGroups['40-49']++;
				} else if (age >= 50) {
					ageGroups['50<']++;
				}
			} else {
				ageGroups['unknown']++;
			}

			if (order.user.gender) {
				genderGroups[order.user.gender]++;
			} else {
				genderGroups['unknown']++;
			}
		});

		return {
			ageDistribution: ageGroups,
			genderDistribution: genderGroups,
		};
	}
}
