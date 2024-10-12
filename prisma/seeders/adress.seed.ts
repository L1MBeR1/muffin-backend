import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export default async function seedAddresses(prisma: PrismaClient) {
	const users = await prisma.user.findMany();

	const addresses = await Promise.all(
		users.map(async user => {
			const latitude = faker.location.latitude({ min: 55.55, max: 55.85 });
			const longitude = faker.location.longitude({ min: 37.3, max: 37.8 });

			const address = {
				address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}`,
				state: 'Москва',
				city: 'Москва',
				latitude,
				longitude,
				userId: user.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			return await prisma.address.create({ data: address });
		}),
	);
	console.log('Addresses seeded');
}
