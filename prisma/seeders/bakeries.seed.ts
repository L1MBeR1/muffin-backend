import { PrismaClient } from '@prisma/client';

const bakeries = [
	{
		address: 'ул. Пискунова, д. 136',
		phone: '+7 (3952) 111-11-11',
		openingHours: '8:00 - 20:00',
		latitude: 52.2722,
		longitude: 104.3343,
	},
	{
		address: 'ул. ​Академическая, д. 27а',
		phone: '+7 (3952) 222-22-22',
		openingHours: '9:00 - 21:00',
		latitude: 52.23355492004858,
		longitude: 104.30093135452738,
	},
	{
		address: 'ул. Красного Восстания, д. 24',
		phone: '+7 (3952) 333-33-33',
		openingHours: '7:00 - 19:00',
		latitude: 52.27541163727645,
		longitude: 104.28617071054693,
	},
	{
		address: 'ул. ​Карла Маркса, д. 41/1',
		phone: '+7 (3952) 444-44-44',
		openingHours: '10:00 - 22:00',
		latitude: 52.287964214038425,
		longitude: 104.29180583558991,
	},
	{
		address: 'ул. Лермонтова, д. 65',
		phone: '+7 (3952) 444-44-45',
		openingHours: '10:00 - 22:00',
		latitude: 52.268844,
		longitude: 104.257849,
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
