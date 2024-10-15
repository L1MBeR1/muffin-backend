import { Injectable } from '@nestjs/common';
import { eachDayOfInterval, format, subMonths } from 'date-fns';
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

		const paidAtCondition: any = {
			not: null,
		};

		if (startDate) {
			paidAtCondition.gte = startDate;
		}
		if (endDate) {
			paidAtCondition.lte = endDate;
		}

		const productOrders = await this.prisma.product.findMany({
			where: whereCondition,
			select: {
				id: true,
				name: true,
				OrderItem: {
					where: {
						order: {
							paidAt: paidAtCondition,
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

		if (
			productOrders.length === 0 ||
			productOrders.every(product => product.OrderItem.length === 0)
		) {
			return null;
		}

		const result = productOrders
			.filter(product => product.OrderItem.length > 0)
			.map(product => ({
				id: product.id,
				name: product.name,
				orders: product.OrderItem.map(item => ({
					orderNumber: item.order.id,
					orderDate: item.order.createdAt,
					paymentDate: item.order.paidAt || null,
					quantity: item.quantity,
					totalPrice: item.price.toNumber() * item.quantity,
				})).sort((a, b) =>
					a.paymentDate && b.paymentDate
						? a.paymentDate.getTime() - b.paymentDate.getTime()
						: 0,
				),
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		return result.length > 0 ? result : null;
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

	async getBakeriesWithOrderCount(dto: SalesAnalysisDto) {
		const { startDate, endDate, productId } = dto;

		const bakeries = await this.prisma.bakery.findMany({
			include: {
				orders: {
					where: {
						AND: [
							...(startDate && endDate
								? [
										{
											paidAt: {
												gte: startDate,
												lte: endDate,
											},
										},
									]
								: []),
							{
								paidAt: {
									not: null,
								},
							},
							...(productId
								? [
										{
											items: {
												some: {
													productId: productId,
												},
											},
										},
									]
								: []),
						],
					},
					select: {
						id: true,
					},
				},
			},
		});

		const bakeryWithOrderCount = bakeries.map(bakery => ({
			id: bakery.id,
			address: bakery.address,
			latitude: bakery.latitude,
			longitude: bakery.longitude,
			orderCount: bakery.orders.length,
		}));

		return bakeryWithOrderCount;
	}

	async getCustomerCoordinatesByProductAndDate(dto: SalesAnalysisDto) {
		const { startDate, endDate, productId } = dto;

		const orders = await this.prisma.order.findMany({
			where: {
				AND: [
					...(startDate && endDate
						? [
								{
									paidAt: {
										gte: startDate,
										lte: endDate,
									},
								},
							]
						: []),
					{
						paidAt: {
							not: null,
						},
					},
					...(productId
						? [
								{
									items: {
										some: {
											productId: productId,
										},
									},
								},
							]
						: []),
				],
			},
			include: {
				address: {
					select: {
						latitude: true,
						longitude: true,
					},
				},
			},
		});

		const customerCoordinates = orders
			.map(order => ({
				latitude: order.address?.latitude,
				longitude: order.address?.longitude,
			}))
			.filter(coord => coord.latitude !== null && coord.longitude !== null);
		return customerCoordinates;
	}

	async getOrderCountPerDay(dto: SalesAnalysisDto) {
		const { startDate, endDate, productId } = dto;

		const defaultStartDate = subMonths(new Date(), 3);
		const defaultEndDate = new Date();

		const finalStartDate = startDate || defaultStartDate;
		const finalEndDate = endDate || defaultEndDate;
		const orders = await this.prisma.order.findMany({
			where: {
				paidAt: {
					gte: finalStartDate,
					lte: finalEndDate,
					not: null,
				},
				items: {
					some: {
						productId: productId || undefined,
					},
				},
			},
			select: {
				id: true,
				paidAt: true,
			},
			orderBy: {
				paidAt: 'asc',
			},
		});

		const ordersByDate = orders.reduce(
			(acc, order) => {
				const date = format(order.paidAt, 'yyyy-MM-dd');
				if (!acc[date]) {
					acc[date] = 0;
				}
				acc[date] += 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const allDaysInRange = eachDayOfInterval({
			start: finalStartDate,
			end: finalEndDate,
		}).map(date => format(date, 'yyyy-MM-dd'));

		const result = allDaysInRange.map(date => ({
			date,
			count: ordersByDate[date] || 0,
		}));

		return result;
	}
}
