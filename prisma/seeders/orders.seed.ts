import { faker } from '@faker-js/faker';
import { OrderStatus, PrismaClient } from '@prisma/client';

export default async function seedOrders(prisma: PrismaClient) {
	const users = await prisma.user.findMany();
	const bakeries = await prisma.bakery.findMany();
	const addresses = await prisma.address.findMany();
	const products = await prisma.product.findMany();
	const statuses = [
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.pending,
		OrderStatus.processing,
		OrderStatus.assembling,
		OrderStatus.delivery,
		OrderStatus.completed,
		OrderStatus.cancelled,
	];

	for (const user of users) {
		for (let i = 0; i < 2; i++) {
			const randomBakery =
				bakeries[Math.floor(Math.random() * bakeries.length)];
			const randomAddress = addresses.find(
				address => address.userId === user.id,
			);
			const randomStatus =
				statuses[Math.floor(Math.random() * statuses.length)];

			const orderItems = [
				{
					productId: faker.number.int({ min: 1, max: 10 }),
					quantity: faker.number.int({ min: 1, max: 5 }),
				},
				{
					productId: faker.number.int({ min: 1, max: 10 }),
					quantity: faker.number.int({ min: 1, max: 5 }),
				},
			];

			let totalAmount = 0;
			const itemsData = orderItems.map(item => {
				const product = products.find(p => p.id === item.productId);
				const price = product?.price.toNumber() || 0;
				totalAmount += price * item.quantity;

				return {
					productId: item.productId,
					quantity: item.quantity,
					price,
				};
			});

			let paymentDate = null;
			if (randomStatus === OrderStatus.completed) {
				const orderDate = new Date();

				const daysToAdd = faker.number.int({ min: 0, max: 1 });
				orderDate.setDate(orderDate.getDate() + daysToAdd);

				paymentDate = orderDate;
			}

			await prisma.order.create({
				data: {
					userId: user.id,
					totalAmount: totalAmount,
					status: randomStatus,
					isCart: false,
					addressId: randomAddress?.id || null,
					bakeryId: randomBakery?.id || null,
					paidAt: paymentDate,
					items: {
						create: itemsData,
					},
				},
			});
		}
	}
	console.log('Orders seeded');
}
