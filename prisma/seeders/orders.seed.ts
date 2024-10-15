import { faker } from '@faker-js/faker';
import { OrderStatus, PrismaClient } from '@prisma/client';

function getRandomDateWithinSixMonths() {
	const now = new Date();
	const pastDate = new Date();
	pastDate.setMonth(now.getMonth() - 3);

	const randomTime = faker.number.int({
		min: pastDate.getTime(),
		max: now.getTime(),
	});
	return new Date(randomTime);
}

export default async function seedOrders(prisma: PrismaClient) {
	const users = await prisma.user.findMany();
	const bakeries = await prisma.bakery.findMany();
	const products = await prisma.product.findMany();
	const statuses = [
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.completed,
		OrderStatus.completed,
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
		const userAddresses = await prisma.address.findMany({
			where: { userId: user.id },
		});

		if (userAddresses.length === 0) continue;
		const orderCount = faker.number.int({ min: 8, max: 16 });

		for (let i = 0; i < orderCount; i++) {
			const randomAddress =
				userAddresses[Math.floor(Math.random() * userAddresses.length)];
			const randomBakery =
				bakeries[Math.floor(Math.random() * bakeries.length)];
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

			const createdAt = getRandomDateWithinSixMonths();
			let paymentDate = null;

			if (randomStatus === OrderStatus.completed) {
				paymentDate = new Date(createdAt);

				if (faker.datatype.boolean()) {
					paymentDate.setDate(paymentDate.getDate() + 1);
				}
			}

			await prisma.order.create({
				data: {
					userId: user.id,
					totalAmount: totalAmount,
					status: randomStatus,
					isCart: false,
					addressId: randomAddress?.id || null,
					bakeryId: randomBakery?.id || null,
					createdAt,
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
