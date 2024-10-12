import { PrismaClient } from '@prisma/client';

const bakeries = [
	{
		address: 'ул. Тверская, д. 7',
		phone: '+7 (495) 111-11-11',
		openingHours: '8:00 - 20:00',
		latitude: 55.758,
		longitude: 37.6016,
	},
	{
		address: 'ул. Арбат, д. 15',
		phone: '+7 (495) 222-22-22',
		openingHours: '9:00 - 21:00',
		latitude: 55.75,
		longitude: 37.6045,
	},
	{
		address: 'ул. Петровка, д. 10',
		phone: '+7 (495) 333-33-33',
		openingHours: '7:00 - 19:00',
		latitude: 55.7592,
		longitude: 37.6199,
	},
	{
		address: 'ул. Лубянка, д. 5',
		phone: '+7 (495) 444-44-44',
		openingHours: '10:00 - 22:00',
		latitude: 55.7593,
		longitude: 37.6292,
	},
	{
		address: 'ул. Мясницкая, д. 12',
		phone: '+7 (495) 555-55-55',
		openingHours: '6:00 - 18:00',
		latitude: 55.7652,
		longitude: 37.637,
	},
];

export default async function seedBakeries(prisma: PrismaClient) {
	for (const bakery of bakeries) {
		await prisma.bakery.create({
			data: bakery,
		});
	}

	console.log('Bakeries seeded');
}
