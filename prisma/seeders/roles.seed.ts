import { PrismaClient, Roles } from '@prisma/client';

export default async function seedRoles(prisma: PrismaClient) {
	await prisma.role.createMany({
		data: [
			{ name: Roles.admin },
			{ name: Roles.collector },
			{ name: Roles.user },
		],
		skipDuplicates: true,
	});

	console.log('Roles seeded.');
}
