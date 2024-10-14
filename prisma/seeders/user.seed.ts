import { faker } from '@faker-js/faker';
import { Gender, PrismaClient, Roles } from '@prisma/client';
import * as argon2 from 'argon2';

export default async function seedUsers(prisma: PrismaClient) {
	const users = await Promise.all(
		Array.from({ length: 30 }).map(async (_, index) => {
			const userData = {
				firstName: faker.person.firstName().slice(0, 50),
				lastName: faker.person.lastName().slice(0, 50),
				email:
					index === 0
						? 'admin@gmail.com'
						: index === 1
							? 'collector@gmail.com'
							: faker.internet.email().slice(0, 100),
				phone: faker.phone.number().slice(0, 20),
				password: await argon2.hash('password'),
				birthDate: faker.helpers.maybe(
					() => faker.date.birthdate({ min: 14, max: 60, mode: 'age' }),
					{ probability: 0.8 },
				),
				gender: faker.helpers.maybe(
					() => faker.helpers.arrayElement(['male', 'female']) as Gender,
					{ probability: 0.8 },
				),
				isBlocked: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const user = await prisma.user.create({
				data: {
					...userData,
					roles: {
						create: [
							{ role: { connect: { name: Roles.user } } },
							...(index === 0
								? [{ role: { connect: { name: Roles.admin } } }]
								: index === 1
									? [{ role: { connect: { name: Roles.collector } } }]
									: []),
						],
					},
				},
			});

			return user;
		}),
	);

	console.log('Users seeding completed.');
}
