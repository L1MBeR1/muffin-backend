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
		price: 1.5,
		categoryId: 1,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Круассан',
		description: 'Французский круассан с маслом',
		price: 2.0,
		categoryId: 5,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Торт Наполеон',
		description: 'Классический слоеный торт',
		price: 3.5,
		categoryId: 2,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Маффин шоколадный',
		description: 'Шоколадный маффин с кусочками шоколада',
		price: 2.5,
		categoryId: 3,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Овсяное печенье',
		description: 'Хрустящее овсяное печенье',
		price: 1.0,
		categoryId: 4,
		isGlutenFree: false,
		isVegan: true,
	},
	{
		name: 'Пирожок с капустой',
		description: 'Традиционный пирожок с капустой',
		price: 1.2,
		categoryId: 5,
		isGlutenFree: false,
		isVegan: true,
	},
	{
		name: 'Булочка с изюмом',
		description: 'Сдобная булочка с изюмом',
		price: 1.3,
		categoryId: 5,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Эклер',
		description: 'Воздушный эклер с ванильным кремом',
		price: 2.8,
		categoryId: 2,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Ржаной хлеб',
		description: 'Плотный ржаной хлеб',
		price: 1.8,
		categoryId: 1,
		isGlutenFree: false,
		isVegan: false,
	},
	{
		name: 'Ванильный кекс',
		description: 'Нежный ванильный кекс',
		price: 2.2,
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
