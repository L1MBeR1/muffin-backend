import { PrismaClient } from '@prisma/client';
import seedAddresses from './seeders/adress.seed';
import seedBakeries from './seeders/bakeries.seed';
import seedOrders from './seeders/orders.seed';
import seedProducts from './seeders/products.seed';
import seedRoles from './seeders/roles.seed';
import seedUsers from './seeders/user.seed';

const prisma = new PrismaClient();

async function main() {
	try {
		await seedRoles(prisma);

		await seedUsers(prisma);

		await seedProducts(prisma);

		await seedBakeries(prisma);

		await seedOrders(prisma);

		await seedAddresses(prisma);
		console.log('Seeding completed successfully.');
	} catch (error) {
		console.error('Error seeding data:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
