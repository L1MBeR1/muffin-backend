import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
	try {
		await prisma.productBakery.deleteMany({});
		await prisma.productDiscount.deleteMany({});
		await prisma.orderItem.deleteMany({});
		await prisma.feedback.deleteMany({});
		await prisma.address.deleteMany({});
		await prisma.userRole.deleteMany({});
		await prisma.order.deleteMany({});
		await prisma.role.deleteMany({});
		await prisma.discount.deleteMany({});
		await prisma.category.deleteMany({});
		await prisma.bakery.deleteMany({});
		await prisma.product.deleteMany({});
		await prisma.user.deleteMany({});

		console.log('Database cleaned');
	} catch (error) {
		console.error('Error cleaning database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

cleanDatabase();
