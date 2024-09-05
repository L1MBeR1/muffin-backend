import { PrismaClient } from '@prisma/client';
import seedRoles from './seeders/roles.seed';
import seedUsers from './seeders/user.seed';

const prisma = new PrismaClient();

async function main() {
	try {
		await seedRoles(prisma);

		await seedUsers(prisma);

		console.log('Seeding completed successfully.');
	} catch (error) {
		console.error('Error seeding data:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
