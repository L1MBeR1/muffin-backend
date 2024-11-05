import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

type Point = {
	latitude: number;
	longitude: number;
};

type Polygon = Point[];

const isPointInPolygon = (point: Point, polygon: Polygon): boolean => {
	const x = point.latitude,
		y = point.longitude;
	let inside = false;

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].latitude,
			yi = polygon[i].longitude;
		const xj = polygon[j].latitude,
			yj = polygon[j].longitude;

		const intersect =
			yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
};

const generateRandomCoordinates = (
	minLat: number,
	maxLat: number,
	minLong: number,
	maxLong: number,
	excludePolygon: Polygon,
): Point => {
	let latitude: number;
	let longitude: number;

	do {
		latitude = faker.location.latitude({ min: minLat, max: maxLat });
		longitude = faker.location.longitude({ min: minLong, max: maxLong });
	} while (isPointInPolygon({ latitude, longitude }, excludePolygon));

	return { latitude, longitude };
};

const excludePolygon: Polygon = [
	{ latitude: 52.194859, longitude: 104.316097 },
	{ latitude: 52.231258, longitude: 104.316302 },
	{ latitude: 52.240739, longitude: 104.2946 },
	{ latitude: 52.247046, longitude: 104.280267 },
	{ latitude: 52.304669, longitude: 104.24627 },
	{ latitude: 52.309612, longitude: 104.28777 },
	{ latitude: 52.295842, longitude: 104.292895 },
	{ latitude: 52.289308, longitude: 104.267417 },
	{ latitude: 52.285379, longitude: 104.267128 },
	{ latitude: 52.261127, longitude: 104.297132 },
	{ latitude: 52.252821, longitude: 104.34585 },
	{ latitude: 52.250713, longitude: 104.345657 },
	{ latitude: 52.249729, longitude: 104.344712 },
	{ latitude: 52.244339, longitude: 104.348361 },
	{ latitude: 52.248286, longitude: 104.376193 },
	{ latitude: 52.211017, longitude: 104.369934 },
];

export default async function seedAddresses(prisma: PrismaClient) {
	const users = await prisma.user.findMany();

	const addresses = await Promise.all(
		users.map(async user => {
			const userAddresses = [];

			for (let i = 0; i < 10; i++) {
				const { latitude, longitude } = generateRandomCoordinates(
					52.2295,
					52.2981,
					104.2379,
					104.3494,
					excludePolygon,
				);

				const address = {
					address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}`,
					state: 'Иркутск',
					city: 'Иркутск',
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
