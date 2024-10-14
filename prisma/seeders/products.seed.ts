import { PrismaClient } from '@prisma/client';

const categories = [
	{ name: 'Хлеб', description: 'Различные виды хлеба' },
	{ name: 'Пирожные', description: 'Свежие пирожные и торты' },
	{ name: 'Кексы', description: 'Домашние кексы и маффины' },
	{ name: 'Печенье', description: 'Печенье на любой вкус' },
	{ name: 'Выпечка', description: 'Свежая выпечка' },
];

const products = [
	{
		name: 'Бородинский хлеб',
		description: 'Черный хлеб с кориандром',
		price: 150,
		categoryId: 1,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Круассан',
		description: 'Французский круассан с маслом',
		price: 200,
		categoryId: 5,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Торт Наполеон',
		description: 'Классический слоеный торт',
		price: 350,
		categoryId: 2,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Маффин шоколадный',
		description: 'Шоколадный маффин с кусочками шоколада',
		price: 250,
		categoryId: 3,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Овсяное печенье',
		description: 'Хрустящее овсяное печенье',
		price: 100,
		categoryId: 4,
		isGlutenFree: false,
		isVegan: true,
	},
	{
		name: 'Пирожок с капустой',
		description: 'Традиционный пирожок с капустой',
		price: 120,
		categoryId: 5,
		isGlutenFree: false,
		isVegan: true,
	},
	{
		name: 'Булочка с изюмом',
		description: 'Сдобная булочка с изюмом',
		price: 130,
		categoryId: 5,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Эклер',
		description: 'Воздушный эклер с ванильным кремом',
		price: 280,
		categoryId: 2,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Ржаной хлеб',
		description: 'Плотный ржаной хлеб',
		price: 180,
		categoryId: 1,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Ванильный кекс',
		description: 'Нежный ванильный кекс',
		price: 220,
		categoryId: 3,
		isGlutenFree: false,
		isVegan: false,
	},
];

async function seedProducts(prisma: PrismaClient) {
	try {
		await prisma.$transaction(async prisma => {
			for (const category of categories) {
				await prisma.category.create({
					data: category,
				});
			}

			for (const product of products) {
				await prisma.product.create({
					data: product,
				});
			}
		});

		console.log('Products seeded.');
	} catch (e) {
		console.error('Error', e);
	} finally {
		await prisma.$disconnect();
	}
}

export default seedProducts;
