import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

export default async function seedAddresses(prisma: PrismaClient) {
	const users = await prisma.user.findMany();

	const addresses = await Promise.all(
		users.map(async user => {
			const userAddresses = [];

			for (let i = 0; i < 10; i++) {
				const latitude = faker.location.latitude({ min: 55.74, max: 55.77 });
				const longitude = faker.location.longitude({ min: 37.58, max: 37.65 });

				const address = {
					address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}`,
					state: 'Москва',
					city: 'Москва',
					latitude,
					longitude,
					userId: user.id,
				};

				userAddresses.push(prisma.address.create({ data: address }));
			}

			return await Promise.all(userAddresses);
		}),
	);

	console.log('Addresses seeded');
}
